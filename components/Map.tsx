'use client';

import { useEffect, useRef, useState } from 'react';
import { TravelPlan } from '@/types';

interface MapProps {
  travelPlan: TravelPlan | null;
}

export default function Map({ travelPlan }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const polylinesRef = useRef<any[]>([]);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [scriptError, setScriptError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('지도 초기화 준비 중...');

  // 네이버 맵 초기화
  useEffect(() => {
    console.log('Map 컴포넌트 마운트됨');
    
    if (!mapRef.current) {
      console.log('mapRef.current가 없음');
      setDebugInfo('지도 컨테이너를 찾을 수 없습니다.');
      return;
    }

    // 네이버 지도 API 로드 완료 이벤트 리스너
    const handleNaverMapReady = () => {
      console.log('naverMapReady 이벤트 받음');
      initializeMap();
    };

    // 네이버 지도 API 로드 에러 이벤트 리스너
    const handleNaverMapError = (event: any) => {
      console.error('naverMapError 이벤트 받음:', event.detail);
      setScriptError('네이버 지도 스크립트 로딩에 실패했습니다. API 키를 확인해주세요.');
      setDebugInfo('스크립트 로드 실패');
    };

    const initializeMap = () => {
      if (typeof window !== 'undefined' && window.naver && window.naver.maps && mapRef.current) {
        try {
          console.log('지도 초기화 시작');
          setDebugInfo('지도를 초기화하는 중...');
          
          const mapOptions = {
            center: new window.naver.maps.LatLng(37.3595704, 127.105399), // 네이버 그린팩토리 (예제와 동일)
            zoom: 7,
            mapTypeControl: true,
            mapDataControl: true,
            scaleControl: true,
            zoomControl: true,
          };

          console.log('지도 옵션:', mapOptions);
          mapInstanceRef.current = new window.naver.maps.Map(mapRef.current, mapOptions);
          console.log('지도 생성 완료:', mapInstanceRef.current);
          
          setIsMapLoaded(true);
          setScriptError(null);
          setDebugInfo('지도 로딩 완료');
        } catch (error) {
          console.error('지도 초기화 오류:', error);
          setScriptError(`지도 초기화 중 오류가 발생했습니다: ${error}`);
          setDebugInfo(`지도 초기화 실패: ${error}`);
        }
      } else {
        console.log('네이버 지도 API가 아직 준비되지 않음');
        setDebugInfo('네이버 지도 API를 기다리는 중...');
      }
    };

    // 이미 로드되어 있는지 확인
    if (typeof window !== 'undefined' && window.naver && window.naver.maps) {
      console.log('네이버 지도 API가 이미 로드됨');
      initializeMap();
    } else {
      console.log('네이버 지도 API 로드 대기 중...');
      setDebugInfo('네이버 지도 API 로드를 기다리는 중...');
      window.addEventListener('naverMapReady', handleNaverMapReady);
      window.addEventListener('naverMapError', handleNaverMapError);
    }

    return () => {
      console.log('Map 컴포넌트 언마운트');
      window.removeEventListener('naverMapReady', handleNaverMapReady);
      window.removeEventListener('naverMapError', handleNaverMapError);
      clearMapElements();
    };
  }, []);

  useEffect(() => {
    console.log('travelPlan 변경됨:', travelPlan);
    console.log('isMapLoaded:', isMapLoaded);
    console.log('scriptError:', scriptError);
    
    if (!mapInstanceRef.current || !travelPlan || !isMapLoaded || scriptError) return;

    clearMapElements();
    renderTravelPlan();
  }, [travelPlan, isMapLoaded, scriptError]);

  const clearMapElements = () => {
    try {
      if (Array.isArray(markersRef.current) && markersRef.current.length > 0) {
        markersRef.current.forEach(marker => {
          try {
            if (marker && marker.setMap && typeof marker.setMap === 'function') {
              marker.setMap(null);
            }
          } catch (e) {
            console.warn('마커 제거 중 오류:', e);
          }
        });
      }
      
      if (Array.isArray(polylinesRef.current) && polylinesRef.current.length > 0) {
        polylinesRef.current.forEach(polyline => {
          try {
            if (polyline && polyline.setMap && typeof polyline.setMap === 'function') {
              polyline.setMap(null);
            }
          } catch (e) {
            console.warn('폴리라인 제거 중 오류:', e);
          }
        });
      }
      
      markersRef.current = [];
      polylinesRef.current = [];
    } catch (error) {
      console.error('맵 요소 정리 오류:', error);
      markersRef.current = [];
      polylinesRef.current = [];
    }
  };

  const renderTravelPlan = () => {
    if (!travelPlan || !mapInstanceRef.current || !isMapLoaded || scriptError) return;

    if (typeof window === 'undefined' || !window.naver || !window.naver.maps) {
      setScriptError('네이버 지도 API가 사용할 수 없습니다.');
      return;
    }

    try {
      const bounds = new window.naver.maps.LatLngBounds();
      let allSpots: any[] = [];

      if (!Array.isArray(travelPlan.schedule)) {
        console.error('여행 일정 데이터가 올바르지 않습니다.');
        return;
      }

      travelPlan.schedule.forEach((day) => {
        if (!day || !Array.isArray(day.spots) || day.spots.length === 0) return;

        const daySpots = day.spots.map(spot => ({
          ...spot,
          dayColor: day.color,
          dayNumber: day.day
        }));
        allSpots = allSpots.concat(daySpots);

        // 각 일차별로 마커 생성
        daySpots.forEach((spot, index) => {
          if (!spot || !spot.lat || !spot.lng || isNaN(spot.lat) || isNaN(spot.lng)) return;

          try {
            const position = new window.naver.maps.LatLng(spot.lat, spot.lng);
            bounds.extend(position);

            // 마커 생성
            const marker = new window.naver.maps.Marker({
              position,
              map: mapInstanceRef.current,
              title: spot.name || '',
              icon: {
                content: `
                  <div style="
                    background-color: ${day.color || '#007AFF'};
                    color: white;
                    border-radius: 50%;
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: 12px;
                    border: 2px solid white;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                  ">
                    ${index + 1}
                  </div>
                `,
                size: new window.naver.maps.Size(32, 32),
                anchor: new window.naver.maps.Point(16, 16),
              }
            });

            // 정보창 생성
            const infoWindow = new window.naver.maps.InfoWindow({
              content: `
                <div style="padding: 10px; max-width: 200px;">
                  <h4 style="margin: 0 0 5px 0; color: ${day.color || '#007AFF'};">Day ${day.day} - ${index + 1}</h4>
                  <h3 style="margin: 0 0 5px 0;">${spot.name || '장소명 없음'}</h3>
                  ${spot.description ? `<p style="margin: 0 0 5px 0; font-size: 12px; color: #666;">${spot.description}</p>` : ''}
                  ${spot.address ? `<p style="margin: 0; font-size: 11px; color: #888;">${spot.address}</p>` : ''}
                </div>
              `,
              borderWidth: 1,
              anchorSize: new window.naver.maps.Size(0, 0),
            });

            // 마커 클릭 이벤트
            window.naver.maps.Event.addListener(marker, 'click', () => {
              infoWindow.open(mapInstanceRef.current, marker);
            });

            markersRef.current.push(marker);
          } catch (markerError) {
            console.error('마커 생성 오류:', markerError, spot);
          }
        });

        // 일차별 경로선 그리기
        if (daySpots.length > 1) {
          try {
            const path = daySpots
              .filter(spot => spot && spot.lat && spot.lng && !isNaN(spot.lat) && !isNaN(spot.lng))
              .map(spot => new window.naver.maps.LatLng(spot.lat, spot.lng));
            
            if (path.length > 1) {
              const polyline = new window.naver.maps.Polyline({
                map: mapInstanceRef.current,
                path,
                strokeColor: day.color || '#007AFF',
                strokeWeight: 3,
                strokeOpacity: 0.8,
                strokeStyle: 'solid'
              });

              polylinesRef.current.push(polyline);
            }
          } catch (polylineError) {
            console.error('경로선 생성 오류:', polylineError);
          }
        }
      });

      // 모든 마커가 보이도록 지도 범위 조정
      if (allSpots.length > 0) {
        try {
          mapInstanceRef.current.fitBounds(bounds, {
            padding: { top: 50, right: 50, bottom: 50, left: 50 }
          });
        } catch (boundsError) {
          console.error('지도 범위 조정 오류:', boundsError);
        }
      }
    } catch (error) {
      console.error('지도 렌더링 오류:', error);
      setScriptError('지도 렌더링 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b">
        <h2 className="text-xl font-bold text-gray-800">여행 루트</h2>
        {travelPlan && (
          <p className="text-sm text-gray-600 mt-1">
            {travelPlan.city} {travelPlan.days}일 여행
          </p>
        )}
      </div>
      
      <div 
        ref={mapRef}
        className="w-full h-96 md:h-[500px] naver-map"
        style={{ minHeight: '400px' }}
      >
        {scriptError ? (
          <div className="w-full h-full flex items-center justify-center bg-red-50">
            <div className="text-center p-8">
              <div className="text-red-500 text-lg mb-4">⚠️ 지도 로드 오류</div>
              <p className="text-red-600 text-sm mb-4">{scriptError}</p>
              <div className="mt-4 text-xs text-gray-600">
                <p className="mb-2">디버그 정보: {debugInfo}</p>
                <p>해결 방법:</p>
                <p>1. .env.local 파일에 NEXT_PUBLIC_NAVER_CLIENT_ID 설정 확인</p>
                <p>2. 네이버 클라우드 플랫폼에서 API 키 확인</p>
                <p>3. 페이지 새로고침</p>
              </div>
            </div>
          </div>
        ) : !isMapLoaded ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">지도를 초기화하는 중입니다...</p>
              <p className="text-sm text-gray-500 mt-2">{debugInfo}</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
} 