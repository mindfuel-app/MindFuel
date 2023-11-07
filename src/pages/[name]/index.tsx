import { useRouter } from "next/router";
import ProfileLayout from "~/components/layouts/profileLayout";
import { motion } from "framer-motion";
import NotFoundPage from "~/pages/404";
import { api } from "~/utils/api";
import { ProgressLevel } from "~/components/ui/progressBar";
import { useEffect, useState } from "react";
import type { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import type { Session } from "next-auth";
import Link from "next/link";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { type ThemeColor, useTheme } from "~/lib/ThemeContext";
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

export default function Profile({ sessionData }: PageProps) {
  const router = useRouter();
  const { name } = router.query;
  const { data: pointsData } = api.points.getPoints.useQuery({
    user_id: sessionData.user.id,
  });
  const { themeColor } = useTheme();

  if (sessionData.user.name !== name) return <NotFoundPage />;

  return (
    <>
      {name && (
        <ProfileLayout
          header={
            <Header
              level={pointsData?.levelNumber ?? 0}
              userPoints={pointsData?.puntos ?? 0}
              currentLevelPoints={pointsData?.currentLevelPoints ?? 0}
              nextLevelPoints={
                pointsData?.nextLevelPoints ?? pointsData?.puntos ?? 0
              }
              themeColor={themeColor}
            />
          }
          sessionData={sessionData}
        >
          <div className="relative flex w-full items-center py-3">
            <div
              className={`absolute left-0 top-0 h-1/2 w-full bg-${themeColor}/90`}
            />
            <div
              className={`relative z-10 ml-6 flex h-[100px] w-[100px] items-center justify-center rounded-full border-[3px] border-${themeColor} bg-[#d9d9d9]`}
            >
              <span className={`text-6xl text-${themeColor}`}>
                {name[0]?.toLocaleUpperCase()}
              </span>
              <span className="absolute -right-40 top-[8px] text-2xl text-white">
                {name}
                <div className="absolute -right-12 top-0">
                  {sessionData.user.name && (
                    <ConfigurationButton userName={sessionData.user.name} />
                  )}
                </div>
              </span>
            </div>
          </div>
          <div className="padding-footer-sm flex w-full flex-col items-center gap-4 px-6 pt-2">
            {/* <Section title="Estadísticas">
          <div className="grid grid-cols-2 gap-6">
            {userStats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center text-center"
              >
                {stat.icon}
                <span className="text-lg font-medium text-orange">
                  {stat.number}
                </span>
                <span className="-mt-2 text-lg font-medium">
                  {stat.label.split(" ")[0]}
                </span>
                {stat.label.split(" ").length > 1 && (
                  <span className="-mt-2 font-medium">
                    {stat.label.split(" ")[1]}
                  </span>
                )}
              </div>
            ))}
          </div>
        </Section> */}
            <Section title="Logros">Logros</Section>
            <Section title="Resumen semanal">Resumen semanal</Section>
          </div>
        </ProfileLayout>
      )}
    </>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex w-full max-w-lg flex-col gap-1"
    >
      <h3 className="ml-1 text-lg font-medium">{title}</h3>
      <div className="rounded-xl bg-[#d9d9d9] p-4">{children}</div>
    </motion.div>
  );
}

function Header({
  level,
  userPoints,
  currentLevelPoints,
  nextLevelPoints,
  themeColor,
}: {
  level: number;
  userPoints: number;
  currentLevelPoints: number;
  nextLevelPoints: number;
  themeColor: ThemeColor;
}) {
  const levelPoints = userPoints - currentLevelPoints;
  const targetPoints = nextLevelPoints - currentLevelPoints;

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (progress >= levelPoints) return;

    const addProgress = levelPoints - progress > 100 ? 100 : 10;

    const interval = setInterval(() => {
      setProgress((progress) => Math.round((progress + addProgress) / 10) * 10);
    }, 10);

    return () => clearInterval(interval);
  }, [levelPoints, progress]);

  return (
    <div
      className={`flex w-full items-center justify-between bg-${themeColor}/90 px-3 pb-2 pt-3`}
    >
      <div className="flex w-full items-center gap-3">
        <div
          className={cn(
            "flex h-10 w-12 items-center justify-center rounded-full text-lg text-white",
            themeColor == "teal" ? "bg-[#52c4c4]" : "bg-orange-red"
          )}
        >
          <span className="text-2xl">{level}</span>
        </div>
        <div className="flex w-full flex-col">
          <span className="text-white">Tu nivel</span>
          <div className="flex max-w-[400px] items-center gap-2">
            <ProgressLevel
              value={
                ((progress >= 0 ? progress : levelPoints) / targetPoints) * 100
              }
              color="black"
              className="h-3 bg-white"
            />
            <span className="text-white">
              {userPoints}/{nextLevelPoints}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConfigurationButton({ userName }: { userName: string }) {
  return (
    <Link
      href={`/${userName}/configuracion`}
      className="no-highlight flex w-8 rounded-md bg-orange p-1"
    >
      <Cog6ToothIcon className="h-6 w-6 text-white" />
    </Link>
  );
}
