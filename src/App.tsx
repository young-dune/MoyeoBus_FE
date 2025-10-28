import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="p-8 rounded-2xl shadow-xl bg-white text-center">
        <h1 className="text-2xl font-bold mb-4 text-blue-700">MoyeoBus App</h1>
        <p className="text-gray-600 mb-6">
          Vite + React + TS + Tailwind + Capacitor(Android)
        </p>

        {/* ✅ 버튼 예시 */}
        <button
          onClick={() => setCount((prev) => prev + 1)}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 active:scale-95 transition-transform"
        >
          🚀 버튼 클릭! ({count})
        </button>

        {/* ✅ 다른 버튼 예시 */}
        <div className="flex gap-4 mt-6">
          <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            시작하기
          </button>
          <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
            종료하기
          </button>
        </div>

        {/* ✅ 상태 표시 */}
        <p className="mt-6 text-gray-500">
          지금까지 <span className="font-semibold text-blue-600">{count}</span>{" "}
          번 클릭했어요!
        </p>
      </div>
    </div>
  );
}

export default App;
