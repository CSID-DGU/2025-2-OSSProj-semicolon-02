import { http } from '../lib/http';
import { IntakeDTO } from '../types/intake';

export async function fetchIntakes(userId?: number): Promise<IntakeDTO[]> {
  const res = await http.get<IntakeDTO[]>('/api/intakes', {
    params: userId ? { userId } : undefined,
  });
  return res.data;
}

export async function createIntake(payload: {
  userId: number;
  beverageId: number;
  volumeMl: number;
  caffeineMg: number;
  note?: string;
  consumedAt?: string;
}): Promise<number> {
  const res = await http.post<number>('/api/intakes', payload);
  return res.data;
}

export async function deleteIntake(id: number): Promise<void> {
  await http.delete(`/api/intakes/${id}`);
}
