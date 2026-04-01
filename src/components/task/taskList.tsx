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

const listVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

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
    : userTasks.filter((task: { done: boolean }) => task.done == false);

  const areCompletedTasks =
    pendingTasks.filter((task: { done: boolean }) => task.done == true).length >
    0;

  return (
    <motion.div
      initial={{ x: 10, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="max-lg:padding-footer-lg lg:padding-footer-sm relative mx-auto flex w-full max-w-[980px] flex-col items-center text-lg font-medium"
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
            className="no-highlight absolute right-0 top-12 z-20 flex cursor-pointer flex-col gap-1 rounded-xl border border-gray-200 bg-white px-2 py-2 text-base font-normal text-gray-700 shadow-2xl"
          >
            <div
              onClick={() => setShowCompletedTasks(!showCompletedTasks)}
              className="flex items-center gap-1 rounded-lg px-2 py-1 active:bg-gray-100"
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
        <div className="mt-4 w-full max-w-[760px] rounded-2xl border border-dashed border-gray-300 bg-white/70 px-6 py-9 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-eerie-black">
            Todo en orden por ahora
          </h2>
          <p className="mt-1 text-sm text-gray-600 sm:text-base">
            No hay tareas pendientes. Puedes crear una nueva para mantener el
            ritmo.
          </p>
        </div>
      )}
      {pendingTasks.length > 0 && (
        <>
          <h2 className="my-5 text-xl text-eerie-black">
            {pendingTasks.filter(
              (task: { done: boolean }) => task.done == false
            ).length > 0
              ? "Tareas pendientes"
              : "No hay tareas pendientes"}
          </h2>
          <motion.ul
            variants={listVariants}
            initial="hidden"
            animate="show"
            className="flex w-full flex-col items-center gap-3"
          >
            {pendingTasks.map(
              (task: {
                id: string;
                name: string;
                deadline: Date | null;
                description: string | null;
                done: boolean;
                routine_id: string | null;
              }) => (
                <motion.li key={task.id} variants={itemVariants}>
                  <TaskCard
                    id={task.id}
                    name={task.name}
                    deadline={task.deadline}
                    description={task.description}
                    isChecked={task.done}
                    isPartOfRoutine={task.routine_id != null}
                    showCompletedTasks={showCompletedTasks}
                  />
                </motion.li>
              )
            )}
          </motion.ul>
          {showCompletedTasks && areCompletedTasks && (
            <div className="flex w-full items-center justify-start pl-5 pt-2">
              <span
                onClick={() => {
                  deleteCompletedTasks({ user_id: user.id });
                  void refetchTasks();
                }}
                className="rounded-md px-1 py-0.5 text-base text-gray-800 transition-colors active:bg-black/10"
              >
                Borrar tareas completadas
              </span>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}
