import { signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";

export default function ProfileInfo() {
  const { data: sessionData } = useSession();

  return (
    <div className="flex items-center justify-between bg-gradient-to-b from-[#5C7AFF] to-[#E9E9E9] px-3 py-5">
      <span>{sessionData && <p>Buenos días, {sessionData.user.name}</p>}</span>
      {sessionData && (
        <Button
          variant="outline"
          className="no-highlight rounded-xl border-2 border-black px-2 py-1"
          onClick={() => void signOut({ callbackUrl: "/signin" })}
        >
          Cerrar sesión
        </Button>
      )}
    </div>
  );
}
