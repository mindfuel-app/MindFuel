export type Routine = {
  id: string;
  name: string;
  description: string | null;
  user_id: string;
  createdAt: Date;
};

export function useRoutines() {
  //   const { data, isLoading } = api.tasks.getTasks.useQuery({});
  //   return data;
}
