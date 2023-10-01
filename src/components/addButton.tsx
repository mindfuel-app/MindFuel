import Modal from "./ui/modal";
import RoutineForm from "./routine/routineForm";
import AddModal from "./addModal";
import TaskForm from "./task/taskForm";
import { api } from "~/utils/api";
import { useUser } from "~/lib/UserContext";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function AddButton() {
  const user = useUser();
  const routerNav = useRouter();
  const searchParams = useSearchParams();
  const tabParam =
    searchParams.get("tab") === "tareas" ||
    searchParams.get("tab") === "rutinas"
      ? (searchParams.get("tab") as string)
      : "tareas";
  const isModalOpen = searchParams.get("add") == "true";

  const setIsModalOpen = (open: boolean) => {
    const queryString = open ? `?tab=${tabParam}&add=true` : `?tab=${tabParam}`;
    routerNav.push(queryString);
  };
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
          <button className="no-highlight absolute flex transform items-center gap-3 rounded-2xl border-2 border-teal bg-white px-4 py-3 shadow-lg transition-all active:scale-[98%] ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="teal"
              className="h-6 w-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            <span className="text-lg font-medium text-teal">Crear</span>
          </button>
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
