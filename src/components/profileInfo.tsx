import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "./ui/button";

export default function ProfileInfo() {
  const { data: sessionData } = useSession();

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
      <Button
        variant="outline"
        className="no-highlight hidden rounded-xl border-2 border-black px-2 py-1 min-[360px]:flex"
        onClick={() => void signOut({ callbackUrl: "/signin" })}
      >
        Cerrar sesión
      </Button>
    </div>
  );
}
