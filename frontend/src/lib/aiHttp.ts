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

export interface CaffeineSummaryRes {
  userId: number;
  date: string;              // YYYY-MM-DD
  halfLifeHours: number;
  halfLifeMethod: 'fixed_default' | 'curve' | 'ml' | string;
  curve: CurvePoint[];
  latestDrinkPlan: LatestDrinkPlan;
  debug: {
    numIntakes: number;
    numSleepLogs: number;
    sleepDays: number;
    scores: Record<string, number>;
  };
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
