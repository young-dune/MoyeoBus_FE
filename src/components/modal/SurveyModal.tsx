import { useEffect, useState } from "react";
import type { SurveyItem } from "../../apis/surveyApi";

const ETC_SURVEY_ID = 8;

interface Props {
  open: boolean;
  surveys: SurveyItem[]; // API에서 받은 옵션
  onConfirm: (data: { surveyId: number; etcText?: string }) => void;
  onSkip: () => void;
  onClose: () => void;
}

export default function SurveyModal({
  open,
  surveys,
  onConfirm,
  onSkip,
  onClose,
}: Props) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [etcText, setEtcText] = useState("");

  useEffect(() => {
    if (!open) {
      setSelectedId(null);
      setEtcText("");
    }
  }, [open]);

  if (!open) return null;

  const isEtc = selectedId === ETC_SURVEY_ID;
  const isConfirmDisabled =
    !selectedId || (isEtc && etcText.trim().length === 0);

  const handleConfirmClick = () => {
    if (!selectedId) return;
    if (isEtc && etcText.trim() === "") return;

    onConfirm({
      surveyId: selectedId,
      ...(isEtc ? { etcText: etcText.trim() } : {}),
    });
  };

  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="relative w-[300px] rounded-2xl h-[52vh] flex flex-col gap-3 justify-center bg-white p-5 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center mb-2">
          <p className="text-[15px] font-semibold">
            노선 신청이 완료되었습니다.
          </p>
          <p className="mt-1 text-[13px] text-gray-600">
            노선을 신청한 이유가 무엇인가요?
          </p>
        </div>

        <div className="space-y-2 text-[13px] max-h-full overflow-y-auto">
          {surveys.map((s) => (
            <label key={s.id} className="flex items-center gap-[10px]">
              <input
                type="radio"
                name="survey-reason"
                className="h-4 w-4"
                value={s.id}
                checked={selectedId === s.id}
                onChange={() => setSelectedId(s.id)}
              />
              {s.reason}
            </label>
          ))}
        </div>

        {/* 기타(id=8) 선택 시 텍스트 입력 */}
        <input
          type="text"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-[13px]"
          placeholder="기타 사유를 입력해 주세요"
          value={etcText}
          onChange={(e) => setEtcText(e.target.value)}
          disabled={!isEtc}
        />

        <div className="mt-2 flex gap-2">
          <button
            type="button"
            className="h-9 flex-1 rounded-lg border border-gray-300 text-[13px]"
            onClick={onSkip}
          >
            다음에 하기
          </button>
          <button
            type="button"
            className={`h-9 flex-1 rounded-lg text-[13px] text-white ${
              isConfirmDisabled ? "bg-[#9CC7FF]" : "bg-[#007CFF]"
            }`}
            disabled={isConfirmDisabled}
            onClick={handleConfirmClick}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
