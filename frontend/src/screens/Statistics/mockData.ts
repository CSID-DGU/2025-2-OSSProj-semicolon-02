export const months = [
  '1월',
  '2월',
  '3월',
  '4월',
  '5월',
  '6월',
  '7월',
  '8월',
  '9월',
  '10월',
  '11월',
  '12월',
];
export type ChartPoint = { hour: string; mg: number; target: number };
export type Drink = {
  id: string;
  brand: string;
  name: string;
  price: number;
  favorite: boolean;
  count?: number; // 백엔드 데이터에서 마신 횟수 (옵션)
};
export const chartDataByMonth: Record<string, ChartPoint[]> = {
  '8월': [
    { hour: '08', mg: 360, target: 400 },
    { hour: '10', mg: 320, target: 400 },
    // ...
  ],
  '9월': [
    { hour: '08', mg: 420, target: 400 },
    // ...
  ],
  '10월': [
    { hour: '08', mg: 390, target: 400 },
    // ...
  ],
  // 나중에 백엔드에서 받아오는 방식
};

export const popularDrinksByMonth: Record<string, Drink[]> = {
  '8월': [
    {
      id: '1',
      brand: '스타벅스',
      name: '아이스 아메리카노',
      price: 4700,
      favorite: true,
    },
    {
      id: '2',
      brand: '메가커피',
      name: '카페 라떼',
      price: 3500,
      favorite: false,
    },
    {
      id: '3',
      brand: '투썸플레이스',
      name: '아이스 초콜릿',
      price: 5500,
      favorite: true,
    },
    {
      id: '4',
      brand: '이디야',
      name: '콜드브루',
      price: 4000,
      favorite: false,
    },
  ],
  '9월': [
    {
      id: '5',
      brand: '메가커피',
      name: '헤이즐넛 라떼',
      price: 3400,
      favorite: false,
    },
    {
      id: '6',
      brand: '스타벅스',
      name: '카라멜 마키아토',
      price: 6100,
      favorite: true,
    },
    {
      id: '7',
      brand: '공차',
      name: '자몽 허니 블랙티',
      price: 5200,
      favorite: false,
    },
  ],
  '10월': [
    {
      id: '8',
      brand: '공차',
      name: '블랙 밀크티 펄',
      price: 4900,
      favorite: false,
    },
    {
      id: '9',
      brand: '스타벅스',
      name: '카페 라떼',
      price: 5500,
      favorite: true,
    },
    {
      id: '10',
      brand: '메가커피',
      name: '아메리카노',
      price: 2000,
      favorite: false,
    },
    {
      id: '11',
      brand: '이디야',
      name: '바닐라 라떼',
      price: 4200,
      favorite: false,
    },
    {
      id: '12',
      brand: '컴포즈커피',
      name: '콜드브루 니트로',
      price: 3800,
      favorite: true,
    },
  ],
  '11월': [
    {
      id: '13',
      brand: '스타벅스',
      name: '화이트 초콜릿 모카',
      price: 6300,
      favorite: true,
    },
    {
      id: '14',
      brand: '메가커피',
      name: '카라멜 마키아토',
      price: 3900,
      favorite: false,
    },
  ],
  '12월': [
    {
      id: '15',
      brand: '공차',
      name: '얼그레이 밀크티',
      price: 5000,
      favorite: true,
    },
    {
      id: '16',
      brand: '투썸플레이스',
      name: '아메리카노',
      price: 4500,
      favorite: false,
    },
    {
      id: '17',
      brand: '이디야',
      name: '헤이즐넛 아메리카노',
      price: 3800,
      favorite: false,
    },
  ],
};
