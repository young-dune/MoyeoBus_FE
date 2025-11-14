import axiosInstance from "./axiosInstance";
import type { RouteStatus } from "../types/myRoute";

// 공용 타입
export type RouteApiItem = {
  id: number;
  departureId: number;
  destinationId: number;
  startDateTime: string; // "2025-10-17T10:00:00"
  endDateTime: string;
  status: RouteStatus; // "APPROVED" | "CANCELLED" | "PENDING"
};

export type RoutesApiResponse = {
  code: string;
  message: string;
  result: {
    items: RouteApiItem[];
    summary: {
      totalCount: number;
      approvedCount: number;
      cancelledCount: number;
      pendingCount: number;
    };
  };
};

// 노선 요청 조회 (GET /routes)
export const fetchRoutes = async (params: {
  status?: RouteStatus;
  from?: string;
  to?: string;
  cursor?: number;
}) => {
  const res = await axiosInstance.get<RoutesApiResponse>("/routes", { params });
  return res.data;
};

// 노선 요청 생성 (POST /routes)
export type CreateRouteBody = {
  departureId: number;
  destinationId: number;
  startDateTime: string; // "2025-10-17T10:00:00"
  endDateTime: string;
};

export const createRoute = async (body: CreateRouteBody) => {
  const res = await axiosInstance.post("/routes", body);
  return res.data;
};

// 노선 요청 취소 (PATCH /routes/{requestId})
export const cancelRoute = async (requestId: number) => {
  const res = await axiosInstance.patch(`/routes/${requestId}`);
  return res.data;
};

// 사용자별 노선 조회 (GET /routes/{passengerId})
export const fetchRoutesByPassenger = async (
  passengerId: number,
  params?: {
    status?: RouteStatus;
    from?: string;
    to?: string;
    cursor?: number;
  }
) => {
  const res = await axiosInstance.get(`/routes/${passengerId}`, { params });
  return res.data;
};
