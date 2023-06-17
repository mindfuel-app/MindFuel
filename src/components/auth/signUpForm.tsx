import { type ZodType, z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { Divider } from "@mui/material";
import usePasswordToggle from "~/hooks/usePasswordToggle";
import GoogleAuthShowcase from "./googleAuthShowcase";
import AuthButton from "./authButton";
import { signIn } from "next-auth/react";
import AlternativeMethodLink from "./alternativeMethodLink";
import router from "next/router";
import { useState } from "react";
import Tooltip from "./tooltip";

export default function SignUpForm() {
  const [PasswordInputType, ToggleIcon] = usePasswordToggle();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isEmailWrong, setIsEmailWrong] = useState(false);
  const [isUsernameWrong, setIsUsernameWrong] = useState(false);

  type FormData = {
    name: string;
    email: string;
    password: string;
  };

  const formSchema: ZodType<FormData> = z.object({
    name: z.string().min(3).max(30),
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
    setIsButtonDisabled(true);
    await signIn("credentials", {
      email: data.email,
      password: data.password,
      method: "signup",
      redirect: false,
    }).then((response) => {
      if (response?.error) {
        setIsButtonDisabled(false);
        if (response.error == "Este email ya esta registrado") {
          return setIsEmailWrong(true);
        }
        if (response.error == "Este nombre de usuario ya esta registrado") {
          return setIsUsernameWrong(true);
        }
        return alert(response.error);
      }
      void router.push("/tareas");
    });
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex w-screen justify-end pr-5">
        <Image alt="Logo" src="/favicon.ico" width={75} height={58}></Image>
      </div>
      <div className="py- flex select-none flex-col items-center gap-2 px-5 py-3">
        <h1 className="mb-4 mt-5 text-2xl font-semibold text-[#008080]">
          Registrarse
        </h1>
        <form
          className="flex flex-col justify-center space-y-5 py-3"
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onSubmit={handleSubmit(submitData)}
        >
          <div className="flex flex-col gap-2">
            <label className="flex flex-col">
              <span
                className={`ml-1 flex items-center gap-1 font-medium ${
                  isUsernameWrong ? "text-red-500" : ""
                }`}
                onClick={(e) => e.preventDefault()}
              >
                Nombre de usuario <Tooltip />
              </span>
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  className={`w-full rounded-xl border-2 border-[#008080] px-3 py-1 outline-none focus:border-[3px] ${
                    isUsernameWrong ? "border-red-500" : ""
                  }`}
                  {...register("name")}
                />
                {isUsernameWrong && (
                  <span className="text-xs text-red-500">
                    Ya existe una cuenta con este nombre de usuario
                  </span>
                )}
                {!isUsernameWrong && errors.name && (
                  <span className="text-xs text-red-500">
                    Nombre de usuario: 3-30 caracteres
                  </span>
                )}
              </div>
            </label>
          </div>
          <div className="flex flex-col gap-2">
            <label className="flex flex-col">
              <span
                className={`ml-1 font-medium ${
                  isEmailWrong ? "text-red-500" : ""
                }`}
                onClick={(e) => e.preventDefault()}
              >
                Email
              </span>
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  className={`w-full rounded-xl border-2 border-[#008080] px-3 py-1 outline-none focus:border-[3px] ${
                    isEmailWrong ? "border-red-500" : ""
                  }`}
                  {...register("email")}
                />
                {isEmailWrong && (
                  <span className="text-xs text-red-500">
                    Ya existe una cuenta con este email
                  </span>
                )}
                {!isEmailWrong && errors.email && (
                  <span className="text-xs text-red-500">
                    Ingrese un email valido
                  </span>
                )}
              </div>
            </label>
          </div>
          <div className="flex flex-col gap-2">
            <label className="flex flex-col">
              <span
                className="ml-1 font-medium"
                onClick={(e) => e.preventDefault()}
              >
                Contraseña
              </span>
              <div className="flex w-full items-center justify-between rounded-xl border-2 border-[#008080] bg-white px-3 py-1 focus-within:border-[3px]">
                <input
                  type={PasswordInputType == "text" ? "text" : "password"}
                  className="outline-none"
                  {...register("password")}
                />
                <span>{ToggleIcon}</span>
              </div>
            </label>
            {errors.password && (
              <span className="text-xs text-red-500">
                Contraseña: 6-30 caracteres
              </span>
            )}
          </div>
          <div className="flex w-full flex-col items-center gap-5 pt-3">
            <AuthButton
              method="Sign up"
              isDisabled={isButtonDisabled}
              onClick={() => {
                setIsEmailWrong(false);
                setIsUsernameWrong(false);
              }}
            />
          </div>
          <Divider variant="middle">o</Divider>
          <GoogleAuthShowcase />
          <AlternativeMethodLink method="Sign in" />
        </form>
      </div>
    </div>
  );
}
