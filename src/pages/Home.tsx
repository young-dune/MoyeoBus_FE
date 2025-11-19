import { useEffect, useState } from "react";
import { Geolocation } from "@capacitor/geolocation";
import { useNavigate } from "react-router-dom";
import {
  fetchAddresses,
  type AddressItem,
  createRoute,
} from "../apis/routeApi";
import HomeHeader from "../components/home/HomeHeader";
import HomeMapSection from "../components/home/HomeMapSection";
import HomeRequestForm from "../components/home/HomeRequestForm";

type LatLng = { lat: number; lng: number };

// 카카오 coord2RegionCode 결과 타입(필요한 부분만)
type KakaoRegionResult = {
  region_type: string;
  region_1depth_name: string; // 시/도
  region_2depth_name: string; // 시/군/구
  region_3depth_name: string;
  region_4depth_name: string;
};

// 시/군/구까지만 추출 (없으면 시/도로 대체)
function formatToSigunguFromKakao(result: KakaoRegionResult[]): string {
  const first = result[0];
  if (!first) return "내 위치";

  const area2 = first.region_2depth_name; // 시/군/구
  const area1 = first.region_1depth_name; // 시/도 (fallback)
  return area2 || area1 || "내 위치";
}

export default function Home() {
  const [date, setDate] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [time, setTime] = useState("");
  const [myPos, setMyPos] = useState<LatLng | null>(null);
  const [loadingPos, setLoadingPos] = useState(false);
  const [posError, setPosError] = useState<string | null>(null);
  const [address, setAddress] = useState("모여버스");
  const [stops, setStops] = useState<AddressItem[]>([]);
  const [loadingStops, setLoadingStops] = useState(false);
  const [stopError, setStopError] = useState<string | null>(null);
  const [departureId, setDepartureId] = useState<number | null>(null);
  const [destinationId, setDestinationId] = useState<number | null>(null);

  const navigate = useNavigate();

  const fetchMyLocation = async () => {
    try {
      setLoadingPos(true);
      setPosError(null);

      await Geolocation.requestPermissions();
      const { coords } = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      });

      const lat = coords.latitude;
      const lng = coords.longitude;
      setMyPos({ lat, lng });

      // 카카오 역지오코딩 (시/군/구까지만 표기)
      const kakao = window.kakao;
      const maps = kakao?.maps;
      const services = maps?.services;

      if (maps && services) {
        const geocoder = new services.Geocoder();
        geocoder.coord2RegionCode(
          lng,
          lat,
          async (result: any, status: any) => {
            if (status !== services.Status.OK) {
              setAddress("내 위치");
              return;
            }

            const typedResult = result as KakaoRegionResult[];
            const first = typedResult[0];
            if (!first) {
              setAddress("내 위치");
              return;
            }

            const area1 = first.region_1depth_name; // 시/도
            const area2 = first.region_2depth_name; // 시/군/구
            console.log("현재 좌표:", lat, lng);
            console.log("카카오 역지오코딩 결과:", first);
            console.log("시/도(dosi):", area1);
            console.log("시/군/구(sigungu):", area2);

            setAddress(formatToSigunguFromKakao(typedResult));

            // 현재 행정구역에 포함된 정류장 목록 조회
            if (area1 && area2) {
              try {
                setLoadingStops(true);
                setStopError(null);
                const list = await fetchAddresses(area1, area2);
                console.log("불러온 정류장 목록:", list);
                console.log("정류장 개수:", list.length);
                setStops(list);
              } catch (err) {
                const msg =
                  err instanceof Error
                    ? err.message
                    : "정류장 목록을 불러오지 못했습니다.";
                setStopError(msg);
              } finally {
                setLoadingStops(false);
              }
            }
          }
        );
      } else {
        setAddress("내 위치");
      }
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "현재 위치를 가져오지 못했습니다.";
      setPosError(msg);
    } finally {
      setLoadingPos(false);
    }
  };

  useEffect(() => {
    // 첫 진입 시 한 번 현재 위치 가져오기
    fetchMyLocation();
  }, []);

  // 폼 제출용 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!departureId || !destinationId) {
      alert("출발/도착 정류장을 자동완성에서 선택해 주세요.");
      return;
    }
    if (!date || !time) {
      alert("날짜와 희망 출발 시간을 입력해 주세요.");
      return;
    }

    const startDateTime = `${date}T${time}:00`;
    // 임시: 출발 + 1시간을 도착 시간으로 사용
    const [hh, mm] = time.split(":").map(Number);
    const endHour = (hh + 1).toString().padStart(2, "0");
    const endDateTime = `${date}T${endHour}:${mm
      .toString()
      .padStart(2, "0")}:00`;

    try {
      const res = await createRoute({
        departureId,
        destinationId,
        startDateTime,
        endDateTime,
      });
      if (!res.isSuccess) {
        alert(res.message || "노선 요청에 실패했습니다.");
        return;
      }
      // 생성 성공하면 myroute 페이지에서 GET /routes로 다시 목록 불러오게
      navigate("/myroute");
    } catch (error) {
      console.error(error);
      alert("노선 요청 중 오류가 발생했습니다 ㅠㅠ");
    }
  };

  return (
    <div className="w-full h-full flex flex-col font-[Pretendard] bg-white">
      {/* 내부 스크롤 영역 (전체 콘텐츠) */}
      <div className="flex-1 overflow-y-auto">
        <div className="w-full max-w-sm mx-auto pt-4 pb-[calc(70px+var(--safe-bottom))]">
          <div className="overflow-hidden text-[#111827]">
            {/* 상단 인사 + 버튼들 */}
            <HomeHeader
              address={address}
              onClickNotification={() => navigate("/notification")}
              onClickHistory={() => navigate("/history")}
            />

            {/* 지도 영역 */}
            <HomeMapSection
              myPos={myPos}
              loadingPos={loadingPos}
              posError={posError}
              onClickMyLocation={fetchMyLocation}
            />

            {/* 폼 + 자동완성 */}
            <HomeRequestForm
              date={date}
              origin={origin}
              destination={destination}
              time={time}
              onChangeDate={setDate}
              onChangeOrigin={setOrigin}
              onChangeDestination={setDestination}
              onChangeTime={setTime}
              onSubmit={handleSubmit}
              stops={stops}
              loadingStops={loadingStops}
              stopError={stopError}
              onSelectOriginStop={(stop) => {
                setOrigin(stop.name); // 인풋에 이름 반영
                setDepartureId(stop.id); // id 저장
              }}
              onSelectDestinationStop={(stop) => {
                setDestination(stop.name);
                setDestinationId(stop.id);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
