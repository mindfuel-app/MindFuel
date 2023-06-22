import { signIn } from "next-auth/react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";

export default function GoogleAuthShowcase() {
  return (
    <Link
      href=""
      className="no-highlight flex items-center justify-center space-x-2 rounded-2xl border-2 border-[#008080]  bg-white px-8 py-2 text-lg focus:outline-none active:bg-gray-100 min-[360px]:px-12 sm:px-20"
      onClick={() => void signIn("google", { callbackUrl: "/tareas" })}
    >
      <FcGoogle className="text-2xl" />
      <span>Sign in con Google</span>
    </Link>
  );
}
