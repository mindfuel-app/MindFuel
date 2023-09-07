import { useState } from "react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import Modal from "../ui/modal";
import RoutineForm from "./routineForm";
import { type Task } from "~/hooks/useTasks";
import TaskCard from "../task/taskCard";
import Link from "next/link";
import { useUser } from "~/lib/UserContext";
import { api } from "~/utils/api";

export default function RoutineCard({
  id,
  days,
  name,
  category,
  tasks,
}: {
  id?: string;
  days: string;
  name: string;
  category: string;
  tasks: Task[];
}) {
  const user = useUser();
  const { refetch: refetchRoutines } = api.routines.getRoutines.useQuery({
    user_id: user.id,
  });
  const { refetch: refetchTasks } = api.tasks.getTasks.useQuery({
    user_id: user.id,
  });
  const [isCardOpened, setIsCardOpened] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="no-highlight relative flex w-[300px] cursor-pointer flex-col rounded-md bg-teal p-1 text-white">
      <div className="z-0 flex w-full items-center justify-between p-1 shadow-lg">
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
          {tasks.length == 0 && (
            <div className="text-center text-black">No hay tareas cargadas</div>
          )}
          {tasks.map((task, index) => (
            <TaskCard
              id={task.id}
              number={index + 1}
              name={task.name}
              isChecked={task.done}
              isPartOfRoutine={true}
              key={task.id}
            />
          ))}
        </div>
      </motion.div>
      {isCardOpened && id && tasks.length > 0 && (
        <Link
          href={`/rutinas/${id}`}
          className="absolute -bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-teal px-4 py-[6px]"
        >
          <span className="text-base">Empezar rutina</span>
        </Link>
      )}
    </div>
  );
}
