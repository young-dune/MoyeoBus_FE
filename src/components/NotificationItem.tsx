import timeIcon from "../assets/time.svg";
import locationIcon from "../assets/departure.svg";
import BellIcon from "../assets/icons/BellIcon";

type Props = {
  title: string; // 노선 생성 완료
  date: string; // 2025-10-31
  route: string; // 106번 · 송풍저수지 → 송풍초
  location: string; // 웅담면사무소 정류장
  time: string; // 14:05
  onDetail?: () => void;
};

export default function NotificationItem({
  title,
  date,
  route,
  location,
  time,
  onDetail,
}: Props) {
  return (
    <div className="w-full bg-white border border-[#E9ECEF] rounded-[12px] p-4 shadow-sm">
      {/* 제목 + 날짜 + 우측 상단 작은 종 */}
      <div className="flex items-center justify-between">
        <div className="flex flex-row items-center gap-3">
          <span className="text-[16px] font-[600] text-[#212529]">{title}</span>
          <span className="text-[14px] text-[#ADB5BD]">{date}</span>
        </div>
        <BellIcon />
      </div>

      {/* 노선명 */}
      <div className="mt-3">
        <p className="text-[14px] font-[600] text-[#212529]">{route}</p>

        {/* 장소 */}
        <div className="mt-2 flex gap-2 text-[12px] text-[#212529] items-center font-[400]">
          <img src={locationIcon} className="w-[15px] h-[15px]" />
          {location}
        </div>

        {/* 시간 */}
        <div className="mt-2 flex gap-2 text-[12px] text-[#212529] items-center font-[400]">
          <img src={timeIcon} className="w-[15px] h-[15px]" />
          {time}
        </div>
      </div>

      {/* 버튼 */}
      <button
        onClick={onDetail}
        className="
          w-full h-[36px] mt-4 rounded-[8px]
          bg-[#007CFF] text-white
          text-[14px] font-[600]
          active:scale-[0.99] transition
        "
      >
        노선 상세보기
      </button>
    </div>
  );
}
