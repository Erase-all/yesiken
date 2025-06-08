'use client';

import { useState } from 'react';
import { useScheduleStore, createTravelPlan } from '@/store/useScheduleStore';
import { TravelSpot } from '@/types';

interface InputFormProps {
  onPlanGenerated?: () => void;
}

export default function InputForm({ onPlanGenerated }: InputFormProps) {
  const [city, setCity] = useState('');
  const [days, setDays] = useState(3);
  const { setTravelPlan, setLoading, setError, isLoading } = useScheduleStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!city.trim()) {
      setError('여행할 도시를 입력해주세요.');
      return;
    }
    
    if (days < 1 || days > 10) {
      setError('여행 일수는 1일에서 10일 사이로 입력해주세요.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/search-spots?query=${encodeURIComponent(city)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '검색 중 오류가 발생했습니다.');
      }

      const spots: TravelSpot[] = data.spots;
      
      if (spots.length === 0) {
        throw new Error('검색된 여행지가 없습니다. 다른 도시명을 입력해보세요.');
      }

      const travelPlan = createTravelPlan(city, days, spots);
      setTravelPlan(travelPlan);
      
      if (onPlanGenerated) {
        onPlanGenerated();
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        여행 일정 생성하기
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
            여행할 도시
          </label>
          <input
            type="text"
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="예: 제주도, 부산, 강릉"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="days" className="block text-sm font-medium text-gray-700 mb-2">
            여행 일수
          </label>
          <select
            id="days"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            disabled={isLoading}
          >
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}일
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              일정 생성 중...
            </div>
          ) : (
            '일정 생성하기'
          )}
        </button>
      </form>
    </div>
  );
} 