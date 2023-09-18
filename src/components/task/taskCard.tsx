import { useTasks } from "~/hooks/useTasks";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

export default function TaskCard({
  id,
  number,
  name,
  deadline,
  isChecked,
  showCompletedTasks,
  isPartOfRoutine,
}: {
  id: string;
  number: number;
  name: string;
  deadline?: Date | null;
  isChecked?: boolean;
  showCompletedTasks?: boolean;
  isPartOfRoutine?: boolean;
}) {
  const [isTaskDone, setIsTaskDone] = useState(false);
  const [showCheck, setShowCheck] = useState(isChecked ? isChecked : false);
  const { setTaskDone, setTaskUndone } = useTasks({});

  const deadlineDate = deadline
    ? `${deadline.getDate()}/${deadline.getMonth() + 1}`
    : null;

  return (
    <AnimatePresence>
      {(!isTaskDone || isPartOfRoutine || showCompletedTasks) && (
        <motion.div
          exit={{
            opacity: 0,
            x: 20,
          }}
          className="flex w-full"
        >
          {/* <div className="flex w-[15%] items-center justify-center rounded-l-md bg-teal p-2 text-white">
            {number}
          </div> */}
          <div className="relative flex w-full items-center justify-start rounded-md border-2 border-teal bg-white py-1 pl-3">
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
                      (isChecked && showCompletedTasks) ||
                      (isTaskDone && showCompletedTasks)
                        ? "text-gray-500 line-through"
                        : ""
                    }`}
                  >
                    {deadlineDate}
                  </span>
                </div>
              )}
            </div>
            <button className="no-highlight group absolute right-6">
              <PencilSquareIcon className="h-7 w-7 text-gray-600 group-active:text-gray-800 lg:group-hover:text-gray-800" />
            </button>
            {!isPartOfRoutine && (
              <div
                onClick={() => {
                  if ((isChecked || isTaskDone) && showCompletedTasks) return;
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
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
