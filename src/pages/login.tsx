import { signIn } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { CgClose } from "react-icons/cg";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <main className="flex min-h-screen flex-col py-10">
        <div className="flex justify-end pr-7 ">
          <Link href="/landing">
            <CgClose className="text-2xl" />
          </Link>
        </div>
        <div className="flex flex-col items-center py-28">
          <Image alt="Logo" src="/favicon.ico" width={75} height={58}></Image>
          <h1 className="mb-4 mt-10 text-2xl font-semibold">
            Crear cuenta de MindFuel
          </h1>
          <div className="flex flex-col gap-5 rounded-2xl bg-white px-5 py-5 shadow-md">
            <Link
              href=""
              className=" flex items-center justify-center space-x-2 rounded-full px-7 py-1 text-lg"
              onClick={() => void signIn("google", { callbackUrl: "/tareas" })}
            >
              <FcGoogle className="text-2xl" />
              <span>Sign up con Google</span>
            </Link>
          </div>
          <div className="flex items-center"></div>
        </div>
      </main>
    </>
  );
}
