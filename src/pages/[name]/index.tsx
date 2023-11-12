import { useRouter } from "next/router";
import ProfileLayout from "~/components/layouts/profileLayout";
import { motion } from "framer-motion";
import NotFoundPage from "~/pages/404";
import { api } from "~/utils/api";
import { ProgressLevel } from "~/components/ui/progressBar";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { useTheme } from "~/lib/ThemeContext";
import { cn } from "~/lib/utils";
import { TrophyIcon } from "@heroicons/react/24/solid";
import { isString } from "~/lib/checkTypes";

export default function Profile() {
  const router = useRouter();
  const { data: sessionData, status } = useSession();
  const { name } = router.query;
  const { data: pointsData } = api.points.getPoints.useQuery({
    user_id: sessionData?.user.id ?? "",
  });

  if (status == "unauthenticated") return void router.push("/signin");

  if (!sessionData) return;

  if (
    !isString(sessionData?.user.name) ||
    !isString(name) ||
    sessionData?.user.name != name
  )
    return <NotFoundPage />;

  return (
    <>
      <ProfileLayout
        header={
          <Header
            username={sessionData.user.name}
            level={pointsData?.levelNumber ?? 0}
            points={pointsData?.puntos ?? 0}
            currentLevelBasePoints={pointsData?.currentLevelPoints ?? 0}
            nextLevelPoints={
              pointsData?.nextLevelPoints ?? pointsData?.puntos ?? 0
            }
          />
        }
        sessionData={sessionData}
      >
        <div className="padding-footer-sm flex w-full flex-col items-center gap-4 px-6 pt-20">
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex w-full max-w-lg flex-col gap-1"
          >
            <div className="flex items-center gap-2">
              <h3 className="ml-1 text-lg font-medium">Logros</h3>
              <TrophyIcon className="h-5 w-5 text-[#d4af37]" />
            </div>
            <div className="rounded-xl bg-[#d9d9d9] p-4">
              Todavía no hay nada aquí
            </div>
          </motion.div>
        </div>
      </ProfileLayout>
    </>
  );
}

function Header({
  username,
  level,
  points,
  currentLevelBasePoints,
  nextLevelPoints,
}: {
  username: string;
  level: number;
  points: number;
  currentLevelBasePoints: number;
  nextLevelPoints: number;
}) {
  const { themeColor } = useTheme();
  const [progress, setProgress] = useState(0);

  const levelPoints = points - currentLevelBasePoints;
  const targetPoints = nextLevelPoints - currentLevelBasePoints;

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
        "text-white",
        themeColor == "teal" ? "bg-teal/90" : "bg-orange-red"
      )}
    >
      <div className="flex items-center gap-3 px-3 pb-2 pt-3">
        <div
          className={cn(
            "flex h-10 w-12 items-center justify-center rounded-full text-lg",
            themeColor == "teal" ? "bg-[#52c4c4]" : "bg-[#FF8F8F]"
          )}
        >
          <span className="text-2xl">{level}</span>
        </div>
        <div className="flex w-full flex-col">
          Tu nivel
          <div className="flex max-w-[400px] items-center gap-2">
            <ProgressLevel
              value={
                ((progress >= 0 ? progress : levelPoints) / targetPoints) * 100
              }
              color={themeColor == "teal" ? "#52c4c4" : "#FF8F8F"}
              className="h-3 bg-white"
            />
            <span className="text-white">
              {points}/{nextLevelPoints}
            </span>
          </div>
        </div>
      </div>
      <div className="relative flex flex-wrap items-center gap-3 pb-2 pl-[135px] pt-6">
        <div
          className={cn(
            "absolute left-5 top-3 flex h-[100px] w-[100px] items-center justify-center rounded-full border-[3px] bg-[#d9d9d9] text-6xl",
            themeColor == "teal"
              ? "border-teal/90 text-teal/90"
              : "border-orange-red text-orange-red"
          )}
        >
          {username[0]?.toUpperCase()}
        </div>
        <span
          className={
            username.length >= 13 ? "text-xl min-[375px]:text-2xl" : "text-2xl"
          }
        >
          {username}
        </span>
        <ConfigurationButton userName={username} />
      </div>
    </header>
  );
}

function ConfigurationButton({ userName }: { userName: string }) {
  return (
    <Link
      href={`/${userName}/configuracion`}
      className="no-highlight flex h-8 w-8 rounded-md bg-orange p-1"
    >
      <Cog6ToothIcon className="h-6 w-6 text-white" />
    </Link>
  );
}
