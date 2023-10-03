import { api } from "~/utils/api";

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
