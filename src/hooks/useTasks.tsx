export type Task = {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  createdAt: Date;
  routine_id: string | null;
  event_id: string | null;
  estimated_time: number | null;
  done: boolean;
  real_time: number | null;
  user_id: string;
  required_energy: number | null;
};
