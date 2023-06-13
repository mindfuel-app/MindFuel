import { signIn } from "next-auth/react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";

export default function GoogleAuthShowcase() {
  return (
    <Link
      href=""
      className="no-highlight flex items-center justify-center space-x-2 rounded-2xl border-2 border-[#008080] bg-white px-12 py-2 text-lg active:bg-gray-100"
      onClick={() => void signIn("google", { callbackUrl: "/tareas" })}
    >
      <FcGoogle className="text-2xl" />
      <span className="text-">Sign in con Google</span>
    </Link>
  );
}
