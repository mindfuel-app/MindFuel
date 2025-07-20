import ProfileLayout from "./components/profileLayout";
import { motion } from "framer-motion";
import { notFound } from "next/navigation";
import { api } from "~/utils/api";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { useTheme } from "~/contexts/ThemeContext";
import { cn } from "~/lib/utils";
import { TrophyIcon } from "@heroicons/react/24/solid";
import { isString } from "~/lib/checkTypes";
import { TopNavigation } from "~/components/inputs/navigation";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import { JoinedDateSkeleton } from "~/components/ui/skeleton";
import useWindowWidth from "~/hooks/useWindowWidth";
import { StatsSkeleton } from "./components/skeleton";


export default async function Profile({ params }: { params: { name: string } }) {
  const { data: sessionData, status } = useSession();
  const { name } = params;
  const { themeColor } = useTheme();

  const { data: pointsData } = api.points.getPoints.useQuery({
    user_id: sessionData?.user.id ?? "",
  }, {
    enabled: !!sessionData?.user.id,
  });

  const { data: completedTasks } = api.user.getCompletedTasks.useQuery({
    user_id: sessionData?.user.id ?? "",
  }, {
    enabled: !!sessionData?.user.id,
  });

  const { data: joinedDate } = api.user.getJoinedDate.useQuery({
    user_id: sessionData?.user.id ?? "",
  }, {
    enabled: !!sessionData?.user.id,
  });

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!sessionData) {
    return null;
  }

  if (
    !isString(sessionData?.user.name) ||
    !isString(name) ||
    sessionData?.user.name !== name
  ) {
    return notFound();
  }

  return (
    <ProfileLayout
      header={
        <Header
          username={sessionData.user.name}
          points={pointsData?.puntos ?? 0}
          currentLevelBasePoints={pointsData?.currentLevelPoints ?? 0}
        />
      }
      sessionData={sessionData}
    >
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="padding-footer-sm flex h-full w-full flex-col gap-6 bg-white px-10 lg:px-40"
      >
        <div className="flex w-full justify-between flex-col md:flex-row">
          <div className="flex flex-col gap-4 pt-20 md:pt-28">
            <span className="text-3xl font-normal text-gray-800">
              {sessionData.user.name}{" "}
              {pointsData?.levelNumber && (
                <span
                  className={
                    themeColor === "teal" ? "text-teal" : "text-orange-red"
                  }
                >
                  · Nivel {pointsData.levelNumber}
                </span>
              )}
            </span>
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-6 w-6 text-gray-500" />
              {joinedDate ? (
                <span className="mt-[2px] text-gray-500">
                  Se unio en {joinedDate?.month} de {joinedDate?.year}
                </span>
              ) : (
                <JoinedDateSkeleton />
              )}
            </div>
          </div>
          <div className="flex flex-col justify-end gap-8 pt-7">
            {completedTasks !== undefined && pointsData ? (
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex flex-col gap-1 rounded-lg p-4",
                    themeColor === "teal"
                      ? "bg-teal/10 text-teal"
                      : "bg-orange-red/10 text-orange-red"
                  )}
                >
                  <span className="text-2xl font-medium">
                    {completedTasks}
                  </span>
                  <span className="text-sm">Tareas completadas</span>
                </div>
                <div className="flex flex-col gap-1 rounded-lg bg-orange/10 p-4 text-orange">
                  <p className="text-2xl font-medium">
                    {pointsData.puntos}
                    <span className="text-xs font-normal">
                      /{pointsData.nextLevelPoints}
                    </span>
                  </p>
                  <span className="text-sm">Puntos obtenidos</span>
                </div>
              </div>
            ) : (
              <StatsSkeleton themeColor={themeColor} />
            )}

          </div>
        </div>
        <div className="w-full border border-gray-200" />
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <h3 className="ml-1 text-lg font-medium text-gray-800">Logros</h3>
            <TrophyIcon className="h-5 w-5 text-[#d4af37]" />
          </div>
          <div className="max-w-lg rounded-xl bg-gray-200 p-4">
            Todavía no hay nada aquí
          </div>
        </div>
      </motion.div>
    </ProfileLayout >
  );
}

function Header({
  username,
  points,
  currentLevelBasePoints,
}: {
  username: string;
  points: number;
  currentLevelBasePoints: number;
}) {
  const { themeColor } = useTheme();
  const [progress, setProgress] = useState(0);
  const windowWidth = useWindowWidth();
  const levelPoints = points - currentLevelBasePoints;

  useEffect(() => {
    if (progress >= levelPoints) return;

    const addProgress = levelPoints - progress > 100 ? 100 : 10;

    const interval = setInterval(() => {
      setProgress((progress) => Math.round((progress + addProgress) / 10) * 10);
    }, 10);

    return () => clearInterval(interval);
  }, [levelPoints, progress]);

  return (
    <header
      className={cn(
        "relative h-[150px] md:h-[250px] bg-gradient-to-r pt-3",
        themeColor === "teal"
          ? "from-teal to-green-700"
          : "from-orange-red to-[#FF7373]"
      )}
    >
      {windowWidth > 1024 && <TopNavigation />}
      <div className="hidden w-full justify-between px-8 min-[200px]:flex xl:pr-10 ">
        <Image
          alt="Logo"
          src="/transparent-icon.png"
          width={75}
          height={75}
          priority={true}
        />
        <Link
          className="no-highlight mt-3 h-10"
          href={`/${username}/configuracion`}
        >
          <Button className="border">Configuración</Button>
        </Link>
      </div>
      <div
        className={cn(
          "absolute -bottom-[60px] left-1/2 z-10 flex h-[100px] w-[100px] md:h-[130px] md:w-[130px] items-center justify-center rounded-full border-[4px] bg-white text-6xl md:text-7xl shadow-xl",
          "transform -translate-x-1/2 md:left-[150px] md:translate-x-0",
          themeColor === "teal"
            ? "border-teal/90 text-teal/90"
            : "border-orange-red text-orange-red"
        )}
      >
        {username[0]?.toUpperCase()}
      </div>
    </header>
  );
}