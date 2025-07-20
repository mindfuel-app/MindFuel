"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Divider } from "@mui/material";
import usePasswordToggle from "~/hooks/usePasswordToggle";
import GoogleAuthShowcase from "./googleAuthShowcase";
import { signIn } from "next-auth/react";
import AuthButton from "./authButton";
import AlternativeMethodLink from "./alternativeMethodLink";
import ForgotPasswordButton from "./forgotPasswordButton";
import router from "next/router";
import { useState } from "react";
import { cn } from "~/lib/utils";

export default function SignInForm() {
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const [isPasswordWrong, setIsPasswordWrong] = useState(false);
  const [isEmailWrong, setIsEmailWrong] = useState(false);
  const [isGoogleAccount, setIsGoogleAccount] = useState(false);
  const [PasswordInputType, ToggleIcon] = usePasswordToggle(isPasswordWrong);

  type FormData = {
    email: string;
    password: string;
  };

  const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(30),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const submitData = async (data: FormData) => {
    setIsFormDisabled(true);
    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    }).then((response) => {
      if (response?.error) {
        setIsFormDisabled(false);
        if (response.error == "Contraseña Incorrecta") {
          return setIsPasswordWrong(true);
        }
        if (response.error == "Este email no esta registrado") {
          return setIsEmailWrong(true);
        }
        if (response.error == "data and hash arguments required") {
          return setIsGoogleAccount(true);
        }
        return alert(response.error);
      }
      void router.push("/home");
    });
  };

  const emailErrorMessage = isEmailWrong
    ? "No existe una cuenta con este email"
    : !isEmailWrong && errors.email
    ? "Ingrese un email valido"
    : isGoogleAccount
    ? "Esta cuenta esta registrada con Google"
    : null;

  const passwordErrorMessage = isPasswordWrong
    ? "Contraseña incorrecta"
    : !isPasswordWrong && errors.password
    ? "Contraseña: 6-30 caracteres"
    : null;

  return (
    <form
      className="py-3 sm:py-10"
      onSubmit={(event) => {
        event.preventDefault();
        void handleSubmit(submitData)(event);
      }}
    >
      <fieldset
        disabled={isFormDisabled}
        className="group flex flex-col justify-center space-y-7"
      >
        <div className="flex flex-col gap-2 group-disabled:opacity-50">
          <label className="flex flex-col group-disabled:cursor-not-allowed">
            <span
              className={cn("ml-1 font-medium", isEmailWrong && "text-red-500")}
              onClick={(e) => e.preventDefault()}
            >
              Email
            </span>
            <input
              type="text"
              className={cn(
                "w-full rounded-xl border-2 border-teal px-3 py-1 outline-none group-disabled:cursor-not-allowed",
                isEmailWrong && "border-red-500"
              )}
              {...register("email")}
              onChange={() => setIsGoogleAccount(false)}
            />
            {emailErrorMessage && (
              <span className="absolute mt-16 text-xs text-red-500">
                {emailErrorMessage}
              </span>
            )}
          </label>
        </div>
        <div className="flex flex-col gap-2 group-disabled:opacity-50">
          <label className="flex flex-col group-disabled:cursor-not-allowed">
            <span
              className={cn(
                "ml-1 font-medium",
                isPasswordWrong && "text-red-500"
              )}
              onClick={(e) => e.preventDefault()}
            >
              Contraseña
            </span>
            <div
              className={cn(
                "flex w-full items-center justify-between rounded-xl border-2 border-teal bg-white px-3 py-1",
                isPasswordWrong && "border-red-500"
              )}
            >
              <input
                type={PasswordInputType == "text" ? "text" : "password"}
                className="w-full outline-none group-disabled:cursor-not-allowed"
                {...register("password")}
              />
              <span>{ToggleIcon}</span>
            </div>
            {passwordErrorMessage && (
              <span className="absolute mt-16 text-xs text-red-500">
                {passwordErrorMessage}
              </span>
            )}
          </label>
        </div>
        <div className="flex w-full flex-col items-center gap-5 pt-2">
          <AuthButton
            method="Sign in"
            isDisabled={isFormDisabled}
            onClick={() => {
              setIsEmailWrong(false);
              setIsPasswordWrong(false);
            }}
          />
          <ForgotPasswordButton />
        </div>
        <Divider variant="middle">o</Divider>
        <GoogleAuthShowcase />
        <AlternativeMethodLink method="Sign up" />
      </fieldset>
    </form>
  );
}
