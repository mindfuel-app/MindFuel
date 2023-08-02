import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "./ui/button";
import { XMarkIcon, Bars3Icon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import router from "next/router";
import Modal from "./ui/modal";
import RoutineForm from "./routineForm";

export default function ProfileInfo() {
  const { data: sessionData } = useSession();
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    <div className="flex items-center justify-between bg-alabaster p-3 font-medium">
      <span>
        Bienvenido,{" "}
        <span className="font-semibold text-orange">
          {sessionData.user.name}
        </span>
      </span>
      <Navigation />
      <div className="flex gap-6">
        <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
          <Modal.Button className="no-highlight hidden items-center rounded-lg bg-teal px-3 py-1 text-white transition active:bg-teal/80 lg:flex">
            Crear rutina
          </Modal.Button>
          <Modal.Content title="Crear rutina">
            <RoutineForm
              afterSave={() => setIsModalOpen(false)}
              initialName=""
              initialTasks={[{ id: 1, number: 1, name: "" }]}
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

      <AnimatePresence>
        {isSideMenuOpen && (
          <SideMenu closeMenu={() => setIsSideMenuOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function Navigation() {
  const navigationItems = [
    { href: "/home", label: "Home" },
    { href: "/self-care", label: "Self-care" },
    { href: "/amigos", label: "Amigos" },
    { href: "/perfil", label: "Perfil" },
  ];

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
    <motion.div className="absolute right-0 top-0 z-30 w-36 bg-white px-3 py-5 shadow-md">
      <div className="flex w-full justify-end">
        <XMarkIcon className="h-5 w-5 cursor-pointer" onClick={closeMenu} />
      </div>
      <div className="flex flex-col py-12">
        <Button
          className="no-highlight p-0 font-normal text-black"
          onClick={() => void signOut({ callbackUrl: "/signin" })}
        >
          Cerrar sesión
        </Button>
      </div>
    </motion.div>
  );
}
