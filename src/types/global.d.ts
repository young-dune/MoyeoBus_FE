import type { KakaoMapsNS } from "./kakao";

declare global {
  interface Window {
    kakao?: {
      maps?: KakaoMapsNS;
    };
  }
}

export {};
