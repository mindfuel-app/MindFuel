import { useTasks } from "~/hooks/useTasks";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckIcon } from "@heroicons/react/24/outline";

export default function TaskCard({
  id,
  number,
  name,
  isChecked,
  isPartOfRoutine,
}: {
  id: string;
  number: number;
  name: string;
  isChecked?: boolean;
  isPartOfRoutine?: boolean;
}) {
  const [isTaskDone, setIsTaskDone] = useState(false);
  const [showCheck, setShowCheck] = useState(isChecked ? isChecked : false);
  const { setTaskDone, setTaskUndone } = useTasks({});
  return (
    <AnimatePresence>
      {(!isTaskDone || isPartOfRoutine) && (
        <motion.div
          exit={{
            opacity: 0,
            x: 20,
          }}
          className="flex w-full"
        >
          <div className="w-[15%] rounded-l-md bg-teal p-2 text-center text-white">
            {number}
          </div>
          <div className="relative flex w-full items-center justify-start rounded-r-md border-2 border-teal bg-white pl-3">
            <span className="text-black">{name}</span>
            <div
              onClick={() => {
                setShowCheck(!showCheck);
                setTimeout(() => {
                  if (showCheck) {
                    setIsTaskDone(false);
                    setTaskUndone({ tasks: [id] });
                  } else {
                    setIsTaskDone(true);
                    setTaskDone({ task_id: id, realTime: 0 });
                  }
                }, 250);
              }}
              className="no-highlight group absolute -right-3 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-teal bg-white"
            >
              {showCheck && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                  }}
                >
                  <CheckIcon className="h-5 w-5 text-teal" />
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
