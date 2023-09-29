import router from "next/router";
import Modal from "./ui/modal";
import RoutineForm from "./routine/routineForm";
import AddModal from "./addModal";
import TaskForm from "./task/taskForm";
import { api } from "~/utils/api";
import { useUser } from "~/lib/UserContext";
import { useSearchParams, useRouter } from "next/navigation";

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
      <Modal.Button
        disabled={router.pathname != "/home"}
        className="absolute -top-9 h-14 w-14 transform rounded-full border-[3px] border-teal bg-white transition-all group-active:scale-95 min-[425px]:h-16 min-[425px]:w-16"
      >
        <span className="text-2xl font-extrabold text-teal">+</span>
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
