import { api } from "~/utils/api";

export function useRoutines({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onError?: (e: any) => void;
}) {
  const { mutate: createRoutine } = api.routines.createRoutine.useMutation({
    onSuccess: onSuccess,
    onError: onError,
  });

  const { mutate: editRoutine } = api.routines.modifyRoutine.useMutation({
    onSuccess: onSuccess,
    onError: onError,
  });

  const { mutate: deleteRoutine } = api.routines.deleteRoutine.useMutation({
    onSuccess: onSuccess,
    onError: onError,
  });

  return { createRoutine, editRoutine, deleteRoutine };
}
