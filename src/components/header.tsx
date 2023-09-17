import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import router from "next/router";
import Modal from "./ui/modal";
import RoutineForm from "./routine/routineForm";
import AddModal from "./addModal";
import TaskForm from "./task/taskForm";
import { FaUserFriends, FaHandHoldingHeart } from "react-icons/fa";
import { AiFillHome } from "react-icons/ai";
import { BsPersonCircle } from "react-icons/bs";
import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/outline";
import { useSearchParams, useRouter } from "next/navigation";

export default function ProfileInfo() {
  const router = useRouter();
  const { data: sessionData } = useSession();
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
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
      <div className="fixed right-0 pr-3">
        <div className="flex gap-3 xl:gap-6">
          <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
            <Modal.Button className="no-highlight hidden items-center rounded-lg bg-teal px-3 py-1 text-white transition active:bg-teal/80 lg:flex">
              Crear rutina
            </Modal.Button>
            <Modal.Content>
              <AddModal
                TaskForm={<TaskForm afterSave={() => setIsModalOpen(false)} />}
                RoutineForm={
                  <RoutineForm afterSave={() => setIsModalOpen(false)} />
                }
              />
            </Modal.Content>
          </Modal>
          <Button
            className="no-highlight hidden p-2 min-[360px]:flex"
            onClick={() => setIsSideMenuOpen(true)}
          >
            <Bars3Icon className="h-5 w-5 text-black" />
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isSideMenuOpen && (
          <SideMenu closeMenu={() => setIsSideMenuOpen(false)} />
        )}
      </AnimatePresence>
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
    <div className="fixed left-1/2 mt-2 hidden -translate-x-1/2 gap-10 lg:flex xl:gap-16">
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

function SideMenu({ closeMenu }: { closeMenu: () => void }) {
  return (
    <>
      <div onClick={closeMenu} className="fixed inset-0 z-30 bg-black/50" />
      <motion.div
        initial={{ width: 0 }}
        animate={{
          width: screen.width < 640 ? 224 : screen.width < 1024 ? 256 : 288,
        }}
        exit={{ x: screen.width < 640 ? 224 : screen.width < 1024 ? 256 : 288 }}
        transition={{ duration: 0.4 }}
        className="absolute right-0 top-0 z-30 h-full w-56 bg-white py-5 sm:w-64 lg:w-72"
      >
        <div className="pb-5 pt-3 text-center text-2xl text-teal">
          Mind
          <span className="text-orange">Fuel</span>
        </div>
        <div className="w-full border-[1px] border-gray-300" />
        <div className="flex flex-col py-3">
          {navigationItems.map((item) => (
            <Link
              href={item.href}
              key={item.label}
              className={`no-highlight rounded-r-full px-5 py-2 transition-colors active:bg-gray-200 ${
                router.pathname == item.href ? "bg-teal/30" : ""
              }`}
            >
              <div className="flex items-center gap-4">
                {item.icon}
                <span
                  className={`text-lg ${
                    router.pathname == item.href ? "font-medium" : "font-normal"
                  }`}
                >
                  {item.label}
                </span>
              </div>
            </Link>
          ))}
        </div>
        <div className="w-full border-[1px] border-gray-300" />
        <div className="flex flex-col py-5">
          <Button
            className="no-highlight p-0 text-lg font-normal text-black"
            onClick={() => void signOut({ callbackUrl: "/signin" })}
          >
            <div className="flex items-center gap-3">
              <ArrowLeftOnRectangleIcon className="h-6 w-6" />
              <span>Cerrar sesión</span>
            </div>
          </Button>
        </div>
      </motion.div>
    </>
  );
}
