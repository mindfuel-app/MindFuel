"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import AuthButton from "../Auth/Components/authButton";
import { MdArrowBackIosNew } from "react-icons/md";
import Link from "next/link";
import Logo from "~/components/logo";
import { api } from "~/utils/api";
import toast, { Toaster } from "react-hot-toast";
import Title from "../Auth/Components/title";
import { cn } from "~/lib/utils";

type FormData = { email: string };

const formSchema = z.object({
  email: z.string().email(),
});

export default function ForgotPasswordPage() {
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const [isEmailWrong, setIsEmailWrong] = useState(false);
  const { mutate: sendPasswordEmail } = api.resetPwd.sendResetPwdEmail.useMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const notify = () => toast.success("Se envió un correo para cambiar la contraseña");

  const submitData = (data: FormData) => {
    setIsFormDisabled(true);
    sendPasswordEmail(
      { email: data.email },
      {
        onSuccess: () => {
          setIsFormDisabled(false);
          notify();
        },
        onError: (error) => {
          setIsFormDisabled(false);
          if (error.message === "Este email no esta registrado") {
            setIsEmailWrong(true);
          } else {
            alert(error);
          }
        },
      }
    );
  };

  return (
    <div className="flex bg-teal">
      <div className="h-screen w-0 min-[1440px]:w-1/6" />
      <main className="flex min-h-screen w-full flex-col bg-alabaster py-10 min-[1440px]:shadow-2xl">
        <div className="flex flex-col items-center">
          <div className="flex w-full items-center justify-between pl-5 lg:justify-end">
            <Link href="/signin" className="no-highlight ml-3 rounded-lg p-1 text-2xl active:bg-gray-300 lg:hidden">
              <MdArrowBackIosNew />
            </Link>
            <Logo />
          </div>
          <div className="flex flex-col items-center p-5">
            <Title title="Olvidé mi contraseña" />
            <p className="max-w-[250px] text-center text-sm font-medium min-[360px]:text-base sm:my-5 lg:mb-0 lg:mt-10">
              Se enviará un enlace para reestablecer la contraseña a tu correo electrónico
            </p>
            <form
              className="w-full"
              onSubmit={(e) => {
                e.preventDefault();
                void handleSubmit(submitData)(e);
              }}
            >
              <fieldset disabled={isFormDisabled} className="group space-y-7 py-5">
                <div className="flex flex-col gap-2 group-disabled:opacity-50">
                  <label className="flex flex-col group-disabled:cursor-not-allowed">
                    <span className={cn("ml-1 font-medium", isEmailWrong && "text-red-500")}>
                      Email
                    </span>
                    <input
                      type="text"
                      className={cn(
                        "w-full min-w-[280px] rounded-xl border-2 border-teal px-3 py-1 outline-none group-disabled:cursor-not-allowed",
                        isEmailWrong && "border-red-500"
                      )}
                      {...register("email")}
                    />
                    {isEmailWrong && (
                      <span className="absolute mt-16 text-xs text-red-500">
                        No existe una cuenta con este email
                      </span>
                    )}
                    {!isEmailWrong && errors.email && (
                      <span className="absolute mt-16 text-xs text-red-500">
                        Ingrese un email válido
                      </span>
                    )}
                  </label>
                </div>
                <div className="flex w-full flex-col items-center gap-5">
                  <AuthButton
                    method="Forgot password"
                    isDisabled={isFormDisabled}
                    onClick={() => setIsEmailWrong(false)}
                  />
                  <span className="mt-3 font-medium sm:text-lg">
                    Volver a{" "}
                    <Link href="/signin" className="no-highlight text-sky-600 underline-offset-2 active:underline">
                      Inicio sesión
                    </Link>
                  </span>
                </div>
              </fieldset>
            </form>
          </div>
          <Toaster />
        </div>
      </main>
      <div className="h-screen w-0 min-[1440px]:w-1/6" />
    </div>
  );
}
