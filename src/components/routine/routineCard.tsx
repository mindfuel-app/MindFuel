import { useState } from "react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import Modal from "../ui/modal";
import RoutineForm, { type Task } from "./routineForm";
import Link from "next/link";
import { useUser } from "~/lib/UserContext";
import { api } from "~/utils/api";
import RoutineTaskCard from "../task/routineTaskCard";
import { cn } from "~/lib/utils";
import { useTheme } from "~/lib/ThemeContext";

export default function RoutineCard({
  id,
  days,
  name,
  category,
  tasks,
}: {
  id: string;
  days: string;
  name: string;
  category: string;
  tasks: Task[];
}) {
  const { themeColor } = useTheme();
  const user = useUser();
  const { refetch: refetchRoutines } = api.routines.getRoutines.useQuery({
    user_id: user.id,
  });
  const { refetch: refetchTasks } = api.tasks.getTasksForRoutine.useQuery({
    user_id: user.id,
  });
  const [isCardOpened, setIsCardOpened] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div
      className={cn(
        "no-highlight relative flex w-[300px] cursor-pointer flex-col rounded-md p-1 text-white",
        themeColor == "teal" ? "bg-teal" : "bg-orange-red/90",
        !isCardOpened && "shadow-lg"
      )}
    >
      <div
        className={cn(
          "z-0 flex w-full items-center justify-between p-1",
          isCardOpened && "shadow-lg"
        )}
      >
        <div
          className="flex w-full flex-col"
          onClick={() => setIsCardOpened(!isCardOpened)}
        >
          <h1 className="text-lg">{name}</h1>
          <span className="text-sm text-black">{`${tasks.length} ${
            tasks.length == 1 ? "tarea" : "tareas"
          }`}</span>
          <span className="text-sm">
            {days.length == 33
              ? "Todos los dias"
              : days.length == 0
              ? "Nunca"
              : days}
          </span>
        </div>
        <div className="flex items-center py-2">
          <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
            <Modal.Button>
              <PencilSquareIcon className="h-8 w-8" />
            </Modal.Button>
            <Modal.Content>
              <RoutineForm
                mode="edit"
                afterSave={() => {
                  void refetchRoutines();
                  void refetchTasks();
                  setIsModalOpen(false);
                }}
                id={id}
                initialDays={days}
                initialName={name}
                initialCategory={category}
                initialTasks={tasks}
              />
            </Modal.Content>
          </Modal>
        </div>
      </div>
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: isCardOpened ? "auto" : 0 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <div className="-z-10 flex w-full flex-col gap-3 rounded-b-md bg-white pb-7 pl-3 pr-4 pt-5">
          {tasks.length == 0 ? (
            <div className="text-center text-black">No hay tareas cargadas</div>
          ) : (
            tasks.map((task, index) => (
              <RoutineTaskCard
                number={index + 1}
                name={task.name}
                themeColor={themeColor}
                key={task.name}
              />
            ))
          )}
        </div>
      </motion.div>
      {isCardOpened && tasks.length > 0 && (
        <Link
          href={`/rutinas/${id}`}
          className={cn(
            "absolute -bottom-5 left-1/2 -translate-x-1/2 rounded-2xl px-3 py-1.5",
            themeColor == "teal" ? "bg-teal" : "bg-orange-red"
          )}
        >
          <span className="text-base">Empezar rutina</span>
        </Link>
      )}
    </div>
  );
}
