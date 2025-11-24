import { http } from '../lib/http';

export type Cafe = {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  distance?: number;
};

export async function fetchCafes(params: { lat: number; lng: number; radius?: number }) {
  const res = await http.get<Cafe[]>('/api/cafes', { params });
  return res.data;
}