import Modal from "../ui/modal";
import RoutineForm from "../routine/routineForm";
import AddModal from "./addModal";
import TaskForm from "../task/taskForm";
import { api } from "~/utils/api";
import { useUser } from "~/contexts/UserContext";
import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "~/lib/utils";
import { useTheme } from "~/contexts/ThemeContext";

export default function AddButton({ showLabel }: { showLabel: boolean }) {
  const user = useUser();
  const { themeColor } = useTheme();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { refetch: refetchTasks } = api.tasks.getTasks.useQuery({
    user_id: user.id,
  });
  const { refetch: refetchRoutines } = api.routines.getRoutines.useQuery({
    user_id: user.id,
  });

  return (
    <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
      <Modal.Button>
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center justify-center"
        >
          <div
            className={cn(
              "no-highlight absolute flex transform items-center rounded-2xl border-2 bg-white py-3 shadow-lg transition-all active:scale-[98%]",
              showLabel ? "gap-3 px-4" : "px-3",
              themeColor == "teal" ? "border-teal" : "border-orange-red"
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke={themeColor == "teal" ? "teal" : "#FF5353"}
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            <motion.span
              initial={{ maxWidth: 0, overflow: "hidden" }}
              animate={{ maxWidth: showLabel ? 120 : 0 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "text-lg font-medium",
                themeColor == "teal" ? "text-teal" : "text-orange-red"
              )}
            >
              {showLabel && "Crear"}
            </motion.span>
          </div>
        </motion.div>
      </Modal.Button>
      <Modal.Content>
        <AddModal
          TaskModal={
            <TaskForm
              mode="create"
              afterSave={() => {
                void refetchTasks();
                setIsModalOpen(false);
              }}
            />
          }
          RoutineModal={
            <RoutineForm
              afterSave={() => {
                void refetchRoutines();
                setIsModalOpen(false);
              }}
            />
          }
        />
      </Modal.Content>
    </Modal>
  );
}
