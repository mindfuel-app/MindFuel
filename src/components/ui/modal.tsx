import * as Dialog from "@radix-ui/react-dialog";
import { type ReactNode } from "react";

export default function Modal({
  open,
  onOpenChange,
  children,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </Dialog.Root>
  );
}

function ModalContent({
  children,
  mode,
}: {
  children: ReactNode;
  mode?: "add" | "time";
}) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-30 bg-black/50 data-[state=closed]:animate-[dialog-overlay-hide_200ms] data-[state=open]:animate-[dialog-overlay-show_200ms]" />
      <Dialog.Content
        className={`fixed left-1/2 top-1/2 z-40 w-full max-w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white shadow transition-transform data-[state=closed]:animate-[dialog-content-hide_200ms] data-[state=open]:animate-[dialog-content-show_200ms] min-[500px]:max-w-md ${
          mode == "time" ? "w-60" : ""
        }`}
      >
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  );
}

Modal.Button = Dialog.Trigger;
Modal.Close = Dialog.Close;
Modal.Content = ModalContent;
