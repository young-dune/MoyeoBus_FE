import NotificationItem from "../components/NotificationItem";
import PageLayout from "../layout/PageLayout";

export default function NotificationPage() {
  const dummy = [
    {
      title: "노선 생성 완료",
      date: "2025-10-31",
      route: "106번 · 송풍저수지 → 송풍초",
      location: "웅담면사무소 정류장",
      time: "14:05",
    },
    {
      title: "노선 생성 완료",
      date: "2025-10-30",
      route: "106번 · 송풍리 마을회관 → 진안고원시장",
      location: "송풍리 마을회관",
      time: "14:00",
    },
  ];
  return (
    <PageLayout showBack={false} showBell={false}>
      <div className="mt-2 flex flex-row justify-between items-center">
        <span className="text-[#212529] text-[18px] leading-[150%] font-[700] pt-[30px]">
          알림함
        </span>
      </div>
      <div className="mt-2 flex flex-col gap-4 pb-[120px]">
        {dummy.map((item, i) => (
          <NotificationItem
            key={i}
            {...item}
            onDetail={() => console.log("상세보기")}
          />
        ))}
      </div>
    </PageLayout>
  );
}
