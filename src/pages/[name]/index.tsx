import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import ProfileLayout from "~/components/layouts/profileLayout";
import { motion } from "framer-motion";
import NotFoundPage from "~/pages/404";
import { api } from "~/utils/api";
import { Progress } from "~/components/ui/progressBar";
import { useEffect, useState } from "react";

// const userStats = [
//   {
//     icon: <UserGroupIcon className="h-9 w-9" />,
//     number: 7,
//     label: "Amigos",
//   },
//   {
//     icon: <StarIcon className="h-9 w-9" />,
//     number: 575,
//     label: "Puntos",
//   },
//   {
//     icon: <TrophyIcon className="h-9 w-9" />,
//     number: 3,
//     label: "Logros",
//   },
//   {
//     icon: <DocumentCheckIcon className="h-9 w-9" />,
//     number: 90,
//     label: "Tareas realizadas",
//   },
//   {
//     icon: <FaceSmileIcon className="h-9 w-9" />,
//     number: 20,
//     label: "Reacciones recibidas",
//   },
//   {
//     icon: <ClipboardDocumentCheckIcon className="h-9 w-9" />,
//     number: 6,
//     label: "Rutinas cargadas",
//   },
// ];

export default function Profile() {
  const { data: sessionData, status } = useSession();
  const router = useRouter();
  const { name } = router.query;
  const { data: pointsData } = api.points.getPoints.useQuery({
    user_id: sessionData?.user.id ?? "",
  });

  if (status == "unauthenticated") return void router.push("/signin");

  if (sessionData?.user.name !== name && sessionData) return <NotFoundPage />;

  return (
    <>
      {sessionData && name && (
        <ProfileLayout
          header={
            <Header
              level={pointsData?.levelNumber ?? 0}
              points={pointsData?.puntos ?? 0}
              nextLevelPoints={
                pointsData?.nextLevelPoints ?? pointsData?.puntos ?? 0
              }
            />
          }
          sessionData={sessionData}
        >
          <div className="relative flex w-full items-center py-3">
            <div className="absolute left-0 top-0 h-1/2 w-full bg-teal/70">
              <span className="absolute bottom-1 left-1/2 -translate-x-2 text-2xl text-white">
                {name}
              </span>
            </div>
            <div className="z-10 ml-8 flex h-[120px] w-[120px] items-center justify-center rounded-full border-[3px] border-teal bg-[#d9d9d9]">
              <span className="text-7xl text-teal">
                {name[0]?.toLocaleUpperCase()}
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
      className="flex w-full flex-col gap-1"
    >
      <h3 className="ml-1 text-lg font-medium">{title}</h3>
      <div className="rounded-xl bg-[#d9d9d9] p-4">{children}</div>
    </motion.div>
  );
}

function Header({
  level,
  points,
  nextLevelPoints,
}: {
  level: number;
  points: number;
  nextLevelPoints: number;
}) {
  const [progress, setProgress] = useState((points / nextLevelPoints) * 100);

  useEffect(() => {
    if (progress >= points) return;

    const addProgress = points - progress > 100 ? 100 : 10;

    const interval = setInterval(() => {
      setProgress((progress) => Math.round((progress + addProgress) / 10) * 10);
    }, 10);

    return () => clearInterval(interval);
  }, [progress, points]);

  return (
    <div className="flex w-full items-center justify-between bg-teal/70 px-3 pb-2 pt-3">
      <div className="flex w-full items-center gap-4">
        <div className="relative flex h-10 w-12 items-center justify-center rounded-full bg-teal text-lg text-white">
          <span className="z-20">{level}</span>
          <div className="absolute left-1/2 top-1/2 z-10 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange"></div>
        </div>
        <div className="flex w-full flex-col gap-1">
          <span className="text-white">Tu nivel</span>
          <div className="flex max-w-[400px] items-center gap-2">
            <Progress
              value={(progress / nextLevelPoints) * 100}
              color="black"
              className="h-3 border border-teal bg-white"
            />
            <span className=" text-white">
              {progress}/{nextLevelPoints}
            </span>
          </div>
        </div>
      </div>
      {/* <Link
        href={`/${userName}/configuracion`}
        className="no-highlight rounded-md bg-orange p-1"
      >
        <Cog6ToothIcon className="h-6 w-6 text-white" />
      </Link> */}
    </div>
  );
}
