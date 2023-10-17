import { api } from "~/utils/api";

export function usePoints() {
  const { mutate: addPoints } = api.points.addPoints.useMutation();

  return { addPoints };
}
