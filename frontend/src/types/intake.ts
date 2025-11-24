export interface IntakeDTO {
  id: number;
  userId: number;
  beverageId: number;
  beverageName: string;
  volumeMl: number;
  caffeineMg: number;
  consumedAt: string;
  note?: string;
}

