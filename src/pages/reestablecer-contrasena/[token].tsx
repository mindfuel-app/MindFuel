import { type ZodType, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import AuthButton from "~/components/auth/authButton";
import { MdArrowBackIosNew } from "react-icons/md";
import Link from "next/link";
import Head from "next/head";
import Logo from "~/components/auth/logo";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";
import Title from "~/components/auth/title";
import usePasswordToggle from "~/hooks/usePasswordToggle";

export default function ReestablecerContraseña() {
  const router = useRouter();
  const { token } = router.query;
  const { data: userEmail } = api.resetPwd.getEmailByToken.useQuery(
    { token: token as string },
    { enabled: token !== undefined }
  );
  const { mutate: resetPassword } = api.resetPwd.resetPwd.useMutation();
  const { mutate: deleteToken } =
    api.resetPwd.deletePwdResetToken.useMutation();
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const [isPasswordMatch, setIsPasswordMatch] = useState(true);
  const [PasswordInputType, ToggleIcon] = usePasswordToggle();
  const [ConfirmPasswordInputType, ToggleIcon2] = usePasswordToggle(
    !isPasswordMatch
  );

  type FormData = {
    password: string;
    confirmPassword: string;
  };

  const formSchema: ZodType<FormData> = z
    .object({
      password: z.string().min(6).max(30),
      confirmPassword: z.string().min(6).max(30),
    })
    .superRefine(({ password, confirmPassword }, ctx) => {
      if (
        password != confirmPassword &&
        password.length >= 6 &&
        password.length <= 30 &&
        confirmPassword.length >= 6 &&
        confirmPassword.length <= 30
      ) {
        ctx.addIssue({
          code: "custom",
          message: "Las contraseñas no coinciden",
        });
        return setIsPasswordMatch(false);
      }
      setIsPasswordMatch(true);
    });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const notify = () =>
    toast.success("Se reestablecio la contraseña correctamente");

  const submitData = (data: FormData) => {
    setIsFormDisabled(true);
    if (!userEmail) {
      toast.error("El token no es valido");
      return setIsFormDisabled(false);
    }
    resetPassword(
      { email: userEmail, password: data.password },
      {
        onSuccess: () => {
          setIsFormDisabled(false);
          deleteToken({ token: token as string });
          return void notify();
        },
        onError: (error) => {
          setIsFormDisabled(false);
          return alert(error);
        },
      }
    );
  };

  return (
    <>
      <Head>
        <title>Reestablecer contraseña</title>
      </Head>
      <div className="flex bg-teal">
        <div className="h-screen w-0 min-[1440px]:w-1/6"></div>
        <main className="flex min-h-screen w-full flex-col bg-alabaster py-10 min-[1440px]:shadow-2xl">
          <div className="flex flex-col items-center">
            <div className="flex w-full items-center justify-between pl-5 lg:justify-end">
              <Link
                href="/signin"
                className="no-highlight ml-3 rounded-lg p-1 text-2xl active:bg-gray-300 lg:hidden"
              >
                <MdArrowBackIosNew />
              </Link>
              <Logo />
            </div>
            <div className="flex flex-col items-center p-5">
              <Title title="Reestablecer contraseña" />
              <form
                className="w-full"
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onSubmit={handleSubmit(submitData)}
              >
                <fieldset
                  disabled={isFormDisabled}
                  className="group flex w-full flex-col justify-center space-y-7 py-5 lg:py-12"
                >
                  <div className="flex flex-col gap-2 group-disabled:opacity-50">
                    <label className="flex flex-col group-disabled:cursor-not-allowed">
                      <span
                        className="ml-1 font-medium"
                        onClick={(e) => e.preventDefault()}
                      >
                        Nueva contraseña
                      </span>
                      <div className="flex w-full items-center justify-between rounded-xl border-2 border-teal bg-white px-3 py-1">
                        <input
                          type={
                            PasswordInputType == "text" ? "text" : "password"
                          }
                          className="w-full outline-none group-disabled:cursor-not-allowed"
                          {...register("password")}
                        />
                        <span>{ToggleIcon}</span>
                      </div>
                      {errors.password && (
                        <span className="absolute mt-16 text-xs text-red-500">
                          Contraseña: 6-30 caracteres
                        </span>
                      )}
                    </label>
                  </div>
                  <div className="flex flex-col gap-2 group-disabled:opacity-50">
                    <label className="flex flex-col group-disabled:cursor-not-allowed">
                      <span
                        className={`ml-1 font-medium ${
                          !isPasswordMatch ? "text-red-500" : ""
                        }`}
                        onClick={(e) => e.preventDefault()}
                      >
                        Confirmar contraseña
                      </span>
                      <div
                        className={`flex w-full items-center justify-between rounded-xl border-2 border-teal bg-white px-3 py-1 ${
                          !isPasswordMatch ? "border-red-500" : ""
                        }`}
                      >
                        <input
                          type={
                            ConfirmPasswordInputType == "text"
                              ? "text"
                              : "password"
                          }
                          className="w-full outline-none group-disabled:cursor-not-allowed"
                          {...register("confirmPassword")}
                        />
                        <span>{ToggleIcon2}</span>
                      </div>
                      {!isPasswordMatch && (
                        <span className="absolute mt-16 text-xs text-red-500">
                          Las contraseñas no coinciden
                        </span>
                      )}
                    </label>
                  </div>
                  <div className="flex w-full flex-col items-center gap-5 sm:pt-2">
                    <AuthButton
                      method="Reset password"
                      isDisabled={isFormDisabled}
                      onClick={() => {
                        setIsPasswordMatch(true);
                      }}
                    />
                    <span className="mt-3 font-medium sm:text-lg">
                      Volver a{" "}
                      <Link
                        href="/signin"
                        className="no-highlight text-sky-600 underline-offset-2 active:underline"
                      >
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
        <div className="h-screen w-0 min-[1440px]:w-1/6"></div>
      </div>
    </>
  );
}
