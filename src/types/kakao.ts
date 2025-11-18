// 기본 좌표 타입 (LatLng 인스턴스)
export interface KakaoLatLng {
  getLat(): number;
  getLng(): number;
}

// 지도 인스턴스
export interface KakaoMapInstance {
  setCenter(latlng: KakaoLatLng): void;
  setLevel(level: number): void;
}

// 마커 인스턴스
export interface KakaoMarkerInstance {
  setPosition(latlng: KakaoLatLng): void;
  setMap(map: KakaoMapInstance | null): void;
}

// 커스텀 오버레이 인스턴스 (내 위치 마커)
export interface KakaoCustomOverlayInstance {
  setPosition(latlng: KakaoLatLng): void;
  setMap(map: KakaoMapInstance | null): void;
}

// 폴리라인 인스턴스 (경로)
export interface KakaoPolylineInstance {
  setPath(path: KakaoLatLng[]): void;
  setMap(map: KakaoMapInstance | null): void;
}

// 이벤트 핸들
export type KakaoEventHandle = unknown;

// 역지오코딩용 Geocoder 타입
export interface KakaoGeocoder {
  coord2RegionCode(
    lng: number,
    lat: number,
    callback: (result: unknown[], status: string) => void
  ): void;
}

// kakao.maps.services 네임스페이스
export interface KakaoServicesNS {
  Status: {
    OK: string; // "OK"
  };
  Geocoder: new () => KakaoGeocoder;
}

// kakao.maps 네임스페이스
export interface KakaoMapsNS {
  // autoload=false 사용 시 필요
  load(callback: () => void): void;

  Map: new (
    container: HTMLElement,
    options: {
      center: KakaoLatLng;
      level?: number;
    }
  ) => KakaoMapInstance;

  LatLng: new (lat: number, lng: number) => KakaoLatLng;

  Marker: new (options: {
    position: KakaoLatLng;
    map?: KakaoMapInstance | null;
    zIndex?: number;
  }) => KakaoMarkerInstance;

  Polyline: new (options: {
    map?: KakaoMapInstance | null;
    path: KakaoLatLng[];
    strokeColor?: string;
    strokeWeight?: number;
    strokeOpacity?: number;
  }) => KakaoPolylineInstance;

  CustomOverlay: new (options: {
    position: KakaoLatLng;
    map?: KakaoMapInstance | null;
    content: string;
    yAnchor?: number;
    xAnchor?: number;
    zIndex?: number;
  }) => KakaoCustomOverlayInstance;

  event: {
    addListener(
      target: unknown,
      type: "click" | "resize" | string,
      handler: (event: { latLng: KakaoLatLng }) => void
    ): KakaoEventHandle;

    removeListener(handle: KakaoEventHandle): void;

    trigger(target: unknown, type: "resize" | string): void;
  };

  services?: KakaoServicesNS;
}
