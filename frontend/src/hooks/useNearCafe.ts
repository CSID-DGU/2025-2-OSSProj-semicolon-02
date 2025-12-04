import { useQuery } from '@tanstack/react-query';
import { MapCafe, fetchCafes } from '../api/cafes';

export const useNearCafe = (coords?: { lat: number; lng: number }) =>
  useQuery<MapCafe[]>({
    queryKey: ['cafes', coords],
    queryFn: () => fetchCafes({ lat: coords!.lat, lng: coords!.lng }), // 데이터 가져올 때마다 cafe.ts API함수 실행
    enabled: !!coords,
    staleTime: 60_000,
  });
