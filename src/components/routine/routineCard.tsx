import { useState } from "react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import Modal from "../ui/modal";
import RoutineForm from "./routineForm";
import { type Task } from "~/hooks/useTasks";
import TaskCard from "../task/taskCard";

export default function RoutineCard({
  name,
  description,
  tasks,
}: {
  name: string;
  description: string | null;
  tasks: Task[];
}) {
  const [isCardOpened, setIsCardOpened] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="no-highlight flex w-[300px] cursor-pointer flex-col rounded-md bg-teal p-1 text-white">
      <div className="z-0 flex w-full items-center justify-between p-1 shadow-lg">
        <div
          className="flex w-full flex-col"
          onClick={() => setIsCardOpened(!isCardOpened)}
        >
          <h1 className="text-lg">{name}</h1>
          <span className="text-sm text-black">{`${tasks.length} ${
            tasks.length == 1 ? "tarea" : "tareas"
          }`}</span>
          <span className="text-sm font-normal">{description}</span>
        </div>
        <div className="flex items-center py-2">
          <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
            <Modal.Button>
              <PencilSquareIcon className="h-8 w-8" />
            </Modal.Button>
            <Modal.Content>
              <RoutineForm
                mode="edit"
                afterSave={() => setIsModalOpen(false)}
                initialName={name}
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
        <div className="-z-10 flex w-full flex-col gap-3 rounded-b-md bg-white py-5 pl-3 pr-4">
          {tasks.map((task, index) => (
            <TaskCard number={index + 1} name={task.name} key={task.id} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
