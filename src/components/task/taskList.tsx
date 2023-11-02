import { motion } from "framer-motion";
import TaskCard from "./taskCard";
import { api } from "~/utils/api";
import { TaskSkeleton } from "../ui/skeleton";
import { useUser } from "~/lib/UserContext";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import ClickAwayListener from "react-click-away-listener";
import { NoSymbolIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { useTasks } from "~/hooks/useTasks";
import { cn } from "~/lib/utils";

export default function TaskList() {
  const user = useUser();
  const {
    data: userTasks,
    isLoading,
    refetch: refetchTasks,
  } = api.tasks.getTasks.useQuery({
    user_id: user.id,
  });
  const { deleteCompletedTasks } = useTasks({});

  const [showSubMenu, setShowSubMenu] = useState(false);
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

  const areCompletedTasks =
    pendingTasks.filter((task) => task.done == true).length > 0;

  return (
    <motion.div
      initial={{ x: 10, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="padding-footer-sm relative flex flex-col items-center text-lg font-medium"
    >
      <div
        onClick={() => {
          setShowSubMenu((showSubMenu) => !showSubMenu);
        }}
        className="no-highlight absolute right-2 top-6 cursor-pointer rounded-md p-[2px] transition-colors active:bg-black/10 lg:hover:bg-black/10"
      >
        <EllipsisHorizontalIcon className="h-6 w-6" />
      </div>
      {showSubMenu && (
        <ClickAwayListener onClickAway={() => setShowSubMenu(false)}>
          <div
            onClick={() => void refetchTasks()}
            className="no-highlight absolute right-0 top-12 z-20 flex cursor-pointer flex-col gap-1 rounded bg-gray-700 px-2 py-1 text-base font-normal text-gray-200 shadow-2xl"
          >
            <div
              onClick={() => setShowCompletedTasks(!showCompletedTasks)}
              className="flex items-center gap-1"
            >
              {showCompletedTasks ? (
                <>
                  <NoSymbolIcon className="h-6 w-6" />
                  Ocultar tareas completadas
                </>
              ) : (
                <>
                  <CheckCircleIcon className="h-6 w-6" />
                  Mostrar tareas completadas
                </>
              )}
            </div>
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
          <ul className="flex flex-col gap-3">
            {pendingTasks.map((task) => (
              <TaskCard
                key={task.id}
                id={task.id}
                name={task.name}
                deadline={task.deadline}
                description={task.description}
                routineId={task.routine_id || ""}
                isChecked={task.done}
                isPartOfRoutine={task.routine_id != null}
                showCompletedTasks={showCompletedTasks}
              />
            ))}
          </ul>
          {showCompletedTasks && areCompletedTasks && (
            <span
              onClick={() => {
                deleteCompletedTasks({ user_id: user.id });
                void refetchTasks();
              }}
              className="flex w-full items-center justify-start pl-6 pt-2 text-base text-gray-800 transition-colors active:text-sky-500"
            >
              Borrar tareas completadas
            </span>
          )}
        </>
      )}
    </motion.div>
  );
}
