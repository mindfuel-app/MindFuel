import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "./ui/button";
import { XMarkIcon, Bars3Icon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfileInfo() {
  const { data: sessionData } = useSession();
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

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
      <Button className="no-highlight hidden p-2 min-[360px]:flex">
        <Bars3Icon
          className="h-5 w-5 text-black"
          onClick={() => setIsSideMenuOpen(true)}
        />
      </Button>
      <AnimatePresence>
        {isSideMenuOpen && (
          <SideMenu closeMenu={() => setIsSideMenuOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function SideMenu({ closeMenu }: { closeMenu: () => void }) {
  return (
    <motion.div className="absolute right-0 top-0 z-30 w-36 bg-white px-3 py-5 shadow-md">
      <div className="flex w-full justify-end">
        <XMarkIcon className="h-5 w-5" onClick={closeMenu} />
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
