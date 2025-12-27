import { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginLogo from "../assets/loginLogo.svg";
import back from "../assets/back.svg";
import { login } from "../apis/authApi";

export default function AccountLogin() {
  const navigate = useNavigate();

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [idError, setIdError] = useState<string | null>(null);
  const [pwError, setPwError] = useState<string | null>(null);
  const [remember, setRemember] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;

    if (!userId) {
      setIdError("아이디가 존재하지 않습니다.");
      hasError = true;
    } else {
      setIdError(null);
    }

    if (!password) {
      setPwError("비밀번호를 확인해주세요.");
      hasError = true;
    } else {
      setPwError(null);
    }

    if (hasError) return;

    try {
      await login({
        email: userId,
        password,
      });

      console.log("로그인 성공");
      navigate("/home");
    } catch (err) {
      console.error(err);
      setPwError("아이디 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-[#fff] font-[Pretendard]">
      {/* 로고 + 폼 */}
      <div className="mx-auto w-full max-w-sm px-6 min-h-screen grid grid-rows-[220px_auto_1fr]">
        {/* 뒤로가기 버튼 */}
        <div className="absolute top-16 flex items-center">
          <button
            aria-label="뒤로가기"
            onClick={() => navigate(-1)}
            className="inline-flex items-center"
          >
            <img src={back} alt="back" />
          </button>
        </div>

        {/* 메인 로고 (문구 + 이미지) */}
        <div className="row-start-2 flex flex-col items-start gap-3">
          <img src={loginLogo} alt="moyeobus" className="object-contain" />
        </div>

        {/* 로그인 폼 */}
        <form
          onSubmit={onSubmit}
          className="row-start-3 space-y-3 flex flex-col w-full pt-12 pb-10"
        >
          {/* 아이디 */}
          <div>
            <input
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="아이디"
              className={`w-full h-12 rounded-[10px] px-4 text-[14px] outline-none border text-black ${
                idError ? "border-[#EF4444]" : "border-[#CED4DA]"
              }`}
              aria-invalid={!!idError}
              aria-describedby={idError ? "id-error" : undefined}
            />
            {idError && (
              <p id="id-error" className="mt-1 text-xs text-[#EF4444]">
                아이디가 존재하지 않습니다.
              </p>
            )}
          </div>

          {/* 비밀번호 */}
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              className={`w-full h-12 rounded-[10px] px-4 text-[14px] outline-none border text-black ${
                pwError ? "border-[#EF4444]" : "border-[#CED4DA]"
              }`}
              aria-invalid={!!pwError}
              aria-describedby={pwError ? "pw-error" : undefined}
            />
            {pwError && (
              <p id="pw-error" className="mt-1 text-xs text-[#EF4444]">
                비밀번호를 확인해주세요.
              </p>
            )}
          </div>

          {/* 옵션/링크 라인 */}
          <div className="flex items-center justify-between text-[12px] text-[#6B7280]">
            <label className="inline-flex items-center gap-[5px]">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-[14px] h-[14px] rounded-[6px] border-[#D1D5DB]"
              />
              로그인 유지
            </label>

            <div className="flex items-center gap-2">
              <button type="button" className="hover:underline">
                비밀번호 찾기
              </button>
              <span className="w-px h-3 bg-[#E5E7EB]" />
              <button type="button" className="hover:underline">
                아이디 찾기
              </button>
            </div>
          </div>

          {/* 로그인 버튼 */}
          <button
            type="submit"
            className="w-full h-12 rounded-[10px] bg-[#1976F4] text-white text-[14px] font-medium"
          >
            로그인
          </button>
        </form>
      </div>
    </div>
  );
}
