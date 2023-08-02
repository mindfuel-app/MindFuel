import { api } from "~/utils/api";

export type Task = {
  id: string;
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
  userId: string;
  requiredEnergy?: number;
};

export function useTasks() {
  const { data } = api.tasks.getTasks.useQuery({});

  return data;
}
