import { http } from '../lib/http';

export type Favorite = {
  id: number;
  userId: number;
  beverageId: number | null;
  brand: string;
  name: string;
  caffeineMg: number;
  volumeMl: number;
  createdAt: string;
};

export async function fetchFavorites(userId: number): Promise<Favorite[]> {
  const response = await http.get<Favorite[]>('/api/favorites', {
    params: { userId },
  });
  return response.data;
}

export async function addFavorite(data: {
  userId: number;
  beverageId?: number | null;
  brand: string;
  name: string;
  caffeineMg: number;
  volumeMl: number;
}): Promise<number> {
  const response = await http.post<number>('/api/favorites', data);
  return response.data;
}

export async function deleteFavorite(id: number): Promise<void> {
  await http.delete(`/api/favorites/${id}`);
}
