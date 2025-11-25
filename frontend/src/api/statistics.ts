import { http } from '../lib/http';
import type { DateChartPoint } from '../types/statistics';

/**
 * 월별 날짜별 카페인 섭취량 조회
 */
export async function fetchMonthlyDateChart(
  userId: number,
  year: number,
  month: number,
): Promise<DateChartPoint[]> {
  const res = await http.get<DateChartPoint[]>('/api/statistics/monthly-date-chart', {
    params: { userId, year, month },
  });
  return res.data;
}