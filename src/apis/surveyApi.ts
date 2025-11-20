import axiosInstance from "./axiosInstance";

export type SurveyItem = {
  id: number;
  reason: string;
  active: boolean;
};

type SurveyListResponse = {
  code: string;
  message: string;
  result: {
    items: SurveyItem[];
  };
};

// 설문 조회
export async function fetchSurveys(): Promise<SurveyItem[]> {
  const res = await axiosInstance.get<SurveyListResponse>("/surveys");
  // active 인 것만 사용
  return res.data.result.items.filter((item) => item.active);
}

// 설문 생성
export async function saveSurveyAnswer({
  optionId,
  departureId,
  destinationId,
}: {
  optionId: number;
  departureId: number;
  destinationId: number;
}) {
  const res = await axiosInstance.post("/surveys", {
    optionId,
    departureId,
    destinationId,
  });
  return res.data; // isSuccess true 여부
}
