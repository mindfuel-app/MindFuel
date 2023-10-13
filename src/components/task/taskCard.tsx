import { useTasks } from "~/hooks/useTasks";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import Modal from "../ui/modal";
import TaskForm from "./taskForm";
import { api } from "~/utils/api";
import { useUser } from "~/lib/UserContext";
import { cn } from "~/lib/utils";

export default function TaskCard({
  id,
  name,
  deadline,
  description,
  routineId,
  isChecked,
  isPartOfRoutine,
  showCompletedTasks,
}: {
  id: string;
  name: string;
  deadline: Date | null;
  description: string | null;
  routineId: string;
  isChecked?: boolean;
  isPartOfRoutine: boolean;
  showCompletedTasks: boolean;
}) {
  const user = useUser();
  const { refetch: refetchTasks } = api.tasks.getTasks.useQuery({
    user_id: user.id,
  });
  const { data: routine } = api.routines.getRoutineById.useQuery({
    id: routineId,
  });

  const [isTaskDone, setIsTaskDone] = useState(isChecked || false);
  const [showCheck, setShowCheck] = useState(isChecked || false);
  const { setTaskDone, setTaskUndone } = useTasks({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  let dayOfWeek = new Date().toLocaleString("es", { weekday: "short" });
  dayOfWeek = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);

  const isForToday = routine?.days.includes(dayOfWeek);

  const deadlineDate = deadline
    ? `${deadline.getDate()}/${deadline.getMonth() + 1}`
    : null;

  const maxDescriptionCharacters = 27;

  return (
    <AnimatePresence>
      {(!isTaskDone || showCompletedTasks) && isForToday !== false && (
        <motion.div
          initial={{ opacity: isTaskDone ? 0 : 1 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            x: 20,
          }}
          transition={{ duration: 0.2 }}
          className="relative flex w-72 items-center justify-between rounded-md border-2 border-teal bg-white py-1 pl-3 min-[360px]:w-[300px] sm:w-[400px] lg:w-[500px] lg:py-2"
        >
          <div className="flex max-w-[210px] flex-col py-1 sm:max-w-[235px] lg:max-w-[280px]">
            <span
              className={cn(
                "text-black",
                isTaskDone && "line-through opacity-50"
              )}
            >
              {name.split(" ").some((word) => word.length > 26)
                ? `${name.substring(0, 24)}...`
                : name}
            </span>
            {description && (
              <span className="mb-1 text-sm text-gray-500">
                {description.length <= maxDescriptionCharacters
                  ? description
                  : `${description.substring(
                      0,
                      maxDescriptionCharacters - 3
                    )}...`}
              </span>
            )}
            {deadlineDate && (
              <div className="flex gap-1">
                <CalendarIcon className="mt-[1px] h-4 w-4 text-orange" />
                <span
                  className={cn(
                    "text-sm text-orange",
                    isTaskDone && "text-gray-500 line-through"
                  )}
                >
                  {deadlineDate}
                </span>
              </div>
            )}
          </div>
          {!isTaskDone && !isPartOfRoutine && (
            <>
              <motion.button
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="no-highlight group"
                onClick={() => setIsModalOpen(true)}
              >
                <div className="flex h-full items-center">
                  <PencilSquareIcon className="absolute right-7 h-7 w-7 text-gray-600 group-active:text-gray-800 lg:group-hover:text-gray-800" />
                </div>
              </motion.button>
              <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
                <Modal.Content>
                  <TaskForm
                    mode="edit"
                    id={id}
                    initialName={name}
                    initialDescription={description || ""}
                    initialDeadline={deadline}
                    afterSave={() => {
                      void refetchTasks();
                      setIsModalOpen(false);
                    }}
                  />
                </Modal.Content>
              </Modal>
            </>
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
                  setTaskDone({ task_id: id });
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
