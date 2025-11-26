// src/api/sleep.ts
import { http } from '../lib/http';

export type SleepLogApi = {
  id: number;
  sleepAt: string;  
  wakeAt: string;
  durationMinutes: number;
};

// 최근 N일 조회
export async function fetchSleepHistory(
  userId: number,
  days = 7
): Promise<SleepLogApi[]> {
  const res = await http.get('/api/sleep/history', {
    params: { userId, days },
  });
  return res.data ?? [];
}

// 수정
export async function updateSleepLog(
  id: number,
  data: { sleepAt: string; wakeAt: string }
) {
  const res = await http.put(`/api/sleep/${id}`, data);
  return res.data;
}
