import destination from "../assets/destination.svg";
import calendar from "../assets/miniCalendar.svg";
import timeIcon from "../assets/time.svg";
import type { RouteItem, RouteStatus } from "../types/myRoute";

type Props = {
  route: RouteItem;
  onClick: (route: RouteItem) => void; // 카드 하단 버튼 클릭
};

// 상태별 스타일/텍스트 (카드 내부 전용)
const getStatusStyle = (status: RouteStatus | undefined) => {
  if (status === "APPROVED") return "bg-[#28A745] text-white";
  if (status === "PENDING") return "bg-[#ADB5BD] text-white";
  return "bg-[#CED4DA] text-white";
};

const getStatusLabel = (status: RouteStatus | undefined) => {
  if (status === "APPROVED") return "승인됨";
  if (status === "PENDING") return "승인대기";
  return "취소됨";
};

export default function RouteCard({ route, onClick }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 py-4 px-6">
      {/* 상태 뱃지 */}
      <div className="mb-2">
        <span
          className={`inline-flex items-center rounded-[12px] px-2 py-[2px] text-[12px] font-500 ${getStatusStyle(
            route.status
          )}`}
        >
          {getStatusLabel(route.status)}
        </span>
      </div>

      {/* 출발/도착, 날짜/시간 */}
      <div className="text-[13px] text-[#111827] space-y-1">
        <p className="flex gap-[6px] items-center text-[12px] text-[#212529] font-[500]">
          <img
            src={destination}
            alt="destination"
            className="w-[15px] h-[15px]"
          />
          {route.from} → {route.to}
        </p>
        <div className="flex items-center text-[12px] gap-5 text-[#212529]">
          <div className="flex items-center gap-[5px]">
            <img src={calendar} alt="Calendar" className="h-[15px] w-[15px]" />
            {route.date}
          </div>
          <div className="flex items-center gap-[5px]">
            <img src={timeIcon} alt="time" className="h-[12px] w-[12px]" />
            {route.time}
          </div>
        </div>
      </div>

      {/* 버튼 */}
      <button
        className="mt-3 w-full h-9 rounded-[8px] bg-[#007CFF] text-white text-[14px] font-semibold leading-[150%] active:scale-[0.99]"
        onClick={() => onClick(route)}
      >
        노선 상세보기
      </button>
    </div>
  );
}
