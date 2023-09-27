import { api } from "~/utils/api";

export type Task = {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  deadline: Date | null;
  routine_id: string | null;
  event_id: string | null;
  usesAI: boolean;
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
  const { mutate: createTask } = api.tasks.createTask.useMutation({
    onSuccess: onSuccess,
    onError: onError,
  });

  const { mutate: editTask } = api.tasks.modifyTask.useMutation({
    onSuccess: onSuccess,
    onError: onError,
  });

  const { mutate: deleteTask } = api.tasks.deleteTask.useMutation({
    onSuccess: onSuccess,
    onError: onError,
  });

  const { mutate: setTaskDone } = api.tasks.setTaskDone.useMutation({
    onSuccess: onSuccess,
    onError: onError,
  });

  const { mutate: setTaskUndone } = api.tasks.setTaskUndone.useMutation({
    onSuccess: onSuccess,
    onError: onError,
  });

  return { createTask, editTask, deleteTask, setTaskDone, setTaskUndone };
}
