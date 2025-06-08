import { NextRequest, NextResponse } from 'next/server';
import { TravelSpot } from '@/types';

// 임시 관광지 데이터 (실제 서비스에서는 데이터베이스나 외부 API 사용)
const touristSpots: { [key: string]: TravelSpot[] } = {
  '제주도': [
    { name: '성산일출봉', lat: 33.4583, lng: 126.9408, description: '유네스코 세계자연유산으로 지정된 화산', address: '제주특별자치도 서귀포시 성산읍 성산리' },
    { name: '한라산', lat: 33.3617, lng: 126.5292, description: '제주도의 상징인 한국 최고봉', address: '제주특별자치도 제주시 해안동' },
    { name: '중문관광단지', lat: 33.2388, lng: 126.4175, description: '제주도 대표 관광 리조트 지역', address: '제주특별자치도 서귀포시 중문동' },
    { name: '우도', lat: 33.5006, lng: 126.9506, description: '제주 동쪽 작은 섬, 아름다운 해변', address: '제주특별자치도 제주시 우도면' },
    { name: '천지연폭포', lat: 33.2463, lng: 126.5533, description: '22m 높이의 장관을 이루는 폭포', address: '제주특별자치도 서귀포시 천지동' },
    { name: '만장굴', lat: 33.5267, lng: 126.7708, description: '세계자연유산으로 등재된 용암동굴', address: '제주특별자치도 제주시 구좌읍 김녕리' },
    { name: '정방폭포', lat: 33.2356, lng: 126.5711, description: '바다로 직접 떨어지는 폭포', address: '제주특별자치도 서귀포시 동홍동' },
    { name: '섭지코지', lat: 33.4244, lng: 126.9308, description: '아름다운 해안절벽과 등대', address: '제주특별자치도 서귀포시 성산읍 고성리' },
  ],
  '부산': [
    { name: '해운대해수욕장', lat: 35.1587, lng: 129.1603, description: '부산 대표 해수욕장', address: '부산광역시 해운대구 우동' },
    { name: '광안리해수욕장', lat: 35.1532, lng: 129.1189, description: '광안대교 야경이 아름다운 해변', address: '부산광역시 수영구 광안동' },
    { name: '감천문화마을', lat: 35.0979, lng: 129.0107, description: '산토리니를 닮은 계단식 마을', address: '부산광역시 사하구 감천동' },
    { name: '태종대', lat: 35.0517, lng: 129.0875, description: '절벽과 바다가 어우러진 명승지', address: '부산광역시 영도구 동삼동' },
    { name: '용두산공원', lat: 35.1014, lng: 129.0317, description: '부산타워가 있는 도심 공원', address: '부산광역시 중구 용두산길' },
    { name: '자갈치시장', lat: 35.0969, lng: 129.0303, description: '부산 대표 수산물 시장', address: '부산광역시 중구 자갈치해안로' },
    { name: '동백섬', lat: 35.1615, lng: 129.1637, description: '해운대와 연결된 아름다운 섬', address: '부산광역시 해운대구 우동' },
    { name: '오륙도', lat: 35.1027, lng: 129.1242, description: '부산의 상징적인 바위섬', address: '부산광역시 남구 용호동' },
  ],
  '서울': [
    { name: '경복궁', lat: 37.5788, lng: 126.9770, description: '조선왕조의 정궁', address: '서울특별시 종로구 사직로 161' },
    { name: '명동', lat: 37.5636, lng: 126.9834, description: '쇼핑과 관광의 중심지', address: '서울특별시 중구 명동' },
    { name: 'N서울타워', lat: 37.5512, lng: 126.9882, description: '서울의 랜드마크', address: '서울특별시 용산구 남산공원길' },
    { name: '동대문디자인플라자', lat: 37.5658, lng: 127.0095, description: '현대적 디자인의 복합문화공간', address: '서울특별시 중구 을지로 281' },
    { name: '한강공원', lat: 37.5298, lng: 126.9340, description: '서울 시민의 휴식처', address: '서울특별시 영등포구 여의동로' },
    { name: '북촌한옥마을', lat: 37.5825, lng: 126.9837, description: '전통 한옥이 잘 보존된 마을', address: '서울특별시 종로구 계동' },
    { name: '강남역', lat: 37.4980, lng: 127.0276, description: '서울의 중심 상권', address: '서울특별시 강남구 강남대로' },
    { name: '이태원', lat: 37.5349, lng: 126.9943, description: '국제적인 분위기의 거리', address: '서울특별시 용산구 이태원동' },
  ],
  '강릉': [
    { name: '경포해수욕장', lat: 37.8056, lng: 128.9056, description: '동해안 대표 해수욕장', address: '강원특별자치도 강릉시 창해로' },
    { name: '정동진', lat: 37.6897, lng: 129.0344, description: '일출 명소로 유명한 해변', address: '강원특별자치도 강릉시 강동면 정동진리' },
    { name: '안목해변', lat: 37.7714, lng: 128.9472, description: '커피거리로 유명한 해변', address: '강원특별자치도 강릉시 창해로 584' },
    { name: '오죽헌', lat: 37.7706, lng: 128.8756, description: '율곡 이이와 신사임당의 생가', address: '강원특별자치도 강릉시 율곡로3139번길' },
    { name: '월정사', lat: 37.7267, lng: 128.6889, description: '오대산의 아름다운 사찰', address: '강원특별자치도 평창군 진부면 오대산로' },
    { name: '하슬라아트월드', lat: 37.6911, lng: 129.0331, description: '바다를 품은 조각공원', address: '강원특별자치도 강릉시 강동면 율곡로' },
  ]
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  
  if (!query) {
    return NextResponse.json({ error: '검색어를 입력해주세요.' }, { status: 400 });
  }

  try {
    // 검색어에서 도시명 추출
    let foundSpots: TravelSpot[] = [];
    
    // 정확한 도시명 매칭
    for (const city in touristSpots) {
      if (query.includes(city)) {
        foundSpots = touristSpots[city];
        break;
      }
    }
    
    // 정확한 매칭이 없으면 부분 매칭 시도
    if (foundSpots.length === 0) {
      for (const city in touristSpots) {
        if (city.includes(query) || query.includes(city.substring(0, 2))) {
          foundSpots = touristSpots[city];
          break;
        }
      }
    }
    
    // 아무것도 찾지 못하면 서울 데이터를 기본으로 반환
    if (foundSpots.length === 0) {
      foundSpots = touristSpots['서울'];
    }

    return NextResponse.json({ spots: foundSpots });
  } catch (error) {
    console.error('검색 API 오류:', error);
    return NextResponse.json(
      { error: '장소 검색 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 