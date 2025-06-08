import { create } from 'zustand';
import { TravelPlan, DaySchedule, TravelSpot } from '@/types';

interface ScheduleState {
  travelPlan: TravelPlan | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setTravelPlan: (plan: TravelPlan) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearPlan: () => void;
}

const dayColors = [
  "#FF3B30", // 빨강
  "#007AFF", // 파랑
  "#34C759", // 초록
  "#FF9500", // 주황
  "#AF52DE", // 보라
  "#FF2D92", // 분홍
  "#5AC8FA", // 하늘색
  "#FFCC00", // 노랑
];

export const useScheduleStore = create<ScheduleState>((set) => ({
  travelPlan: null,
  isLoading: false,
  error: null,

  setTravelPlan: (plan) => set({ travelPlan: plan, error: null }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error, isLoading: false }),
  clearPlan: () => set({ travelPlan: null, error: null }),
}));

// 장소들을 거리 기반으로 클러스터링하여 일차별로 분배하는 유틸리티 함수
export const createTravelPlan = (
  city: string,
  days: number,
  spots: TravelSpot[]
): TravelPlan => {
  const schedule: DaySchedule[] = [];
  const spotsPerDay = Math.ceil(spots.length / days);
  
  for (let day = 1; day <= days; day++) {
    const startIndex = (day - 1) * spotsPerDay;
    const endIndex = Math.min(startIndex + spotsPerDay, spots.length);
    const daySpots = spots.slice(startIndex, endIndex);
    
    schedule.push({
      day,
      color: dayColors[(day - 1) % dayColors.length],
      spots: daySpots,
    });
  }
  
  return {
    city,
    days,
    schedule: schedule.filter(s => s.spots.length > 0),
  };
}; 