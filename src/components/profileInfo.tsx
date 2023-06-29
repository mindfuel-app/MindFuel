import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "./ui/button";

export default function ProfileInfo() {
  const { data: sessionData } = useSession();

  return (
    <div className="flex items-center justify-between bg-[#E9E9E9] px-3 py-5">
      {sessionData && <span>Buenos días, {sessionData.user.name}</span>}
      {sessionData && (
        <Button
          variant="outline"
          className="no-highlight rounded-xl border-2 border-black px-2 py-1"
          onClick={() => void signOut({ callbackUrl: "/signin" })}
        >
          Cerrar sesión
        </Button>
      )}
      {!sessionData && <span>No ha iniciado sesión</span>}
      {!sessionData && <Link href="/signin">Ir a inicio sesión</Link>}
    </div>
  );
}
