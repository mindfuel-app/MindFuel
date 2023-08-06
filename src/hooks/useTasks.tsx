export type Task = {
  id: number;
  name: string;
  description?: string;
  user_id: string;
  category?: string;
  routineId?: string;
  eventId?: string;
  event?: Event;
  estimatedTime?: number;
  done: boolean;
  realTime?: number;
  requiredEnergy?: number;
};

export function useTasks() {
  return;
}
