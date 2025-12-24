import { http } from '../lib/http';

export type MapCafe = {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  distance?: number;
};

export async function fetchCafes(params: {
  lat: number;
  lng: number;
  radius?: number;
}) {
  console.log('📡 [API] 카페 검색 요청:', params);
  try {
    const res = await http.get<MapCafe[]>('/api/cafes', { params });
    console.log('✅ [API] 카페 검색 성공:', res.data.length, '개');
    console.log('📋 [API] 카페 데이터:', res.data);
    return res.data;
  } catch (error: any) {
    // NOTE: RN 개발 모드에서 console.error는 RedBox(오버레이)를 띄울 수 있어 warn으로 낮춥니다.
    console.warn('❌ [API] 카페 검색 실패:', error?.message);
    console.warn('🔍 [API] 에러 상세:', error);
    throw error;
  }
}
