import { useRouter } from "next/router";
import Modal from "./ui/modal";
import { useState } from "react";
import RoutineForm from "./routineForm";

export default function AddButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  return (
    <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
      <Modal.Button
        disabled={router.pathname != "/home"}
        className="absolute -top-9 h-14 w-14 rounded-full border-[3px] border-teal bg-white transition-colors group-active:bg-teal min-[425px]:h-16 min-[425px]:w-16 lg:group-hover:bg-teal"
      >
        <span className="text-2xl font-extrabold text-teal group-active:text-white lg:group-hover:text-white">
          +
        </span>
      </Modal.Button>
      <Modal.Content title="Crear rutina">
        <RoutineForm
          afterSave={() => setIsModalOpen(false)}
          initialName=""
          initialTasks={[
            {
              id: 1,
              name: "",
              done: false,
              createdAt: new Date(),
            },
          ]}
        />
      </Modal.Content>
    </Modal>
  );
}
