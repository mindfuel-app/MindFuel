import Link from "next/link";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { Divider } from "@mui/material";
import usePasswordToggle from "~/hooks/usePasswordToggle";
import GoogleAuthShowcase from "./googleAuthShowcase";
import { useState } from "react";

export default function SignInForm() {
  const [PasswordInputType, ToggleIcon] = usePasswordToggle();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex flex-col items-center py-20">
      <Image alt="Logo" src="/favicon.ico" width={75} height={58}></Image>
      <h1 className="mb-4 mt-10 text-2xl font-semibold">
        Inicie sesión en MindFuel
      </h1>
      <div className="flex flex-col gap-2 rounded-2xl bg-white p-4 shadow-md">
        <GoogleAuthShowcase />
        <Divider variant="middle">o</Divider>
        <div className="flex flex-col justify-center space-y-5">
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-xl border-2 border-gray-300 px-3 py-1 focus:outline-sky-500"
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="input-group flex w-full items-center justify-between rounded-xl border-2 border-gray-300 px-3 py-1 focus-within:border-sky-500">
            <input
              type={PasswordInputType == "text" ? "text" : "password"}
              placeholder="Contraseña"
              className="outline-none"
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="text-gray-500">{ToggleIcon}</span>
          </div>

          <Link
            href=""
            className="no-highlight rounded-2xl bg-sky-500 px-5 py-2 text-center text-lg text-white active:bg-sky-300"
            onClick={() =>
              void signIn("credentials", {
                email,
                password,
                callbackUrl: "/tareas",
              })
            }
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
