//프론트 연동 확인용 지울  파일임!
//날짜별 카페인 섭취량 데이터 - 월별  통계 시각화 확인용 데이터


export type DateChartPoint = {
    date: string; 
    mg: number; // 사용자 섭취량
    target: number; // 400mg - 하루 카페인 권장량
  };
  

// 월별 날짜별 데이터
export const dateChartDataByMonth: Record<string, DateChartPoint[]> = {
    '8월': [
      {date: '1일', mg: 360, target: 400},
      {date: '5일', mg: 280, target: 400},
      {date: '10일', mg: 420, target: 400},
      {date: '15일', mg: 350, target: 400},
      {date: '20일', mg: 390, target: 400},
      {date: '25일', mg: 310, target: 400},
      {date: '30일', mg: 380, target: 400},
    ],
    '9월': [
      {date: '1일', mg: 400, target: 400},
      {date: '5일', mg: 320, target: 400},
      {date: '10일', mg: 450, target: 400},
      {date: '15일', mg: 370, target: 400},
      {date: '20일', mg: 410, target: 400},
      {date: '25일', mg: 340, target: 400},
      {date: '30일', mg: 390, target: 400},
    ],
    '10월': [
      {date: '1일', mg: 380, target: 400},
      {date: '5일', mg: 290, target: 400},
      {date: '10일', mg: 410, target: 400},
      {date: '15일', mg: 360, target: 400},
      {date: '20일', mg: 400, target: 400},
      {date: '25일', mg: 330, target: 400},
      {date: '30일', mg: 370, target: 400},
    ],
};