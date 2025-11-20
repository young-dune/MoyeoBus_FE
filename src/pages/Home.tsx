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
import {
  fetchSurveys,
  saveSurveyAnswer,
  type SurveyItem,
} from "../apis/surveyApi";
import SurveyModal from "../components/modal/SurveyModal";

type LatLng = { lat: number; lng: number };

type KakaoRegionResult = {
  region_type: string;
  region_1depth_name: string;
  region_2depth_name: string;
  region_3depth_name: string;
  region_4depth_name: string;
};

function formatToSigunguFromKakao(result: KakaoRegionResult[]): string {
  const first = result[0];
  if (!first) return "내 위치";

  const area2 = first.region_2depth_name;
  const area1 = first.region_1depth_name;
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

  // 설문 관련 상태
  const [surveyList, setSurveyList] = useState<SurveyItem[]>([]);
  const [showSurvey, setShowSurvey] = useState(false);

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

      const kakao = window.kakao;
      const maps = kakao?.maps;
      const services = maps?.services;

      if (maps && services) {
        const geocoder = new services.Geocoder();
        geocoder.coord2RegionCode(lng, lat, async (result, status) => {
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

          const area1 = first.region_1depth_name;
          const area2 = first.region_2depth_name;

          setAddress(formatToSigunguFromKakao(typedResult));

          if (area1 && area2) {
            try {
              setLoadingStops(true);
              setStopError(null);
              const list = await fetchAddresses(area1, area2);
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
        });
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
    const loadSurveys = async () => {
      try {
        const items = await fetchSurveys();
        setSurveyList(items);
      } catch (e) {
        console.error("설문 목록 조회 실패", e);
      }
    };
    void loadSurveys();
  }, []);

  useEffect(() => {
    fetchMyLocation();
  }, []);

  const submitRouteRequest = async (opts?: {
    surveyId?: number;
    etcText?: string;
  }) => {
    if (!departureId || !destinationId) {
      alert("출발/도착 정류장을 선택해 주세요.");
      return;
    }
    if (!date || !time) {
      alert("날짜와 시간을 입력해 주세요.");
      return;
    }

    const startDateTime = `${date}T${time}:00`;
    const [hh, mm] = time.split(":").map(Number);
    const endHour = (hh + 1).toString().padStart(2, "0");
    const endDateTime = `${date}T${endHour}:${mm
      .toString()
      .padStart(2, "0")}:00`;

    try {
      // 1) 노선 생성
      const res = await createRoute({
        departureId,
        destinationId,
        startDateTime,
        endDateTime,
      });

      if (!res.isSuccess) {
        alert(res.message || "노선 요청 실패");
        return;
      }

      // 2) 설문 응답 저장 (옵션 선택했을 때만)
      if (opts?.surveyId) {
        await saveSurveyAnswer({
          optionId: opts.surveyId,
          departureId,
          destinationId,
        });
        // etcText 는 API가 받지 않기 때문에 저장 필요 없음
      }

      // 3) 페이지 이동
      navigate("/myroute");
    } catch (error) {
      console.error(error);
      alert("노선 요청 중 오류 발생");
    }
  };

  // 폼에서 "노선 요청하기" 누르면 → 일단 설문 모달만 열기
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 1) 기본 인풋값 체크
    if (!date || !origin.trim() || !destination.trim() || !time) {
      alert("날짜, 출발지, 도착지, 희망 출발 시간을 모두 입력해 주세요.");
      return;
    }

    // 2) 자동완성에서 실제 정류장을 선택했는지 체크
    if (!departureId || !destinationId) {
      alert("출발/도착 정류장을 자동완성 목록에서 선택해 주세요.");
      return;
    }
    setShowSurvey(true);
  };

  // 모달 "확인"
  const handleSurveyConfirm = (data: {
    surveyId: number;
    etcText?: string;
  }) => {
    setShowSurvey(false);
    void submitRouteRequest(data);
  };

  // 모달 "다음에 하기"
  const handleSurveySkip = () => {
    setShowSurvey(false);
    void submitRouteRequest();
  };

  return (
    <div className="w-full h-full flex flex-col font-[Pretendard] bg-white">
      <div className="flex-1 overflow-y-auto">
        <div className="w-full max-w-sm mx-auto pt-4 pb-[calc(70px+var(--safe-bottom))]">
          <div className="overflow-hidden text-[#111827]">
            <HomeHeader
              address={address}
              onClickNotification={() => navigate("/notification")}
              onClickHistory={() => navigate("/history")}
            />

            <HomeMapSection
              myPos={myPos}
              loadingPos={loadingPos}
              posError={posError}
              onClickMyLocation={fetchMyLocation}
            />

            <HomeRequestForm
              date={date}
              origin={origin}
              destination={destination}
              time={time}
              onChangeDate={setDate}
              onChangeOrigin={setOrigin}
              onChangeDestination={setDestination}
              onChangeTime={setTime}
              onSubmit={handleFormSubmit} // 설문 열기용
              stops={stops}
              loadingStops={loadingStops}
              stopError={stopError}
              onSelectOriginStop={(stop) => {
                setOrigin(stop.name);
                setDepartureId(stop.id);
              }}
              onSelectDestinationStop={(stop) => {
                setDestination(stop.name);
                setDestinationId(stop.id);
              }}
            />
          </div>
        </div>
      </div>

      <SurveyModal
        open={showSurvey}
        surveys={surveyList}
        onConfirm={handleSurveyConfirm}
        onSkip={handleSurveySkip}
        onClose={() => setShowSurvey(false)}
      />
    </div>
  );
}
