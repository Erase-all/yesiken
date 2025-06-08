import { NextRequest, NextResponse } from 'next/server';
import { TravelSpot } from '@/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  
  if (!query) {
    return NextResponse.json({ error: '검색어를 입력해주세요.' }, { status: 400 });
  }

  try {
    // 네이버 지역 검색 API 호출
    const searchQuery = `${query} 관광지`;
    const apiUrl = `https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent(searchQuery)}&display=20&start=1&sort=random`;
    
    console.log('API 호출:', apiUrl);
    console.log('Client ID:', process.env.NAVER_SEARCH_CLIENT_ID);
    
    const response = await fetch(apiUrl, {
      headers: {
        'X-Naver-Client-Id': process.env.NAVER_SEARCH_CLIENT_ID || '',
        'X-Naver-Client-Secret': process.env.NAVER_SEARCH_SECRET || '',
      },
    });

    if (!response.ok) {
      throw new Error(`네이버 API 오류: ${response.status}`);
    }

    const data = await response.json();
    
    // 네이버 API 응답을 TravelSpot 형태로 변환
    const spots: TravelSpot[] = data.items.map((item: any, index: number) => {
      // HTML 태그 제거 함수
      const removeHtmlTags = (str: string) => {
        return str.replace(/<[^>]*>/g, '');
      };

      return {
        name: removeHtmlTags(item.title),
        lat: 0, // 네이버 지역 검색 API는 좌표를 제공하지 않으므로 기본값
        lng: 0, // 실제로는 Geocoding API나 별도 처리 필요
        description: removeHtmlTags(item.description || `${query} 지역의 관광명소`),
        address: removeHtmlTags(item.address),
        phone: item.telephone || '',
        category: removeHtmlTags(item.category)
      };
    });

    // 좌표가 없는 경우를 위한 임시 처리 (실제로는 Geocoding 필요)
    const spotsWithCoords = await addCoordinates(spots, query);

    return NextResponse.json({ spots: spotsWithCoords });
  } catch (error) {
    console.error('검색 API 오류:', error);
    
    // API 오류 시 기본 데이터 반환 (폴백)
    const fallbackSpots = getFallbackSpots(query);
    return NextResponse.json({ spots: fallbackSpots });
  }
}

// 좌표 추가 함수 (실제로는 Geocoding API 사용 권장)
async function addCoordinates(spots: TravelSpot[], city: string): Promise<TravelSpot[]> {
  // 기본 좌표 설정 (도시별 중심점)
  const cityCoords: { [key: string]: { lat: number; lng: number } } = {
    '제주': { lat: 33.4996, lng: 126.5312 },
    '부산': { lat: 35.1796, lng: 129.0756 },
    '서울': { lat: 37.5665, lng: 126.9780 },
    '강릉': { lat: 37.7519, lng: 128.8761 },
    '경주': { lat: 35.8562, lng: 129.2247 },
    '전주': { lat: 35.8242, lng: 127.1479 },
    '여수': { lat: 34.7604, lng: 127.6622 },
    '포항': { lat: 36.0190, lng: 129.3435 },
    '대구': { lat: 35.8714, lng: 128.6014 },
    '인천': { lat: 37.4563, lng: 126.7052 },
    '광주': { lat: 35.1595, lng: 126.8526 },
    '대전': { lat: 36.3504, lng: 127.3845 },
  };

  let baseCoord = { lat: 37.5665, lng: 126.9780 }; // 기본값: 서울
  
  // 도시명에 맞는 기본 좌표 찾기
  for (const [key, coord] of Object.entries(cityCoords)) {
    if (city.includes(key)) {
      baseCoord = coord;
      break;
    }
  }

  // 각 장소에 약간씩 다른 좌표 부여 (실제로는 정확한 Geocoding 필요)
  return spots.map((spot, index) => ({
    ...spot,
    lat: baseCoord.lat + (Math.random() - 0.5) * 0.1, // ±0.05도 범위
    lng: baseCoord.lng + (Math.random() - 0.5) * 0.1,
  }));
}

// 폴백 데이터 (API 실패 시)
function getFallbackSpots(query: string): TravelSpot[] {
  console.log('폴백 데이터 사용 - 검색어:', query);
  
  const fallbackData: { [key: string]: TravelSpot[] } = {
    '제주': [
      { name: '성산일출봉', lat: 33.4583, lng: 126.9408, description: '유네스코 세계자연유산', address: '제주특별자치도 서귀포시 성산읍' },
      { name: '한라산', lat: 33.3617, lng: 126.5292, description: '제주도의 상징', address: '제주특별자치도 제주시' },
      { name: '중문관광단지', lat: 33.2388, lng: 126.4175, description: '제주 대표 관광지', address: '제주특별자치도 서귀포시 중문동' },
    ],
    '부산': [
      { name: '해운대해수욕장', lat: 35.1587, lng: 129.1603, description: '부산 대표 해수욕장', address: '부산광역시 해운대구' },
      { name: '광안리해수욕장', lat: 35.1532, lng: 129.1189, description: '광안대교 야경 명소', address: '부산광역시 수영구' },
      { name: '감천문화마을', lat: 35.0979, lng: 129.0107, description: '산토리니 닮은 마을', address: '부산광역시 사하구' },
    ],
    '대구': [
      { name: '팔공산', lat: 35.9675, lng: 128.6847, description: '대구 대표 산', address: '대구광역시 동구 팔공산로' },
      { name: '서문시장', lat: 35.8675, lng: 128.5847, description: '대구 전통시장', address: '대구광역시 중구 큰장로' },
      { name: '동성로', lat: 35.8714, lng: 128.6014, description: '대구 중심가', address: '대구광역시 중구 동성로' },
    ],
  };

  for (const city in fallbackData) {
    if (query.includes(city)) {
      return fallbackData[city];
    }
  }

  return fallbackData['제주']; // 기본값
} 