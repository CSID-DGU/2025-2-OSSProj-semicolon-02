import { http } from '../lib/http';
import type { DateChartPoint } from '../types/statistics';


//월별 날짜별 섭취량 조회
export async function fetchMonthlyDateChart(
  userId: number,
  year: number,
  month: number,
): Promise<DateChartPoint[]> {
  const res = await http.get<DateChartPoint[]>(
    '/api/statistics/monthly-date-chart',
    {
      params: { userId, year, month },
    },
  );
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

  const res = await http.get<DateChartPoint[]>(
    '/api/statistics/monthly-date-chart',
    {
      params: { userId, year: currentYear, month },
    },
  );
  return res.data;
}


//자주 마시는 음료 DTO
export interface PopularDrinkDTO {
  beverageId: number;
  beverageName: string;
  count: number;
  totalCaffeineMg: number;
}


//월별 자주 마시는 음료 조회
export async function fetchPopularDrinks(
  userId: number,
  year: number,
  month: number,
): Promise<PopularDrinkDTO[]> {
  const res = await http.get<PopularDrinkDTO[]>(
    '/api/statistics/popular-drinks',
    {
      params: { userId, year, month },
    },
  );
  return res.data;
}

/**
 * 월 레이블 형식으로 자주 마시는 음료 조회
 */
export async function fetchPopularDrinksByLabel(
  userId: number,
  monthLabel: string,
): Promise<PopularDrinkDTO[]> {
  const month = parseInt(monthLabel.replace('월', ''), 10);
  const currentYear = new Date().getFullYear();

  return fetchPopularDrinks(userId, currentYear, month);
}
