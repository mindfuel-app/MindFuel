export type Task = {
  id: number;
  name: string;
  description?: string;
  category?: string;
  createdAt: Date;
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
