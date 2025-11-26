export const months = ['6월', '7월', '8월', '9월', '10월', '11월', '12월'];
export type ChartPoint = {hour: string; mg: number; target: number};
export type Drink = {
    id: string;
    brand: string;
    name: string;
    price: number;
    favorite: boolean;
  };
export const chartDataByMonth: Record<string, ChartPoint[]> = {
    '8월': [
      {hour: '08', mg: 360, target: 400},
      {hour: '10', mg: 320, target: 400},
      // ...
    ],
    '9월': [
      {hour: '08', mg: 420, target: 400},
      // ...
    ],
    '10월': [
      {hour: '08', mg: 390, target: 400},
      // ...
    ],
    // 나중에 백엔드에서 받아오는 방식
  };
  



  export const popularDrinksByMonth: Record<string, Drink[]> = {
    '8월': [
      {id: '1', brand: '스타벅스', name: '아이스 아메리카노', price: 4700, favorite: true},
      // ...
    ],
    '9월': [
      {id: '2', brand: '메가커피', name: '헤이즐넛 라떼', price: 3400, favorite: false},
      // ...
    ],
    '10월': [
      {id: '3', brand: '공차', name: '블랙 밀크티 펄', price: 4900, favorite: false},
      // ...
    ],
  };
