import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { App as CapacitorApp } from "@capacitor/app";
import type { PluginListenerHandle } from "@capacitor/core";
import { useEffect } from "react";
import BottomTabBar from "../components/BottomTabBar";

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const showTabBar = [
    "/home",
    "/myroute",
    "/mypage",
    "/history",
    "/notification",
  ].some((p) => location.pathname.startsWith(p));

  useEffect(() => {
    let backHandler: PluginListenerHandle | undefined;

    CapacitorApp.addListener("backButton", ({ canGoBack }) => {
      const path = location.pathname;
      const isRoot =
        path === "/home" ||
        path === "/myroute" ||
        path === "/mypage" ||
        path === "/history" ||
        path === "/notification";

      // canGoBack은 WebView 히스토리 기준 (Capacitor에서 같이 넘어옴)
      // 루트 + 더 이상 갈 데 없으면 앱 종료 막고 그냥 무시
      if (isRoot && !canGoBack) {
        console.log("뒤로가기: 루트 페이지, 앱 종료 방지");
        return;
      }

      // 그 외에는 전부 뒤로가기
      navigate(-1);
    }).then((handle) => {
      backHandler = handle;
    });

    return () => {
      if (backHandler) backHandler.remove();
    };
  }, [location.pathname, navigate]);

  return (
    <div className="relative flex flex-col w-full h-full mx-auto bg-white font-[Pretendard]">
      <Outlet />
      {showTabBar && <BottomTabBar active={getActiveTab(location.pathname)} />}
    </div>
  );
}

function getActiveTab(pathname: string) {
  if (pathname.startsWith("/home")) return "home" as const;
  if (pathname.startsWith("/myroute")) return "myroute" as const;
  if (pathname.startsWith("/mypage")) return "mypage" as const;
  if (pathname.startsWith("/history")) return "history" as const;
  if (pathname.startsWith("/notification")) return "notification" as const;
  return "home" as const;
}
