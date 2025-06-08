export interface TravelSpot {
  name: string;
  lat: number;
  lng: number;
  description: string;
  imgUrl?: string;
  address?: string;
  phone?: string;
  category?: string;
}

export interface DaySchedule {
  day: number;
  color: string;
  spots: TravelSpot[];
}

export interface TravelPlan {
  city: string;
  days: number;
  schedule: DaySchedule[];
}

export interface NaverSearchResult {
  title: string;
  link: string;
  category: string;
  description: string;
  telephone: string;
  address: string;
  roadAddress: string;
  mapx: string;
  mapy: string;
}

export interface NaverSearchResponse {
  lastBuildDate: string;
  total: number;
  start: number;
  display: number;
  items: NaverSearchResult[];
}

// Naver Maps API 타입 정의
declare global {
  interface Window {
    naver: {
      maps: {
        Map: new (element: string | HTMLElement, options: any) => any;
        LatLng: new (lat: number, lng: number) => any;
        Marker: new (options: any) => any;
        InfoWindow: new (options: any) => any;
        Polyline: new (options: any) => any;
        LatLngBounds: new () => any;
        Size: new (width: number, height: number) => any;
        Point: new (x: number, y: number) => any;
        Event: {
          addListener: (target: any, type: string, handler: Function) => void;
        };
        drawing: {
          DrawingMode: {
            HAND: string;
          };
        };
      };
    };
  }
} 