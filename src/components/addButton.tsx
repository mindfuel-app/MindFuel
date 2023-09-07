import { useRouter } from "next/router";
import Modal from "./ui/modal";
import { useState } from "react";
import RoutineForm from "./routine/routineForm";
import AddModal from "./addModal";
import TaskForm from "./task/taskForm";
import { api } from "~/utils/api";
import { useUser } from "~/lib/UserContext";

export default function AddButton() {
  const user = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
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
          TaskForm={
            <TaskForm
              afterSave={() => {
                void refetchTasks();
                setIsModalOpen(false);
              }}
            />
          }
          RoutineForm={
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
