import { motion } from "framer-motion";
import TaskCard from "./taskCard";
import { api } from "~/utils/api";
import { TaskSkeleton } from "../ui/skeleton";
import { useUser } from "~/lib/UserContext";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";

export default function TaskList() {
  const user = useUser();
  const { data: userTasks, isLoading } = api.tasks.getTasks.useQuery({
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
      <div className="no-highlight absolute right-2 top-6 cursor-pointer rounded-md p-[2px] active:bg-black/10 lg:hover:bg-black/10">
        <EllipsisHorizontalIcon className="h-6 w-6" />
      </div>
      {userTasks.filter((task) => task.done == false).length == 0 && (
        <h2 className="my-5">No hay tareas cargadas</h2>
      )}
      {userTasks.filter((task) => task.done == false).length > 0 && (
        <>
          <h2 className="my-5">Tareas pendientes de hoy</h2>
          <ul className="flex w-72 flex-col gap-3">
            {userTasks
              .filter((task) => task.done == false)
              .map((task, index) => (
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
