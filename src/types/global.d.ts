// src/types/global.d.ts
import type { NaverMapsNS } from "./naver";

declare global {
  interface Window {
    naver?: {
      maps?: NaverMapsNS; // maps 전체를 NaverMapsNS로 지정
    };
  }
}
export {};
