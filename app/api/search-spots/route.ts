import { NextRequest, NextResponse } from 'next/server';
import { TravelSpot } from '@/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  
  if (!query) {
    return NextResponse.json({ error: '검색어를 입력해주세요.' }, { status: 400 });
  }

  try {
    // 카테고리별 검색어 정의
    const categories = [
      { name: '관광지', query: `${query} 관광지`, maxResults: 8 },
      { name: '식당', query: `${query} 맛집`, maxResults: 6 },
      { name: '카페', query: `${query} 카페`, maxResults: 6 }
    ];

    console.log(`${query} 지역 카테고리별 검색 시작`);
    
    let allSpots: TravelSpot[] = [];

    // 각 카테고리별로 검색 수행
    for (const category of categories) {
      try {
        const apiUrl = `https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent(category.query)}&display=${category.maxResults}&start=1&sort=random`;
        
        console.log(`${category.name} 검색:`, apiUrl);
        
        const response = await fetch(apiUrl, {
          headers: {
            'X-Naver-Client-Id': process.env.NAVER_SEARCH_CLIENT_ID || '',
            'X-Naver-Client-Secret': process.env.NAVER_SEARCH_SECRET || '',
          },
        });

        if (response.ok) {
          const data = await response.json();
          
          // 네이버 API 응답을 TravelSpot 형태로 변환
          const categorySpots: TravelSpot[] = data.items.map((item: any) => {
            const removeHtmlTags = (str: string) => str.replace(/<[^>]*>/g, '');

            return {
              name: removeHtmlTags(item.title),
              lat: 0,
              lng: 0,
              description: removeHtmlTags(item.description || `${query} 지역의 ${category.name}`),
              address: removeHtmlTags(item.address),
              phone: item.telephone || '',
              category: category.name // 카테고리 정보 추가
            };
          });

          console.log(`${category.name} ${categorySpots.length}개 검색 완료`);
          allSpots = [...allSpots, ...categorySpots];
        } else {
          console.error(`${category.name} 검색 실패:`, response.status);
        }
      } catch (error) {
        console.error(`${category.name} 검색 오류:`, error);
      }
    }

    // 검색 결과가 없으면 폴백 데이터 사용
    if (allSpots.length === 0) {
      throw new Error('모든 카테고리 검색 실패');
    }

    console.log(`총 ${allSpots.length}개 장소 검색 완료`);

    // 좌표 정보 추가
    const spotsWithCoords = await addCoordinates(allSpots, query);

    return NextResponse.json({ spots: spotsWithCoords });
  } catch (error) {
    console.error('검색 API 오류:', error);
    
    // API 오류 시 기본 데이터 반환 (폴백)
    const fallbackSpots = getFallbackSpots(query);
    return NextResponse.json({ spots: fallbackSpots });
  }
}

// 네이버 Geocoding API를 사용해서 정확한 좌표 가져오기
async function addCoordinates(spots: TravelSpot[], city: string): Promise<TravelSpot[]> {
  // 확장된 도시별 중심점 좌표
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
    '울산': { lat: 35.5384, lng: 129.3114 },
    '세종': { lat: 36.4800, lng: 127.2890 },
    '춘천': { lat: 37.8813, lng: 127.7298 },
    '원주': { lat: 37.3422, lng: 127.9202 },
    '강진': { lat: 34.6420, lng: 126.7675 },
    '목포': { lat: 34.8118, lng: 126.3922 },
    '순천': { lat: 34.9506, lng: 127.4872 },
    '전라': { lat: 35.8242, lng: 127.1479 }, // 전주로 매핑
    '경상': { lat: 35.8714, lng: 128.6014 }, // 대구로 매핑
    '충청': { lat: 36.3504, lng: 127.3845 }, // 대전으로 매핑
    '강원': { lat: 37.8813, lng: 127.7298 }, // 춘천으로 매핑
  };

  let baseCoord = { lat: 37.5665, lng: 126.9780 }; // 기본값: 서울
  
  // 도시명에 맞는 기본 좌표 찾기 (부분 매칭 포함)
  for (const [key, coord] of Object.entries(cityCoords)) {
    if (city.includes(key) || key.includes(city.substring(0, 2))) {
      baseCoord = coord;
      break;
    }
  }

  console.log(`${city} 지역의 기본 좌표:`, baseCoord);

  // 각 장소에 대해 Geocoding API 호출 시도
  const spotsWithCoords = await Promise.all(
    spots.map(async (spot, index) => {
      try {
        // 네이버 Geocoding API 호출
        const geocodingUrl = `https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query=${encodeURIComponent(spot.address || spot.name)}`;
        
        const geocodingResponse = await fetch(geocodingUrl, {
          headers: {
            'X-NCP-APIGW-API-KEY-ID': process.env.NAVER_SEARCH_CLIENT_ID || '',
            'X-NCP-APIGW-API-KEY': process.env.NAVER_SEARCH_SECRET || '',
          },
        });

        if (geocodingResponse.ok) {
          const geocodingData = await geocodingResponse.json();
          if (geocodingData.addresses && geocodingData.addresses.length > 0) {
            const address = geocodingData.addresses[0];
            return {
              ...spot,
              lat: parseFloat(address.y),
              lng: parseFloat(address.x),
            };
          }
        }
      } catch (error) {
        console.log(`${spot.name} Geocoding 실패, 기본 좌표 사용`);
      }

      // Geocoding 실패시 기본 좌표 근처에 배치
      return {
        ...spot,
        lat: baseCoord.lat + (Math.random() - 0.5) * 0.05 + (index * 0.01), // 더 정확한 분산
        lng: baseCoord.lng + (Math.random() - 0.5) * 0.05 + (index * 0.01),
      };
    })
  );

  return spotsWithCoords;
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