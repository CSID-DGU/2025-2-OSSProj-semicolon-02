/**
 * 날짜별 카페인 섭취량
 */
export interface DateChartPoint {
    date: string; 
    mg: number; //하루 총 섭취량
    target: number; // 400mg
  }