import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "./ui/button";

export default function ProfileInfo() {
  const { data: sessionData } = useSession();

  return (
    <div className="flex items-center justify-between px-2 py-3">
      <h1>{sessionData && <p>Bienvenido {sessionData.user.name}</p>}</h1>
      {sessionData && (
        <Button
          variant="outline"
          className="rounded-xl border-2 border-black px-2 py-1"
          onClick={() => void signOut({ callbackUrl: "/signin" })}
        >
          Cerrar sesión
        </Button>
      )}
    </div>
  );
}
