import { type ZodType, z } from "zod";
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

export default function SignInForm() {
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isPasswordWrong, setIsPasswordWrong] = useState(false);
  const [isEmailWrong, setIsEmailWrong] = useState(false);
  const [isGoogleAccount, setIsGoogleAccount] = useState(false);
  const [PasswordInputType, ToggleIcon] = usePasswordToggle(isPasswordWrong);

  type FormData = {
    email: string;
    password: string;
  };

  const formSchema: ZodType<FormData> = z.object({
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
      redirect: false,
    }).then((response) => {
      if (response?.error) {
        setIsButtonDisabled(false);
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

      void router.push("/tareas");
    });
  };

  return (
    <form
      className="flex flex-col justify-center space-y-5 py-3 sm:py-10"
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onSubmit={handleSubmit(submitData)}
    >
      <div className="flex flex-col gap-2">
        <label className="flex flex-col">
          <span
            className={`ml-1 font-medium ${isEmailWrong ? "text-red-500" : ""}`}
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
                No existe una cuenta con este email
              </span>
            )}
            {isGoogleAccount && (
              <span className="text-xs text-red-500">
                Esta cuenta esta registrada con Google
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
            className={`ml-1 font-medium ${
              isPasswordWrong ? "text-red-500" : ""
            }`}
            onClick={(e) => e.preventDefault()}
          >
            Contraseña
          </span>
          <div
            className={`flex w-full items-center justify-between rounded-xl border-2 border-[#008080] bg-white px-3 py-1 focus-within:border-[3px] ${
              isPasswordWrong ? "border-red-500" : ""
            }`}
          >
            <input
              type={PasswordInputType == "text" ? "text" : "password"}
              className="outline-none"
              {...register("password")}
            />
            <span>{ToggleIcon}</span>
          </div>
        </label>
        {isPasswordWrong && (
          <span className="text-xs text-red-500">Contraseña incorrecta</span>
        )}
        {!isPasswordWrong && errors.password && (
          <span className="text-xs text-red-500">
            Contraseña: 6-30 caracteres
          </span>
        )}
      </div>
      <div className="flex w-full flex-col items-center gap-5 pt-3">
        <AuthButton
          method="Sign in"
          isDisabled={isButtonDisabled}
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
    </form>
  );
}
