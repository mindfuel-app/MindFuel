import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Divider } from "@mui/material";
import usePasswordToggle from "~/hooks/usePasswordToggle";
import GoogleAuthShowcase from "./googleAuthShowcase";
import AuthButton from "./authButton";
import { signIn } from "next-auth/react";
import AlternativeMethodLink from "./alternativeMethodLink";
import router from "next/router";
import { useState } from "react";
import Tooltip from "./tooltip";
import { BsQuestionCircleFill } from "react-icons/bs";
import { cn } from "~/lib/utils";

export default function SignUpForm() {
  const [PasswordInputType, ToggleIcon] = usePasswordToggle();
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const [isEmailWrong, setIsEmailWrong] = useState(false);
  const [isUsernameWrong, setIsUsernameWrong] = useState(false);

  type FormData = {
    name: string;
    email: string;
    password: string;
  };

  const formSchema = z.object({
    name: z.string().min(3).max(20),
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
      name: data.name,
      email: data.email,
      password: data.password,
      method: "signup",
      redirect: false,
    }).then((response) => {
      if (response?.error) {
        setIsFormDisabled(false);
        if (response.error == "Este email ya esta registrado") {
          return setIsEmailWrong(true);
        }
        if (response.error == "Este nombre de usuario ya esta registrado") {
          return setIsUsernameWrong(true);
        }
        return alert(response.error);
      }
      void router.push("/home");
    });
  };

  return (
    <form
      className="w-full max-w-md py-2 sm:py-6"
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
              className={cn(
                "ml-1 flex items-center gap-1 font-medium",
                isUsernameWrong && "text-red-500"
              )}
              onClick={(e) => e.preventDefault()}
            >
              Nombre de usuario{" "}
              <Tooltip
                information="Tu nombre de usuario te identifica y es el que veran tus amigos en la app"
                element={<BsQuestionCircleFill />}
              />
            </span>
            <input
              type="text"
              className={cn(
                "w-full rounded-2xl border border-gray-300 bg-white px-4 py-2.5 outline-none transition group-disabled:cursor-not-allowed focus:border-cornflower-blue",
                isUsernameWrong && "border-red-500"
              )}
              {...register("name")}
            />
            {isUsernameWrong && (
              <span className="mt-1 block text-xs text-red-500">
                Ya existe una cuenta con este nombre de usuario
              </span>
            )}
            {!isUsernameWrong && errors.name && (
              <span className="mt-1 block text-xs text-red-500">
                Nombre de usuario: 3-20 caracteres
              </span>
            )}
          </label>
        </div>
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
                "w-full rounded-2xl border border-gray-300 bg-white px-4 py-2.5 outline-none transition group-disabled:cursor-not-allowed focus:border-cornflower-blue",
                isEmailWrong && "border-red-500"
              )}
              {...register("email")}
            />
            {isEmailWrong && (
              <span className="mt-1 block text-xs text-red-500">
                Ya existe una cuenta con este email
              </span>
            )}
            {!isEmailWrong && errors.email && (
              <span className="mt-1 block text-xs text-red-500">
                Ingrese un email valido
              </span>
            )}
          </label>
        </div>
        <div className="flex flex-col gap-2 group-disabled:opacity-50">
          <label className="flex flex-col group-disabled:cursor-not-allowed">
            <span
              className="ml-1 font-medium"
              onClick={(e) => e.preventDefault()}
            >
              Contraseña
            </span>
            <div className="flex w-full items-center justify-between rounded-2xl border border-gray-300 bg-white px-4 py-2.5 transition focus-within:border-cornflower-blue">
              <input
                type={PasswordInputType == "text" ? "text" : "password"}
                className="w-full outline-none group-disabled:cursor-not-allowed"
                {...register("password")}
              />
              <span>{ToggleIcon}</span>
            </div>
          </label>
          {errors.password && (
            <span className="mt-1 block text-xs text-red-500">
              Contraseña: 6-30 caracteres
            </span>
          )}
        </div>
        <div className="flex w-full flex-col items-center gap-5 pt-2">
          <AuthButton
            method="Sign up"
            isDisabled={isFormDisabled}
            onClick={() => {
              setIsEmailWrong(false);
              setIsUsernameWrong(false);
            }}
          />
        </div>
        <Divider variant="middle">o</Divider>
        <GoogleAuthShowcase />
        <AlternativeMethodLink method="Sign in" />
      </fieldset>
    </form>
  );
}
