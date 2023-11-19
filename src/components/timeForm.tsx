import { XMarkIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";

export default function TimeForm({
  taskIndex,
  taskName,
  initialValue,
  afterSave,
}: {
  taskIndex: number;
  taskName?: string;
  initialValue?: number | null;
  afterSave: () => void;
}) {
  const initialTime = initialValue || 0;

  const [hours, setHours] = useState(Math.floor(initialTime / 3600));
  const [minutes, setMinutes] = useState(Math.floor((initialTime % 3600) / 60));
  const [seconds, setSeconds] = useState(Math.floor((initialTime % 3600) % 60));

  return (
    <motion.div
      initial={{ scale: 0.98 }}
      animate={{ scale: 1 }}
      className="p-5"
    >
      <div className="no-highlight flex w-full justify-end active:text-gray-600 lg:hover:text-gray-600">
        <div className="flex w-full items-center justify-between">
          <h2 className="text-lg">
            Duracion de{" "}
            {taskName && taskName.trim() !== "" ? `'${taskName}'` : "tarea"}
          </h2>
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
        {" "}
        <div className="flex gap-5">
          <div className="space-y-2">
            <Label htmlFor="hours">Horas</Label>
            <input
              id="hours"
              type="number"
              max={24}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
          </div>
          <div className="space-y-2">
            <Label htmlFor="minutes">Minutos</Label>
            <input
              id="minutes"
              type="number"
              max={60}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
          </div>
          <div className="space-y-2">
            <Label htmlFor="seconds">Segundos</Label>
            <input
              id="seconds"
              type="number"
              max={60}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
          </div>
        </div>
        <Button
          onClick={() => {
            const totalTime = hours * 3600 + minutes * 60 + seconds;
            localStorage.setItem(`${taskIndex}`, totalTime.toString());
            afterSave();
          }}
          className="no-highlight -mb-2 ml-auto mt-4 bg-[#5c7aff]"
        >
          Confirmar
        </Button>
      </div>
    </motion.div>
  );
}
