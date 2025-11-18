import KakaoMap from "../KakaoMap";
import MapCenterIcon from "../../assets/icons/MapCenterIcon";

type LatLng = { lat: number; lng: number };

interface Props {
  myPos: LatLng | null;
  loadingPos: boolean;
  posError: string | null;
  onClickMyLocation: () => void;
}

export default function HomeMapSection({
  myPos,
  loadingPos,
  posError,
  onClickMyLocation,
}: Props) {
  return (
    <main className="relative">
      <KakaoMap
        className="w-full h-[280px] bg-gray-200"
        center={myPos ?? undefined}
        zoomLevel={4}
      />

      {posError && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-white/90 text-xs px-3 py-1 rounded shadow">
          {posError}
        </div>
      )}

      {/* 지도 우측 하단 '내 위치' 버튼 */}
      <button
        type="button"
        onClick={onClickMyLocation}
        disabled={loadingPos}
        className={`absolute bottom-3 right-3 w-10 h-10 rounded-full border shadow flex items-center justify-center z-10 transition
    ${
      loadingPos
        ? "bg-[#E7F1FF] cursor-default"
        : "bg-white border-gray-200 active:scale-95"
    }`}
        aria-label="내 위치로 이동"
      >
        {/* 로딩 중일 때 바깥에 퍼지는 원 */}
        {loadingPos && (
          <span className="absolute inline-flex h-9 w-9 rounded-full bg-[#007CFF]/30 animate-ping" />
        )}

        {/* 실제 아이콘 */}
        <MapCenterIcon
          className={`w-[18px] h-[18px] relative
      ${loadingPos ? "text-[#007CFF]" : "text-[#ADB5BD]"}`}
        />
      </button>
    </main>
  );
}
