import { api } from "~/utils/api";

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

export function useTasks({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onError?: (e: any) => void;
}) {
  const { mutate: createTasks } = api.tasks.createTask.useMutation({
    onSuccess: onSuccess,
    onError: onError,
  });

  return { createTasks };
}
