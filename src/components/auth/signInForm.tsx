import { type ZodType, z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { Divider } from "@mui/material";
import usePasswordToggle from "~/hooks/usePasswordToggle";
import GoogleAuthShowcase from "./googleAuthShowcase";
import { signIn } from "next-auth/react";
import AuthButton from "./authButton";
import AlternativeMethodLink from "./alternativeMethodLink";
import ForgotPasswordButton from "./forgotPasswordButton";

export default function SignInForm() {
  const [PasswordInputType, ToggleIcon] = usePasswordToggle();

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
    await signIn("credentials", {
      email: data.email,
      password: data.password,
      callbackUrl: "/tareas",
      redirect: false,
    }).then((response) => {
      console.log(response);
      if (response?.error) {
        alert(response.error);
      }
      if(response?.ok){
        window.location.href = "/tareas";
      }
      else  {
        alert("Algo salio mal");
      }
    });
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex w-screen justify-end pr-5">
        <Image alt="Logo" src="/favicon.ico" width={75} height={58}></Image>
      </div>
      <h1 className="mb-4 mt-5 text-2xl font-semibold text-[#008080]">
        Inicio sesión
      </h1>
      <div className="flex flex-col gap-2 p-4">
        <form
          className="flex flex-col justify-center space-y-5"
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onSubmit={handleSubmit(submitData)}
        >
          <div className="flex flex-col gap-2">
            <label className="flex flex-col">
              <span className="ml-1">Email</span>
              <input
                type="email"
                className="w-full rounded-xl border-2 border-gray-300 px-3 py-1 focus:outline-sky-500"
                {...register("email")}
              />
            </label>

            {errors.email?.type == "invalid_string" && (
              <span className="text-xs text-red-500">
                Ingrese un email valido
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label className="flex flex-col">
              <span>Contraseña</span>
              <div className="flex w-full items-center justify-between rounded-xl border-2 border-gray-300 bg-white px-3 py-1 focus-within:border-sky-500">
                <input
                  type={PasswordInputType == "text" ? "text" : "password"}
                  className="outline-none"
                  {...register("password")}
                />
                <span className="text-gray-500">{ToggleIcon}</span>
              </div>
            </label>

            {errors.password?.type == "min" ||
              (errors.password?.type && (
                <span className="text-xs text-red-500">
                  La contraseña debe tener entre 6 y 30 caracteres
                </span>
              ))}
          </div>
          <div className="flex w-full flex-col items-center gap-5 pt-3">
            <AuthButton method="Sign in" />
            <ForgotPasswordButton />
          </div>

          <Divider variant="middle">o</Divider>
          <GoogleAuthShowcase />
          <AlternativeMethodLink method="Sign up" />
        </form>
      </div>
    </div>
  );
}
