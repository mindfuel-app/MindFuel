import Link from "next/link";
import Navigation from "./navigation";
import { signOut, useSession } from "next-auth/react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { data: sessionData } = useSession();

  return (
    <>
      <div className="flex items-center justify-between px-2 py-3">
        <h1>{sessionData && <p>Bienvenido {sessionData.user.name}</p>}</h1>
        {sessionData && (
          <Link
            className="rounded-xl border-2 border-black px-2 py-1"
            href=""
            onClick={() => void signOut({ callbackUrl: "/login" })}
          >
            Cerrar sesión
          </Link>
        )}
      </div>
      {children}
      <Navigation />
    </>
  );
}
