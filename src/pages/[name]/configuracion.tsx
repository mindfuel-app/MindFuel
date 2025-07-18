import { PencilIcon } from "@heroicons/react/24/solid";
import ProfileLayout from "~/components/layouts/profileLayout";
import { useSession } from "next-auth/react";
import NotFoundPage from "../404";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "~/lib/ThemeContext";
import { cn } from "~/lib/utils";
import { CheckIcon } from "@heroicons/react/24/outline";
import { api } from "~/utils/api";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";
import Header from "./components/header";
import ThemeToggleButton from "./components/themeToggleButton";
import SelfCareToggleList from "./components/self-care-toggle";

export default function Configuracion() {
  const { data: sessionData, update: updateSessionData, status } = useSession();
  const router = useRouter();
  const { themeColor } = useTheme();
  const { mutate: updateUsername } = api.user.editUsername.useMutation({
    onSuccess: async () => {
      await updateSessionData({ name: username });
      toast.success("Nombre de usuario actualizado");
    },
    onError: (error) => {
      setUsername(sessionData?.user.name as string);
      toast.error(
        error.message == "Username already exists"
          ? "El nombre de usuario ya existe"
          : "Error al actualizar el nombre de usuario"
      );
    },
  });
  const [username, setUsername] = useState(sessionData?.user.name as string);
  const [editUsername, setEditUsername] = useState(false);
  const [usernameWidth, setUsernameWidth] = useState(0);
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (elementRef.current) {
      setUsernameWidth(elementRef.current.offsetWidth);
    }
  }, [elementRef.current?.offsetWidth]);

  if (status == "unauthenticated") return void router.push("/signin");

  if (!sessionData?.user.name) return <NotFoundPage />;

  function submitData(userId: string, value: string) {
    if (value.length < 3 || value.length > 20)
      return toast.error(
        "El nombre de usuario debe tener entre 3 y 20 caracteres"
      );
    if (value == sessionData?.user.name) return setEditUsername(false);

    updateUsername({
      user_id: userId,
      username: value,
    });
    setEditUsername(false);
  }

  return (
    <ProfileLayout
      header={
        <Header themeColor={themeColor} userName={sessionData.user.name} />
      }
      sessionData={sessionData}
    >
      <div className="flex w-full flex-col items-center gap-4 pt-7">
        <div
          className={cn(
            "flex h-[100px] w-[100px] items-center justify-center rounded-full border-[3px] bg-[#d9d9d9] transition-colors",
            themeColor == "teal" ? "border-teal" : "border-orange-red"
          )}
        >
          <span
            className={cn(
              "text-6xl transition-colors",
              themeColor == "teal" ? "text-teal" : "text-orange-red"
            )}
          >
            {sessionData.user.name[0]?.toLocaleUpperCase()}
          </span>
        </div>
        <div className="flex w-full items-center justify-center">
          {editUsername ? (
            <div className="ml-[36px] flex items-center gap-2">
              <input
                type="text"
                defaultValue={username}
                onKeyDown={(e) => {
                  if (e.key == "Enter")
                    submitData(sessionData.user.id, username);
                }}
                onChange={(e) => setUsername(e.target.value)}
                className={cn(
                  "rounded-md border px-1 text-2xl outline-none",
                  themeColor == "teal"
                    ? "border-teal text-teal"
                    : "border-orange-red text-orange-red"
                )}
                style={{ width: `${usernameWidth + 10}px` }}
              />
              <button
                className="no-highlight active:scale-95"
                onClick={() => submitData(sessionData.user.id, username)}
              >
                <CheckIcon
                  className={cn(
                    "h-7 w-7",
                    themeColor == "teal" ? "text-teal" : "text-orange-red"
                  )}
                />
              </button>
            </div>
          ) : (
            <span
              ref={elementRef}
              className={cn(
                "relative cursor-pointer text-2xl transition-colors",
                themeColor == "teal" ? "text-teal" : "text-orange-red"
              )}
            >
              {username}
              <PencilIcon
                onClick={() => setEditUsername(true)}
                className="absolute -right-8 bottom-1 h-6 w-6 text-orange"
              />
            </span>
          )}
        </div>
        <Toaster />
      </div>
      <div className="flex flex-col w-full p-7 gap-4 ">
        <div>
          <span className="mb-2 text-xl font-medium">Tu tema</span>
          <ThemeToggleButton />
        </div>
        <div>
          <span className="mb-2 text-xl  font-medium">Tu Self Care</span>
          <SelfCareToggleList />
        </div>
      </div>
    </ProfileLayout>
  );
}
