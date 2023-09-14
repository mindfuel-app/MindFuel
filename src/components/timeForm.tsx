import { XMarkIcon, CheckIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { useState } from "react";
import { api } from "~/utils/api";
import { Button } from "./ui/button";

export default function TimeForm({
  taskId,
  taskIndex,
  initialValue,
  afterSave,
}: {
  taskId?: string;
  taskIndex: number;
  initialValue?: number | null;
  afterSave: () => void;
}) {
  const { data: task } = api.tasks.getTaskById.useQuery({
    id: taskId || "",
  });

  const initialTime =
    initialValue !== null && initialValue !== undefined
      ? initialValue
      : task?.estimated_time || 0;

  const [hours, setHours] = useState(
    initialTime ? Math.floor(initialTime / 3600) : 0
  );
  const [minutes, setMinutes] = useState(
    initialTime ? Math.floor((initialTime % 3600) / 60) : 0
  );
  const [seconds, setSeconds] = useState(
    initialTime ? Math.floor((initialTime % 3600) % 60) : 0
  );

  return (
    <motion.div
      initial={{ opacity: 0.7, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-5"
    >
      <div className="no-highlight flex w-full justify-end active:text-gray-600 lg:hover:text-gray-600">
        <div className="flex w-full items-center justify-between">
          <h2 className="text-lg">Duracion de tarea</h2>
          <XMarkIcon
            className="h-5 w-5 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              afterSave();
            }}
          />
        </div>
      </div>
      <div className="flex flex-col items-center gap-5 pb-2 pt-6">
        <div className="flex gap-5">
          <label className="flex flex-col items-center gap-2">
            Horas
            <input
              type="number"
              max={24}
              className="w-12 border-[1px] border-gray-400 outline-none"
              defaultValue={hours}
              onChange={(e) => {
                if (Number(e.target.value) > 24)
                  e.target.value = e.target.value.slice(
                    0,
                    e.target.value.length - 1
                  );
                setHours(Number(e.target.value));
              }}
            />
          </label>
          <label className="flex flex-col items-center gap-2">
            Minutos
            <input
              type="number"
              max={60}
              className="w-12 border-[1px] border-gray-400 outline-none"
              defaultValue={minutes}
              onChange={(e) => {
                if (Number(e.target.value) > 60)
                  e.target.value = e.target.value.slice(
                    0,
                    e.target.value.length - 1
                  );
                setMinutes(Number(e.target.value));
              }}
            />
          </label>
          <label className="flex flex-col items-center gap-2">
            Segundos
            <input
              type="number"
              max={60}
              className="w-12 border-[1px] border-gray-400 outline-none"
              defaultValue={seconds}
              onChange={(e) => {
                if (Number(e.target.value) > 60)
                  e.target.value = e.target.value.slice(
                    0,
                    e.target.value.length - 1
                  );
                setSeconds(Number(e.target.value));
              }}
            />
          </label>
        </div>
        <Button
          onClick={() => {
            const totalTime = hours * 3600 + minutes * 60 + seconds;
            localStorage.setItem(`${taskIndex}`, totalTime.toString());
            afterSave();
          }}
          className="no-highlight h-10 w-10 rounded-full bg-[#5c7aff] p-2"
        >
          <CheckIcon className="h-16 w-16" />
        </Button>
      </div>
    </motion.div>
  );
}
