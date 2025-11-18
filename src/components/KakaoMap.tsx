import { useEffect, useRef } from "react";
import type {
  KakaoMapInstance,
  KakaoPolylineInstance,
  KakaoCustomOverlayInstance,
  KakaoMapsNS,
} from "../types/kakao";

type LatLng = { lat: number; lng: number };

type Props = {
  className?: string;
  initialCenter?: LatLng;
  center?: LatLng;
  path?: LatLng[];
  zoomLevel?: number;
};

export default function KakaoMap({
  className,
  initialCenter = { lat: 37.5665, lng: 126.978 },
  center,
  path,
  zoomLevel,
}: Props) {
  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<KakaoMapInstance | null>(null);
  const myMarkerRef = useRef<KakaoCustomOverlayInstance | null>(null); // 내 위치 마커
  const polylineRef = useRef<KakaoPolylineInstance | null>(null);
  const resizeObsRef = useRef<ResizeObserver | null>(null);

  // 최초 지도 생성
  useEffect(() => {
    const init = () => {
      const kakao = window.kakao;
      if (!kakao || !kakao.maps || !mapDivRef.current) return;

      kakao.maps.load(() => {
        const maps = kakao.maps as KakaoMapsNS;
        const container = mapDivRef.current as HTMLDivElement;

        const centerLatLng = new maps.LatLng(
          initialCenter.lat,
          initialCenter.lng
        );

        const map = new maps.Map(container, {
          center: centerLatLng,
          level: 4,
        });
        mapRef.current = map;

        // 리사이즈 옵저버
        const ro = new ResizeObserver(() => {
          maps.event.trigger(map, "resize");
        });
        ro.observe(container);
        resizeObsRef.current = ro;
      });
    };

    init();

    return () => {
      resizeObsRef.current?.disconnect();
      polylineRef.current?.setMap(null);
      myMarkerRef.current?.setMap(null);
    };
  }, [initialCenter.lat, initialCenter.lng]);

  // center 변경 → 내 위치 빨간 점 이동 + 줌 레벨 적용
  useEffect(() => {
    const maps = window.kakao?.maps;
    if (!center || !maps || !mapRef.current) return;

    const pos = new maps.LatLng(center.lat, center.lng);

    // 중심 이동
    mapRef.current.setCenter(pos);

    // 줌 레벨 적용
    if (zoomLevel !== undefined) {
      mapRef.current.setLevel(zoomLevel);
    }

    // 빨간 점 (커스텀 오버레이)
    const content = `<div style="
      width:12px;height:12px;border-radius:50%;
      background:#DC3545;box-shadow:0 0 0 3px rgba(37,99,235,.25);
      transform:translate(-50%,-50%);
    "></div>`;

    if (!myMarkerRef.current) {
      myMarkerRef.current = new maps.CustomOverlay({
        position: pos,
        content,
        yAnchor: 0.5,
        xAnchor: 0.5,
        zIndex: 999,
      });
      myMarkerRef.current.setMap(mapRef.current);
    } else {
      myMarkerRef.current.setPosition(pos);
      myMarkerRef.current.setMap(mapRef.current);
    }
  }, [center, zoomLevel]);

  // path 변경 → 경로 그리기
  useEffect(() => {
    const maps = window.kakao?.maps;
    if (!maps || !mapRef.current) return;

    if (!path || path.length === 0) {
      polylineRef.current?.setMap(null);
      polylineRef.current = null;
      return;
    }

    const kakaoPath = path.map((p) => new maps.LatLng(p.lat, p.lng));

    if (!polylineRef.current) {
      polylineRef.current = new maps.Polyline({
        map: mapRef.current,
        path: kakaoPath,
        strokeColor: "#FF7A00",
        strokeWeight: 4,
        strokeOpacity: 0.9,
      });
    } else {
      polylineRef.current.setPath(kakaoPath);
    }
  }, [path]);

  return <div ref={mapDivRef} className={className} />;
}
