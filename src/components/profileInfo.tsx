import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "./ui/button";

export default function ProfileInfo() {
  const { data: sessionData } = useSession();

  if (!sessionData)
    return (
      <div className="flex items-center justify-between bg-[#EDECE7] p-3">
        <span>No ha iniciado sesión</span>
        <Link href="/signin">Ir a inicio sesión</Link>
      </div>
    );

  return (
    <div className="flex items-center justify-between bg-[#EDECE7] p-3 font-medium">
      <span>
        Buenos días,{" "}
        <span className="font-semibold text-[#FF7F11]">
          {sessionData.user.name}
        </span>
      </span>
      <Button
        variant="outline"
        className="no-highlight rounded-xl border-2 border-black px-2 py-1"
        onClick={() => void signOut({ callbackUrl: "/signin" })}
      >
        Cerrar sesión
      </Button>
    </div>
  );
}
