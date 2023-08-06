import { type Task } from "~/hooks/useTasks";

export type Routine = {
  id: number;
  name: string;
  description?: string;
  user_id: string;
  tasks: Task[];
};

export function useRoutines() {
  //   const { data, isLoading } = api.tasks.getTasks.useQuery({});
  //   return data;
}
