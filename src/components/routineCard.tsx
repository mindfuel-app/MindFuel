import { useState } from "react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { type Task, TaskCard } from "./taskCard";
import { motion } from "framer-motion";

export type Routine = {
  id: number;
  nombre: string;
  descripcion: string;
  tareas: Task[];
};

export function RoutineCard({
  nombre,
  descripcion,
  tareas,
}: {
  nombre: string;
  descripcion: string;
  tareas: Task[];
}) {
  const [isCardOpened, setIsCardOpened] = useState(false);

  return (
    <div
      className="no-highlight flex w-[300px] cursor-pointer flex-col rounded-md bg-teal p-1 text-white"
      onClick={() => setIsCardOpened(!isCardOpened)}
    >
      <div className="z-10 flex items-center justify-between p-1 shadow-lg">
        <div className="flex flex-col">
          <h1 className="text-lg">{nombre}</h1>
          <span className="text-sm text-black">5 habitos - 2 horas</span>
          <span className="text-sm font-normal">{descripcion}</span>
        </div>
        <PencilSquareIcon className="h-8 w-8" />
      </div>
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: isCardOpened ? "auto" : 0 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <div className="flex w-full flex-col gap-3 rounded-b-md bg-white px-3 py-5">
          {tareas.map((tarea) => (
            <TaskCard
              numeroTarea={tarea.numeroTarea}
              nombreTarea={tarea.nombreTarea}
              key={tarea.id}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
