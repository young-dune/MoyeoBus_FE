import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import Splash from "../pages/Splash";
import Login from "../pages/Login";
import AccountLogin from "../pages/AccountLogin";
import Home from "../pages/Home";
import RouteDetail from "../pages/RouteDetail";
import MyPage from "../pages/MyPage";
import RouteRealtime from "../pages/RouteRealtime";
import MyRoute from "../pages/MyRoute";
import ProducedRoute from "../pages/ProducedRoute";
import NotificationPage from "../pages/NotificationPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Splash /> },
      { path: "home", element: <Home /> },
      { path: "history", element: <ProducedRoute /> },
      { path: "history/:id", element: <RouteDetail /> },
      { path: "history/:id/realtime", element: <RouteRealtime /> },
      { path: "mypage", element: <MyPage /> },
      { path: "myroute", element: <MyRoute /> },
      { path: "notification", element: <NotificationPage /> },
    ],
  },
  { path: "login", element: <Login /> },
  { path: "login/account", element: <AccountLogin /> },
]);
