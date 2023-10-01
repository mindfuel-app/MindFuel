import { useSession } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";
import router from "next/router";
import Modal from "./ui/modal";
import RoutineForm from "./routine/routineForm";
import AddModal from "./addModal";
import TaskForm from "./task/taskForm";
import { FaUserFriends, FaHandHoldingHeart } from "react-icons/fa";
import { AiFillHome } from "react-icons/ai";
import { BsPersonCircle } from "react-icons/bs";
import { useSearchParams, useRouter } from "next/navigation";

export default function ProfileInfo() {
  const router = useRouter();
  const { data: sessionData } = useSession();
  const searchParams = useSearchParams();
  const tabParam =
    searchParams.get("tab") == "tareas" || searchParams.get("tab") == "rutinas"
      ? (searchParams.get("tab") as string)
      : "tareas";
  const isModalOpen = searchParams.get("add") == "true";
  const setIsModalOpen = (open: boolean) => {
    const queryString = open ? `?tab=${tabParam}&add=true` : `?tab=${tabParam}`;
    router.push(queryString);
  };

  if (!sessionData)
    return (
      <div className="flex items-center justify-between bg-alabaster p-3">
        <span>No ha iniciado sesión</span>
        <Link href="/signin" className="hidden min-[360px]:flex">
          Ir a inicio sesión
        </Link>
      </div>
    );

  return (
    <div className="flex items-center justify-between bg-alabaster p-3 pt-5 font-medium">
      <span>
        Bienvenido,{" "}
        <span className="font-semibold text-orange">
          {sessionData.user.name}
        </span>
      </span>
      <Navigation />
      <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Modal.Button className="no-highlight fixed right-7 hidden rounded-lg bg-teal px-3 py-2 text-white transition-all active:bg-teal/80 lg:block">
          Crear rutina
        </Modal.Button>
        <Modal.Content>
          <AddModal
            TaskModal={
              <TaskForm mode="create" afterSave={() => setIsModalOpen(false)} />
            }
            RoutineModal={
              <RoutineForm afterSave={() => setIsModalOpen(false)} />
            }
          />
        </Modal.Content>
      </Modal>
    </div>
  );
}

const navigationItems = [
  { href: "/home", label: "Home", icon: <AiFillHome className="h-6 w-6" /> },
  {
    href: "/self-care",
    label: "Self-care",
    icon: <FaHandHoldingHeart className="h-6 w-6" />,
  },
  {
    href: "/amigos",
    label: "Amigos",
    icon: <FaUserFriends className="h-6 w-6" />,
  },
  {
    href: "/perfil",
    label: "Perfil",
    icon: <BsPersonCircle className="h-6 w-6" />,
  },
];

function Navigation() {
  return (
    <div className="fixed left-1/2 z-10 mt-2 hidden -translate-x-1/2 gap-10 lg:flex xl:gap-16">
      {navigationItems.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className={`no-highlight px-3 py-1.5 transition ${
            router.pathname != item.href ? "hover:opacity-70" : ""
          }`}
        >
          <span
            className={`${
              router.pathname == item.href ? "font-medium" : "font-normal"
            }`}
          >
            {item.label}
          </span>
          {router.pathname == item.href && (
            <motion.div
              layoutId="active-underline"
              className="border-2 border-teal"
            ></motion.div>
          )}
        </Link>
      ))}
    </div>
  );
}
