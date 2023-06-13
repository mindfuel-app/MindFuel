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

export default function SignUpForm() {
  const [PasswordInputType, ToggleIcon] = usePasswordToggle();

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

  const submitData = (data: FormData) => {
    void signIn("credentials", {
      name: data.name,
      email: data.email,
      password: data.password,
      method: "signUp",
      redirect: false,
    }).then((response) => {
      console.log(response);
      if (response?.error) {
        alert(response.error);
      }
      if (response?.ok) {
        window.location.href = "/tareas";
      }
      else  {
        alert("Algo salio mal");
      }
    });
  };

  return (
    <div className="flex flex-col items-center py-20">
      <Image alt="Logo" src="/favicon.ico" width={75} height={58}></Image>
      <h1 className="mb-4 mt-10 text-2xl font-semibold">
        Regístrese en MindFuel
      </h1>
      <div className="flex flex-col gap-2 rounded-2xl bg-white p-4 shadow-md">
        <GoogleAuthShowcase />
        <Divider variant="middle">o</Divider>
        <form
          className="flex flex-col justify-center space-y-5"
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onSubmit={handleSubmit(submitData)}
        >
          <div className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="Nombre de usuario"
              className="w-full rounded-xl border-2 border-gray-300 px-3 py-1 focus:outline-sky-500"
              {...register("name")}
            />
            {errors.name && (
              <span className="text-xs text-red-500">
                Nombre de usuario: 3-30 caracteres
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <input
              type="email"
              placeholder="Email"
              className="w-full rounded-xl border-2 border-gray-300 px-3 py-1 focus:outline-sky-500"
              {...register("email")}
            />
            {errors.email?.type == "invalid_string" && (
              <span className="text-xs text-red-500">
                Ingrese un email valido
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex w-full items-center justify-between rounded-xl border-2 border-gray-300 px-3 py-1 focus-within:border-sky-500">
              <input
                type={PasswordInputType == "text" ? "text" : "password"}
                placeholder="Contraseña"
                className="outline-none"
                {...register("password")}
              />
              <span className="text-gray-500">{ToggleIcon}</span>
            </div>
            {errors.password && (
              <span className="text-xs text-red-500">
                Contraseña: 6-30 caracteres
              </span>
            )}
          </div>
          <AuthButton method="Sign up" />
          <AlternativeMethodLink method="Sign in" />
        </form>
      </div>
    </div>
  );
}
