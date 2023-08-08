import { ClockIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import TimeModal from "./timeModal";
import Modal from "./ui/modal";

export default function ClockButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Modal.Button className="no-highlight rounded-full">
          <ClockIcon className="h-6 w-6" />
        </Modal.Button>
        <Modal.Content mode="time">
          <TimeModal afterSave={() => setIsModalOpen(false)} />
        </Modal.Content>
      </Modal>
    </>
  );
}
