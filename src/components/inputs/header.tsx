import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import Modal from "../ui/modal";
import {
  ArrowLeftOnRectangleIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { Button } from "../ui/button";
import ClickAwayListener from "react-click-away-listener";
import { TopNavigation } from "./navigation";
import TaskForm from "../task/taskForm";
import AddModal from "./addModal";
import RoutineForm from "../routine/routineForm";
import { api } from "~/utils/api";
import { useUser } from "~/lib/UserContext";
import { useTheme } from "~/lib/ThemeContext";
import { cn } from "~/lib/utils";

export default function Header({
  showNavigation,
}: {
  showNavigation: boolean;
}) {
  const { themeColor } = useTheme();
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
    <div className="glass-surface relative z-30 mx-auto mt-3 flex w-[calc(100%-1.5rem)] max-w-6xl items-center justify-between rounded-2xl px-4 py-3 font-medium sm:px-5">
      <div className="relative flex items-center gap-1">
        <span>Bienvenido, </span>
        <ClickAwayListener onClickAway={() => setShowLogout(false)}>
          <div className="relative">
            <div
              onClick={() => setShowLogout(!showLogout)}
              className="no-highlight flex cursor-pointer select-none items-center gap-1 rounded-md px-1 transition-colors active:bg-gray-200"
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
            <AnimatePresence>
              {showLogout && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 top-full z-40 mt-2 min-w-[10rem] rounded-xl border border-gray-200 bg-white px-2 py-1 text-gray-800 shadow-lg"
                >
                  <Button
                    className="no-highlight w-full justify-start p-1 text-base font-normal text-gray-800"
                    onClick={() => void signOut({ callbackUrl: "/signin" })}
                  >
                    <div className="flex items-center gap-2">
                      <ArrowLeftOnRectangleIcon className="h-5 w-5 text-gray-600" />
                      <span>Cerrar sesión</span>
                    </div>
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ClickAwayListener>
      </div>
      {showNavigation && (
        <>
          <TopNavigation />
          <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
            <Modal.Button
              className={cn(
                "no-highlight absolute right-7 hidden items-center gap-2 rounded-xl px-3 py-2 text-white shadow-md transition-all lg:flex",
                themeColor == "teal"
                  ? "bg-teal active:bg-teal/80"
                  : "bg-orange-red active:bg-orange-red/80"
              )}
            >
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
