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

// 카테고리별로 균등하게 분배하여 일차별 일정을 생성하는 함수
export const createTravelPlan = (
  city: string,
  days: number,
  spots: TravelSpot[]
): TravelPlan => {
  // 카테고리별로 장소들을 분류
  const 관광지들 = spots.filter(spot => spot.category === '관광지');
  const 식당들 = spots.filter(spot => spot.category === '식당');
  const 카페들 = spots.filter(spot => spot.category === '카페');
  
  console.log(`장소 분류: 관광지 ${관광지들.length}개, 식당 ${식당들.length}개, 카페 ${카페들.length}개`);
  
  const schedule: DaySchedule[] = [];
  
  for (let day = 1; day <= days; day++) {
    const daySpots: TravelSpot[] = [];
    
    // 각 일차에 관광지 1곳, 식당 1곳, 카페 1곳 할당 (가능한 경우)
    const 관광지Index = (day - 1) % 관광지들.length;
    const 식당Index = (day - 1) % 식당들.length;
    const 카페Index = (day - 1) % 카페들.length;
    
    // 관광지 추가 (오전/오후)
    if (관광지들.length > 관광지Index) {
      daySpots.push(관광지들[관광지Index]);
    }
    if (관광지들.length > 관광지Index + days) {
      daySpots.push(관광지들[관광지Index + days]);
    }
    
    // 식당 추가 (점심)
    if (식당들.length > 식당Index) {
      daySpots.push(식당들[식당Index]);
    }
    
    // 카페 추가 (간식/휴식)
    if (카페들.length > 카페Index) {
      daySpots.push(카페들[카페Index]);
    }
    
    // 하루에 최소 3곳은 보장하되, 남은 장소들로 추가 채우기
    const remainingSpots = spots.filter(spot => !daySpots.includes(spot));
    while (daySpots.length < 3 && remainingSpots.length > 0) {
      const randomSpot = remainingSpots.splice(Math.floor(Math.random() * remainingSpots.length), 1)[0];
      daySpots.push(randomSpot);
    }
    
    if (daySpots.length > 0) {
      schedule.push({
        day,
        color: dayColors[(day - 1) % dayColors.length],
        spots: daySpots,
      });
    }
  }
  
  console.log(`${days}일 일정 생성 완료, 총 ${schedule.length}일차`);
  
  return {
    city,
    days,
    schedule,
  };
}; 