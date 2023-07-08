import { useState } from "react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { type Task, TaskCard } from "./taskCard";

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
      className="no-highlight flex w-[300px] cursor-pointer flex-col rounded-md bg-[#008080] p-1 text-white"
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
      <div
        className={`transition-max-height duration-200 ease-in-out ${
          isCardOpened ? "max-h-[200px]" : "max-h-0"
        } overflow-hidden`}
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
      </div>
    </div>
  );
}
