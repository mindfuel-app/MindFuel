import { useTasks } from "~/hooks/useTasks";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import Modal from "../ui/modal";
import TaskForm from "./taskForm";
import { api } from "~/utils/api";
import { useUser } from "~/contexts/UserContext";
import { cn } from "~/lib/utils";
import { usePoints } from "~/hooks/usePoints";
import { taskPoints } from "~/lib/points";
import { useTheme } from "~/contexts/ThemeContext";
import useWindowWidth from "~/hooks/useWindowWidth";

export default function TaskCard({
  id,
  name,
  deadline,
  description,
  isChecked,
  isPartOfRoutine,
  showCompletedTasks,
}: {
  id: string;
  name: string;
  deadline: Date | null;
  description: string | null;
  isChecked?: boolean;
  isPartOfRoutine: boolean;
  showCompletedTasks: boolean;
}) {
  const { themeColor } = useTheme();
  const user = useUser();
  const { refetch: refetchTasks } = api.tasks.getTasks.useQuery({
    user_id: user.id,
  });
  const { addPoints } = usePoints();

  const [isTaskDone, setIsTaskDone] = useState(isChecked || false);
  const [showCheck, setShowCheck] = useState(isChecked || false);
  const [showPointsAnimation, setShowPointsAnimation] = useState(false);
  const { setTaskDone } = useTasks({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const windowWidth = useWindowWidth();
  const [showCompleteDescription, setShowCompleteDescription] = useState(false);

  useEffect(() => {
    setShowPointsAnimation(false);
  }, [showPointsAnimation]);

  const today = new Date();
  const tomorrow = new Date(new Date().setDate(today.getDate() + 1));
  const yesterday = new Date(new Date().setDate(today.getDate() - 1));

  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const rewardPoints =
    !deadline || deadline.getTime() >= startOfDay.getTime()
      ? taskPoints.completed
      : taskPoints.completedAfterDeadline;

  const deadlineDate = deadline
    ? deadline.toDateString() == today.toDateString()
      ? "Hoy"
      : deadline.toDateString() == tomorrow.toDateString()
        ? "Mañana"
        : deadline.toDateString() == yesterday.toDateString()
          ? "Ayer"
          : `${deadline.getDate()}/${deadline.getMonth() + 1}`
    : null;

  const maxNameCharacters = 21;
  const maxDescriptionCharacters = windowWidth < 640 ? 27 : 100;

  const isCardVisible =
    !isTaskDone || showCompletedTasks || showPointsAnimation;

  return (
    <AnimatePresence>
      {isCardVisible && (
        <motion.div
          initial={{ opacity: isTaskDone ? 0 : 1 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            x: 15,
          }}
          transition={{ duration: 0.4 }}
          className={cn(
            "relative flex w-72 items-center justify-between rounded-md border-2 bg-white py-1 pl-3 min-[360px]:w-[300px] sm:w-[500px] lg:w-[700px] lg:py-3",
            themeColor == "teal" ? "border-teal" : "border-orange-red"
          )}
        >
          <div
            onClick={() => setShowCompleteDescription(!showCompleteDescription)}
            className="flex max-w-[210px] flex-col py-1 sm:max-w-[235px] lg:max-w-[280px] lg:gap-1"
          >
            <span
              className={cn(
                "text-black lg:text-xl",
                isTaskDone && "line-through opacity-50"
              )}
            >
              {name.split(" ").some((word) => word.length > maxNameCharacters)
                ? `${name.substring(0, maxNameCharacters - 3)}...`
                : name}
            </span>
            {description && (
              <span className="mb-1 text-sm text-gray-500">
                {showCompleteDescription ? (
                  description
                ) : (
                  <>
                    {description.length <= maxDescriptionCharacters
                      ? description
                      : `${description.substring(
                        0,
                        maxDescriptionCharacters - 3
                      )}...`}
                  </>
                )}
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
                  <PencilSquareIcon className="absolute right-7 h-7 w-7 text-gray-600 group-active:text-gray-800 lg:right-10 lg:h-8 lg:w-8 lg:group-hover:text-gray-800" />
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
              if (showCheck) return;
              setShowCheck(true);
              setTimeout(() => {
                addPoints({
                  user_id: user.id,
                  points: rewardPoints,
                });
                setShowPointsAnimation(true);
                setIsTaskDone(true);
                setTaskDone({ task_id: id });
              }, 250);
            }}
            className={cn(
              "no-highlight group absolute right-1 flex h-8 w-8 translate-x-1/2 cursor-pointer items-center justify-center rounded-full border-2 bg-white lg:h-9 lg:w-9",
              themeColor == "teal" ? "border-teal" : "border-orange-red"
            )}
          >
            {showPointsAnimation && (
              <motion.div
                animate={{ opacity: 0.5, y: -30, x: -30 }}
                transition={{ duration: 0.6 }}
                className={cn(
                  "absolute -right-7 text-3xl font-medium",
                  themeColor == "teal" ? "text-teal" : "text-orange-red"
                )}
              >
                +{rewardPoints}
              </motion.div>
            )}
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
                <CheckIcon
                  className={cn(
                    "h-5 w-5",
                    themeColor == "teal" ? "text-teal" : "text-orange-red"
                  )}
                />
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
