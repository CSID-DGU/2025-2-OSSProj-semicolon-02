import { http } from '../lib/http';

export type Cafe = {
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
    const res = await http.get<Cafe[]>('/api/cafes', { params });
    console.log('✅ [API] 카페 검색 성공:', res.data.length, '개');
    console.log('📋 [API] 카페 데이터:', res.data);
    return res.data;
  } catch (error: any) {
    console.error('❌ [API] 카페 검색 실패:', error.message);
    console.error('🔍 [API] 에러 상세:', error);
    throw error;
  }
}
