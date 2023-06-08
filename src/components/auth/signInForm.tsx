import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { Divider } from "@mui/material";

export default function SignInForm() {
  return (
    <div className="flex flex-col items-center py-24">
      <Image alt="Logo" src="/favicon.ico" width={75} height={58}></Image>
      <h1 className="mb-4 mt-10 text-2xl font-semibold">
        Inicie sesión en MindFuel
      </h1>
      <div className="flex flex-col gap-2 rounded-2xl bg-white p-3 shadow-md">
        <Link
          href=""
          className="flex items-center justify-center space-x-2 rounded-2xl border-2 border-gray-200 py-2 text-lg"
          onClick={() => void signIn("google", { callbackUrl: "/tareas" })}
        >
          <FcGoogle className="text-2xl" />
          <span className="text-">Sign in con Google</span>
        </Link>
        <Divider variant="middle">or</Divider>
        <div className="flex flex-col justify-center space-y-5 px-2 py-5">
          <input
            type="text"
            placeholder="Email"
            className="w-full rounded-xl border-2 border-gray-300 p-2 pl-2 focus:outline-sky-500"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-xl border-2 border-gray-300 p-2 pl-2 focus:outline-sky-500"
          />
          <Link
            href=""
            className="rounded-2xl bg-sky-500 py-3 text-center text-white"
            onClick={() => void signIn("credentials")}
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
