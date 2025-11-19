export type TrackPointRaw = {
  lat: number; // 실제로는 lng
  lon: number; // 실제로는 lat
};

export type TrackInfo = {
  routeId: number;
  nextStation: string;
  gapTime: number;
  remainDistance: number;
};

export type TrackResult = {
  info: TrackInfo;
  items: {
    station: string;
    time: string;
    tag: string;
  }[];
  points: TrackPointRaw[];
};

export type TrackResponse = {
  code: string;
  message: string;
  result: TrackResult;
  isSuccess: boolean;
};
