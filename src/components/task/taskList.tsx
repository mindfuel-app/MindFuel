import { motion } from "framer-motion";
import TaskCard from "./taskCard";
import { api } from "~/utils/api";
import { TaskSkeleton } from "../ui/skeleton";
import { useUser } from "~/lib/UserContext";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import ClickAwayListener from "react-click-away-listener";
import { NoSymbolIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

export default function TaskList() {
  const user = useUser();
  const {
    data: userTasks,
    isLoading,
    refetch: refetchTasks,
  } = api.tasks.getTasks.useQuery({
    user_id: user.id,
  });
  const [completedTasksButton, setCompletedTasksButton] = useState(false);
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);

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

  const pendingTasks = showCompletedTasks
    ? userTasks
    : userTasks.filter((task) => task.done == false);

  return (
    <motion.div
      initial={{ x: 10, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="relative flex h-full flex-col items-center pb-16 text-lg font-medium"
    >
      <div
        onClick={() => setCompletedTasksButton(!completedTasksButton)}
        className="no-highlight absolute right-2 top-6 cursor-pointer rounded-md p-[2px] active:bg-black/10 lg:hover:bg-black/10"
      >
        <EllipsisHorizontalIcon className="h-6 w-6" />
      </div>
      {completedTasksButton && (
        <ClickAwayListener onClickAway={() => setCompletedTasksButton(false)}>
          <div
            onClick={() => {
              void refetchTasks();
              setShowCompletedTasks(!showCompletedTasks);
            }}
            className="no-highlight absolute right-0 top-12 z-20 cursor-pointer rounded bg-gray-700 px-2 py-1 text-base font-normal text-gray-200 shadow-2xl"
          >
            {showCompletedTasks ? (
              <div className="flex items-center gap-1">
                <NoSymbolIcon className="h-6 w-6" />
                Ocultar tareas completadas
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <CheckCircleIcon className="h-6 w-6" />
                Mostrar tareas completadas
              </div>
            )}
          </div>
        </ClickAwayListener>
      )}
      {pendingTasks.length == 0 && (
        <h2 className="my-5">No hay tareas pendientes</h2>
      )}
      {pendingTasks.length > 0 && (
        <>
          <h2 className="my-5">
            {pendingTasks.filter((task) => task.done == false).length > 0
              ? "Tareas pendientes"
              : "No hay tareas pendientes"}
          </h2>
          <ul className="flex w-72 flex-col gap-3 sm:w-80 lg:w-96">
            {pendingTasks.map((task) => (
              <TaskCard
                id={task.id}
                name={task.name}
                deadline={task.deadline}
                description={task.description}
                isChecked={task.done}
                showCompletedTasks={showCompletedTasks}
                key={task.id}
              />
            ))}
          </ul>
        </>
      )}
    </motion.div>
  );
}
