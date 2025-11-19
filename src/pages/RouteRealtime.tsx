import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import type { RouteItem, RouteStop } from "../types/myRoute";
import KakaoMap from "../components/KakaoMap";
import PageLayout from "../layout/PageLayout";
import busMarker from "../assets/marker.svg";
import stopMarker from "../assets/busStop.svg";
import { fetchRouteTrack, type LatLng } from "../apis/routeApi";

type NavState = { route?: RouteItem; stops?: RouteStop[] };

export default function RouteRealtime() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { state } = useLocation() as { state?: NavState };

  // 기본 route/stops (state 없을 때용)
  const route = state?.route ?? {
    id: id ?? "demo",
    from: "송풍저수지",
    to: "송풍초",
    date: "2025-10-31",
    time: "14:05",
    status: "CREATED" as const,
  };

  // 기본 더미 데이터
  const stops = state?.stops ?? [
    { order: 1, name: "송풍저수지", time: "14:05" },
    { order: 2, name: "방화마을회관", time: "14:13" },
    { order: 3, name: "새마을회관", time: "14:18" },
    { order: 4, name: "송풍초등학교", time: "14:25" },
  ];

  // 지도에 쓸 상태들
  const [path, setPath] = useState<LatLng[]>([]);
  const [initialCenter, setInitialCenter] = useState<LatLng>({
    lat: 37.5665,
    lng: 126.978,
  });
  const [busPosition, setBusPosition] = useState<LatLng | null>(null);
  const [loading, setLoading] = useState(false);

  // currentStation은 일단 첫 정류장
  const currentStation = stops[0]?.name ?? route.from;

  useEffect(() => {
    const loadTrack = async () => {
      try {
        setLoading(true);

        const { path } = await fetchRouteTrack(
          Number(route.id),
          currentStation
        );

        if (path.length > 0) {
          setPath(path);
          setInitialCenter(path[0]);
          // 버스 위치는 일단 경로 상의 마지막 점으로 가정
          setBusPosition(path[path.length - 1]);
        }
      } catch (e) {
        console.error("노선 추적 정보 조회 실패:", e);
      } finally {
        setLoading(false);
      }
    };

    loadTrack();
  }, [route.id, currentStation]);

  return (
    <PageLayout>
      <section className="w-full">
        <h2 className="text-[18px] font-[700] mb-3">노선 경로</h2>
        <div className="bg-white border rounded-xl overflow-hidden">
          <div className="w-full h-[420px]">
            <KakaoMap
              className="w-full h-full"
              initialCenter={initialCenter}
              center={busPosition ?? initialCenter}
              path={path}
              markerImage={busMarker}
              stopMarkerImage={stopMarker}
            />
          </div>
        </div>
      </section>

      {loading && (
        <p className="mt-2 text-center text-sm text-gray-400">
          노선 정보를 불러오는 중입니다...
        </p>
      )}

      <button
        className="mt-4 w-full h-12 rounded-[10px] bg-[#007CFF] text-white text-[14px] font-[600]"
        onClick={() =>
          navigate(`/history/${route.id}`, { state: { route, stops } })
        }
      >
        노선 경로 보기
      </button>
    </PageLayout>
  );
}
