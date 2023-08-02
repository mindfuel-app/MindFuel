import { type Task } from "~/hooks/useTasks";

export type Routine = {
  id: string;
  name: string;
  description?: string;
  userId: string;
  createdAt: Date;
  tasks: Task[];
};

export function useRoutines() {
  //   const { data, isLoading } = api.tasks.getTasks.useQuery({});
  //   return data;
}
