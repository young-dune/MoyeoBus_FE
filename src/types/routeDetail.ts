// 상세 노선 정보
export type RouteDetailInfo = {
  busNumber: number;
  departureName: string;
  destinationName: string;
  operateDate: string; // "2025-11-17"
  departTime: string; // "10:00"
  arrivalTime: string; // "15:10"
};

export type RouteDetailItem = {
  order: number;
  station: string;
  time: string;
};

export type RouteDetailResult = {
  routeInfo: RouteDetailInfo;
  items: RouteDetailItem[];
};

export type RouteDetailResponse = {
  code: string;
  message: string;
  result: RouteDetailResult;
  isSuccess: boolean;
};
