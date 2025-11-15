import { useEffect, useRef } from "react";
import type {
  KakaoLatLng,
  KakaoMapInstance,
  KakaoMarkerInstance,
  KakaoEventHandle,
  KakaoPolylineInstance,
  KakaoCustomOverlayInstance,
  KakaoMapsNS,
} from "../types/kakao";

type LatLng = { lat: number; lng: number };

type Props = {
  className?: string;
  initialCenter?: LatLng;
  center?: LatLng;
  onSelectPoint?: (pos: LatLng & { address?: string }) => void;
  path?: LatLng[];
};

export default function KakaoMap({
  className,
  initialCenter = { lat: 37.5665, lng: 126.978 },
  center,
  onSelectPoint,
  path,
}: Props) {
  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<KakaoMapInstance | null>(null);
  const markerRef = useRef<KakaoMarkerInstance | null>(null); // 클릭 선택 마커
  const myMarkerRef = useRef<KakaoCustomOverlayInstance | null>(null); // 내 위치 파란 점
  const polylineRef = useRef<KakaoPolylineInstance | null>(null);
  const onSelectRef = useRef(onSelectPoint);
  const resizeObsRef = useRef<ResizeObserver | null>(null);
  const clickListenerRef = useRef<KakaoEventHandle | null>(null);

  useEffect(() => {
    onSelectRef.current = onSelectPoint;
  }, [onSelectPoint]);

  // 최초 지도 생성
  useEffect(() => {
    const init = () => {
      const kakao = window.kakao;
      if (!kakao || !kakao.maps || !mapDivRef.current) return;

      // utoload=false 썼으니, load 안에서 초기화
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

        // 클릭 마커
        markerRef.current = new maps.Marker({
          position: centerLatLng,
          map,
        });

        // 클릭 이벤트
        clickListenerRef.current = maps.event.addListener(
          map,
          "click",
          (e: { latLng: KakaoLatLng }) => {
            const latlng = e.latLng;
            markerRef.current?.setPosition(latlng);

            onSelectRef.current?.({
              lat: latlng.getLat(),
              lng: latlng.getLng(),
            });
          }
        );

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
      const kakao = window.kakao;
      const maps = kakao?.maps;
      if (maps && clickListenerRef.current) {
        maps.event.removeListener(clickListenerRef.current);
      }
      resizeObsRef.current?.disconnect();
      polylineRef.current?.setMap(null);
      myMarkerRef.current?.setMap(null);
      markerRef.current?.setMap(null);
    };
  }, [initialCenter.lat, initialCenter.lng]);

  // center 변경 → 내 위치 파란 점 이동
  useEffect(() => {
    const maps = window.kakao?.maps;
    if (!center || !maps || !mapRef.current) return;

    const pos = new maps.LatLng(center.lat, center.lng);
    mapRef.current.setCenter(pos);

    // 파란 점 (커스텀 오버레이)
    const content = `<div style="
      width:12px;height:12px;border-radius:50%;
      background:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,.25);
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
  }, [center]);

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
