import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import Modal from "./ui/modal";
import {
  ArrowLeftOnRectangleIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { Button } from "./ui/button";
import ClickAwayListener from "react-click-away-listener";
import { TopNavigation } from "./navigation";
import TaskForm from "./task/taskForm";
import AddModal from "./addModal";
import RoutineForm from "./routine/routineForm";
import { api } from "~/utils/api";
import { useUser } from "~/lib/UserContext";

export default function Header({
  showNavigation,
}: {
  showNavigation: boolean;
}) {
  const user = useUser();
  const [showLogout, setShowLogout] = useState(false);
  const { data: sessionData } = useSession();
  const { refetch: refetchTasks } = api.tasks.getTasks.useQuery({
    user_id: user.id,
  });
  const { refetch: refetchRoutines } = api.routines.getRoutines.useQuery({
    user_id: user.id,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!sessionData)
    return (
      <div className="flex items-center justify-between p-3">
        <span>No ha iniciado sesión</span>
        <Link href="/signin" className="hidden min-[360px]:flex">
          Ir a inicio sesión
        </Link>
      </div>
    );

  return (
    <div className="flex items-center justify-between p-3 pt-5 font-medium">
      <div className="relative flex items-center gap-1">
        <span>Bienvenido, </span>
        <ClickAwayListener onClickAway={() => setShowLogout(false)}>
          <div
            onClick={() => setShowLogout(!showLogout)}
            className="no-highlight flex cursor-pointer select-none items-center gap-1 rounded-md transition-colors active:bg-gray-300"
          >
            <span className="font-semibold text-orange">
              {sessionData.user.name}
            </span>
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: showLogout ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDownIcon className="h-4 w-4 text-gray-600 active:text-gray-900" />
            </motion.div>
          </div>
        </ClickAwayListener>
        <AnimatePresence>
          {showLogout && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute -right-2 top-7 z-20 rounded-lg bg-gray-700 px-2 text-white shadow-lg"
            >
              <Button
                className="no-highlight p-0 text-base font-normal"
                onClick={() => void signOut({ callbackUrl: "/signin" })}
              >
                <div className="flex items-center gap-2">
                  <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                  <span>Cerrar sesión</span>
                </div>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {showNavigation && (
        <>
          <TopNavigation />
          <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
            <Modal.Button className="no-highlight absolute right-7 hidden items-center gap-2 rounded-lg bg-teal px-3 py-2 text-white transition-all active:bg-teal/80 lg:flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="white"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              Crear
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
        </>
      )}
    </div>
  );
}
