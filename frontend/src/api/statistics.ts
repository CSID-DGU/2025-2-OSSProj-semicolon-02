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
/**
 * 월 레이블 형식으로 요청 
 */
export async function fetchMonthlyDateChartByLabel(
    userId: number,
    monthLabel: string,
  ): Promise<DateChartPoint[]> {
    const month = parseInt(monthLabel.replace('월', ''), 10);
    const currentYear = new Date().getFullYear();
  
    const res = await http.get<DateChartPoint[]>('/api/statistics/monthly-date-chart', {
      params: { userId, year: currentYear, month },
    });
    return res.data;
  }