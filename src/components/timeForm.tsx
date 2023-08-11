import { XMarkIcon, CheckIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { Button } from "./ui/button";

export default function TimeForm({
  initialTime,
  afterSave,
}: {
  initialTime: number;
  afterSave: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0.5, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-5"
    >
      <div className="no-highlight flex w-full justify-end active:text-gray-600 lg:hover:text-gray-600">
        <XMarkIcon
          className="h-5 w-5 cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            afterSave();
          }}
        />
      </div>
      <div className="flex flex-col items-center gap-5 py-3">
        <InputFields initialTime={initialTime} />
        <Button className="no-highlight h-10 w-10 rounded-full bg-[#5c7aff] p-2">
          <CheckIcon className="h-16 w-16" />
        </Button>
      </div>
    </motion.div>
  );
}

function InputFields({ initialTime }: { initialTime: number }) {
  const initialHours = Math.floor(initialTime / 3600);
  const initialMinutes = Math.floor((initialTime % 3600) / 60);
  const initialSeconds = Math.floor((initialTime % 3600) % 60);
  return (
    <div className="flex gap-5">
      <label className="flex flex-col items-center gap-2">
        Horas
        <input
          type="number"
          max={24}
          className="w-12 border-[1px] border-gray-400 outline-none"
          onFocus={(e) => {
            e.target.value = initialHours.toString();
          }}
          onChange={(e) => {
            if (Number(e.target.value) > 24)
              e.target.value = e.target.value.slice(
                0,
                e.target.value.length - 1
              );
          }}
        />
      </label>
      <label className="flex flex-col items-center gap-2">
        Minutos
        <input
          type="number"
          max={60}
          className="w-12 border-[1px] border-gray-400 outline-none"
          onFocus={(e) => {
            e.target.value = initialMinutes.toString();
          }}
          onChange={(e) => {
            if (Number(e.target.value) > 60)
              e.target.value = e.target.value.slice(
                0,
                e.target.value.length - 1
              );
            if (e.target.value == "00") {
              e.target.value = "0";
            }
          }}
        />
      </label>
      <label className="flex flex-col items-center gap-2">
        Segundos
        <input
          type="number"
          max={60}
          className="w-12 border-[1px] border-gray-400 outline-none"
          onFocus={(e) => {
            e.target.value = initialSeconds.toString();
          }}
          onChange={(e) => {
            if (Number(e.target.value) > 60)
              e.target.value = e.target.value.slice(
                0,
                e.target.value.length - 1
              );
          }}
        />
      </label>
    </div>
  );
}
