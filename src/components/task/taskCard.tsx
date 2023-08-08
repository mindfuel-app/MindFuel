import { Checkbox } from "../ui/checkbox";
import { useTasks } from "~/hooks/useTasks";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function TaskCard({
  id,
  number,
  name,
}: {
  id: string;
  number: number;
  name: string;
}) {
  const [isTaskDone, setIsTaskDone] = useState(false);
  const { setTaskDone } = useTasks({});
  return (
    <AnimatePresence>
      {!isTaskDone && (
        <motion.div
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
          className="flex w-full"
        >
          <div className="w-[15%] rounded-l-md bg-teal p-2 text-center text-white">
            {number}
          </div>
          <div className="relative flex w-full items-center justify-start rounded-r-md border-2 border-teal bg-white pl-3">
            <span className="text-black">{name}</span>
            <div
              onClick={() => {
                setTimeout(() => {
                  setIsTaskDone(true);
                  setTaskDone({ task_id: id });
                }, 200);
              }}
              className="group absolute -right-3 flex h-8 w-8 items-center justify-center rounded-full border-2 border-teal bg-white"
            >
              <Checkbox className="no-highlight border-0" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
