'use client';

import { useState } from 'react';
import InputForm from '@/components/InputForm';
import ScheduleCard from '@/components/ScheduleCard';
import Map from '@/components/Map';
import { useScheduleStore } from '@/store/useScheduleStore';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'schedule' | 'map'>('schedule');
  const { travelPlan, error } = useScheduleStore();

  const handlePlanGenerated = () => {
    setActiveTab('schedule');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            ✈️ 여행 일정 자동 생성기
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            네이버 클라우드 API를 활용하여 원하는 도시의 여행 일정을 자동으로 생성해보세요.
            주요 명소들을 지도에서 확인하고 최적의 여행 루트를 계획할 수 있습니다.
          </p>
        </div>

        {/* 입력 폼 */}
        <div className="mb-12">
          <InputForm onPlanGenerated={handlePlanGenerated} />
        </div>

        {/* 오류 메시지 */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </div>
          </div>
        )}

        {/* 결과 섹션 */}
        {travelPlan && (
          <div className="max-w-6xl mx-auto">
            {/* 탭 네비게이션 */}
            <div className="flex justify-center mb-8">
              <div className="bg-white rounded-lg p-1 shadow-lg">
                <button
                  onClick={() => setActiveTab('schedule')}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    activeTab === 'schedule'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  📋 일정 보기
                </button>
                <button
                  onClick={() => setActiveTab('map')}
                  className={`px-6 py-3 rounded-lg font-medium transition-all ${
                    activeTab === 'map'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  🗺️ 지도 보기
                </button>
              </div>
            </div>

            {/* 탭 콘텐츠 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {activeTab === 'schedule' ? (
                <>
                  <div className="lg:col-span-2">
                    <ScheduleCard schedule={travelPlan.schedule} />
                  </div>
                  <div className="lg:col-span-1">
                    <Map travelPlan={travelPlan} />
                  </div>
                </>
              ) : (
                <>
                  <div className="lg:col-span-2">
                    <Map travelPlan={travelPlan} />
                  </div>
                  <div className="lg:col-span-1">
                    <ScheduleCard schedule={travelPlan.schedule} />
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* 사용 가이드 */}
        {!travelPlan && (
          <div className="max-w-4xl mx-auto mt-16">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                🎯 사용 가이드
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 text-blue-600 rounded-full p-2 flex-shrink-0">
                      <span className="text-sm font-bold">1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">도시 입력</h3>
                      <p className="text-gray-600 text-sm">여행하고 싶은 도시명을 입력하세요</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 text-blue-600 rounded-full p-2 flex-shrink-0">
                      <span className="text-sm font-bold">2</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">일수 선택</h3>
                      <p className="text-gray-600 text-sm">1일부터 10일까지 선택 가능합니다</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-green-100 text-green-600 rounded-full p-2 flex-shrink-0">
                      <span className="text-sm font-bold">3</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">일정 확인</h3>
                      <p className="text-gray-600 text-sm">자동 생성된 일정을 확인하세요</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-green-100 text-green-600 rounded-full p-2 flex-shrink-0">
                      <span className="text-sm font-bold">4</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">지도 보기</h3>
                      <p className="text-gray-600 text-sm">지도에서 여행 루트를 시각화</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
