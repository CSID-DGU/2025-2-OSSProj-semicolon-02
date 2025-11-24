import { useQuery } from '@tanstack/react-query';
import { Cafe, fetchCafes } from '../api/cafes';


export const useNearCafe = (coords?: { lat: number; lng: number }) =>
  useQuery<Cafe[]>({
    queryKey: ['cafes', coords],
    queryFn: () => fetchCafes({ lat: coords!.lat, lng: coords!.lng }), // 데이터 가져올 때마다 cafe.ts API함수 실행
    enabled: !!coords,
    staleTime: 60_000,
  });