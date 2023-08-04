import { type Task } from "~/hooks/useTasks";

export type Routine = {
  id: number;
  name: string;
  description?: string;
  tasks: Task[];
};

export function useRoutines() {
  //   const { data, isLoading } = api.tasks.getTasks.useQuery({});
  //   return data;
}
