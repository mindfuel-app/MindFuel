import { PencilIcon } from "@heroicons/react/24/solid";
import BackButton from "~/components/backButton";
import ProfileLayout from "~/components/layouts/profileLayout";
import type { GetServerSideProps } from "next";
import type { Session } from "next-auth";
import { getSession } from "next-auth/react";
import NotFoundPage from "../404";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  type SetThemeColor,
  type ThemeColor,
  useTheme,
} from "~/lib/ThemeContext";
import { cn } from "~/lib/utils";

interface PageProps {
  sessionData: Session;
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  context
) => {
  const sessionData = await getSession(context);

  if (!sessionData) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  }

  return {
    props: {
      sessionData,
    },
  };
};

export default function Configuracion({ sessionData }: PageProps) {
  const { themeColor, setThemeColor } = useTheme();

  if (!sessionData.user.name) return <NotFoundPage />;

  return (
    <ProfileLayout
      header={
        <Header themeColor={themeColor} userName={sessionData.user.name} />
      }
      sessionData={sessionData}
    >
      <div className="flex w-full flex-col items-center gap-3 pt-7">
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
          <span
            className={cn(
              "relative text-2xl transition-colors",
              themeColor == "teal" ? "text-teal" : "text-orange-red"
            )}
          >
            {sessionData.user.name}
            <PencilIcon className="absolute -right-8 bottom-1 h-6 w-6 text-orange" />
          </span>
        </div>
      </div>
      <div className="flex flex-col items-center gap-6 py-10">
        <span className="text-xl font-medium">Tu tema</span>
        <ThemeToggleButton
          themeColor={themeColor}
          setThemeColor={setThemeColor}
        />
      </div>
    </ProfileLayout>
  );
}

function ThemeToggleButton({
  themeColor,
  setThemeColor,
}: {
  themeColor: ThemeColor;
  setThemeColor: SetThemeColor;
}) {
  const [isToggled, setIsToggled] = useState(false);

  return (
    <div className="flex items-center justify-center gap-3">
      <span className="text-xl font-medium text-teal">Teal</span>
      <button
        onClick={() => {
          setIsToggled(!isToggled);
          setThemeColor();
        }}
        className={cn(
          "no-highlight flex w-20 items-center rounded-full p-2 py-1.5 transition-colors",
          themeColor == "teal" ? "bg-teal/90" : "bg-orange-red/90"
        )}
      >
        <motion.div
          animate={{ x: isToggled ? "130%" : "0%" }}
          className="h-7 w-7 rounded-full bg-white"
        />
      </button>
      <span className="text-xl font-medium text-orange-red">Orange-red</span>
    </div>
  );
}

function Header({
  userName,
  themeColor,
}: {
  userName: string;
  themeColor: ThemeColor;
}) {
  return (
    <div
      className={cn(
        "relative flex w-full items-center justify-start px-4 py-3 transition-colors",
        themeColor == "teal" ? "bg-teal" : "bg-orange-red"
      )}
    >
      <BackButton href={`/${userName}`} color="white" />
      <h1 className="absolute left-1/2 -translate-x-1/2 text-xl font-medium text-white">
        Configuración
      </h1>
    </div>
  );
}
