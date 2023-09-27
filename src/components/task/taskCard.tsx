import { useTasks } from "~/hooks/useTasks";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

export default function TaskCard({
  id,
  name,
  deadline,
  isChecked,
  showCompletedTasks,
}: {
  id: string;
  name: string;
  deadline?: Date | null;
  isChecked?: boolean;
  showCompletedTasks?: boolean;
}) {
  const [isTaskDone, setIsTaskDone] = useState(isChecked || false);
  const [showCheck, setShowCheck] = useState(isChecked || false);
  const { setTaskDone, setTaskUndone } = useTasks({});

  const deadlineDate = deadline
    ? `${deadline.getDate()}/${deadline.getMonth() + 1}`
    : null;

  return (
    <AnimatePresence>
      {(!isTaskDone || showCompletedTasks) && (
        <motion.div
          exit={{
            opacity: 0,
            x: 20,
          }}
          className="relative flex w-full items-center justify-start rounded-md border-2 border-teal bg-white py-1 pl-3"
        >
          <div className="flex flex-col py-1">
            <span
              className={`text-black ${
                (isChecked && showCompletedTasks) ||
                (isTaskDone && showCompletedTasks)
                  ? "line-through opacity-50"
                  : ""
              }`}
            >
              {name}
            </span>
            {deadlineDate && (
              <div className="flex gap-1">
                <CalendarIcon className="mt-[1px] h-4 w-4 text-orange" />
                <span
                  className={`text-sm text-orange ${
                    isTaskDone ? "text-gray-500 line-through" : ""
                  }`}
                >
                  {deadlineDate}
                </span>
              </div>
            )}
          </div>
          {!isTaskDone && (
            <motion.button
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="no-highlight group absolute right-6"
            >
              <PencilSquareIcon className="h-7 w-7 text-gray-600 group-active:text-gray-800 lg:group-hover:text-gray-800" />
            </motion.button>
          )}
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
            className="no-highlight group absolute right-1 flex h-8 w-8 translate-x-1/2 cursor-pointer items-center justify-center rounded-full border-2 border-teal bg-white"
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
