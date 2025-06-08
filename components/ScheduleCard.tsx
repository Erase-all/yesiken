'use client';

import { DaySchedule } from '@/types';

interface ScheduleCardProps {
  schedule: DaySchedule[];
}

export default function ScheduleCard({ schedule }: ScheduleCardProps) {
  if (!schedule || schedule.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">
        여행 일정
      </h2>
      
      {schedule.map((day) => (
        <div key={day.day} className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div 
            className="px-6 py-4 text-white font-bold text-lg"
            style={{ backgroundColor: day.color }}
          >
            Day {day.day}
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {day.spots.map((spot, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                    style={{ backgroundColor: day.color }}
                  >
                    {index + 1}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-800 truncate">
                      {spot.name}
                    </h3>
                    
                    {spot.description && (
                      <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                        {spot.description}
                      </p>
                    )}
                    
                    {spot.address && (
                      <p className="text-gray-500 text-sm mt-2 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {spot.address}
                      </p>
                    )}
                    
                    {spot.phone && (
                      <p className="text-gray-500 text-sm mt-1 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {spot.phone}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// 텍스트를 2줄로 제한하는 CSS 클래스
export const scheduleCardStyles = `
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`; 