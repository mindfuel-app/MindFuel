import { motion } from "framer-motion";
import TaskCard from "./taskCard";
import { api } from "~/utils/api";
import { TaskSkeleton } from "../ui/skeleton";
import { useUser } from "~/lib/UserContext";
import RefetchButton from "../refetchButton";

export default function TaskList() {
  const user = useUser();
  const {
    data: userTasks,
    isLoading,
    refetch,
  } = api.tasks.getTasks.useQuery({
    user_id: user.id,
  });

  if (isLoading) return <TaskSkeleton />;

  if (!userTasks)
    return (
      <div className="mt-10 flex justify-center text-center font-medium sm:text-lg">
        <p className="max-w-[300px] sm:max-w-[400px]">
          No se pudo obtener la información deseada. Intentelo de nuevo más
          tarde
        </p>
      </div>
    );

  return (
    <motion.div
      initial={{ x: 10, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="relative flex h-full flex-col items-center pb-16 text-lg font-medium"
    >
      <RefetchButton refetch={() => void refetch()} />
      {userTasks.length == 0 && (
        <h2 className="my-5">No hay tareas cargadas</h2>
      )}
      {userTasks.length > 0 && (
        <>
          <h2 className="my-5">Tareas pendientes de hoy</h2>
          <ul className="flex w-72 flex-col gap-3">
            {userTasks.map((task, index) => (
              <TaskCard
                id={task.id}
                number={index + 1}
                name={task.name}
                key={task.id}
              />
            ))}
          </ul>
        </>
      )}
    </motion.div>
  );
}
