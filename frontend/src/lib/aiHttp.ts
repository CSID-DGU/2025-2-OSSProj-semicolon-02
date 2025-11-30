// lib/aiHttp.ts
import axios from 'axios';

export interface LatestDrinkPlan {
  possible: boolean;
  latestAllowedTime: string | null;
  caffeineAtSleepIfDrink?: number;
  baseCaffeineAtSleep?: number;
  doseMg?: number;
  safeThreshold?: number;
  reason?: string;
}

export interface CurvePoint {
  time: string;       // ISO 문자열
  caffeineMg: number;
}

// ---- debug 타입 분리 ----
export interface TwoParamDebug {
  reason?: string;
  scores?: Record<
    string,
    {
      S: number;
      mse: number;
    }
  >;
}

export interface CaffeineSummaryRes {
  userId: number;
  date: string;              // YYYY-MM-DD
  halfLifeHours: number;

  // Flask에서 내려주는 메서드 + 민감도
  halfLifeMethod: 'fixed_default' | 'curve' | 'ml' | 'two_param_ml' | string;
  sensitivity: number;

  curve: CurvePoint[];
  latestDrinkPlan: LatestDrinkPlan | null;
  debug: TwoParamDebug;      // ← any 제거
}

// Flask 서버 주소에 맞게 baseURL 수정
export const aiHttp = axios.create({
  baseURL: 'http://10.0.2.2:5000',
  timeout: 7000,
});

export async function fetchCaffeineSummary(
  userId: number,
  date?: string,
): Promise<CaffeineSummaryRes> {
  const res = await aiHttp.get<CaffeineSummaryRes>('/caffeine-cal/summary', {
    params: { userId, date },
  });
  return res.data;
}
