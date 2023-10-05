import { useSession } from "next-auth/react";
import Router from "next/router";
import {
  ClipboardDocumentCheckIcon,
  Cog6ToothIcon,
  DocumentCheckIcon,
  FaceSmileIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";
import { StarIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import ProfileLayout from "~/components/layouts/profileLayout";
import { motion } from "framer-motion";

const userStats = [
  {
    icon: <UserGroupIcon className="h-9 w-9" />,
    number: 7,
    label: "Amigos",
  },
  {
    icon: <StarIcon className="h-9 w-9" />,
    number: 575,
    label: "Puntos",
  },
  {
    icon: <TrophyIcon className="h-9 w-9" />,
    number: 3,
    label: "Logros",
  },
  {
    icon: <DocumentCheckIcon className="h-9 w-9" />,
    number: 90,
    label: "Tareas realizadas",
  },
  {
    icon: <FaceSmileIcon className="h-9 w-9" />,
    number: 20,
    label: "Reacciones recibidas",
  },
  {
    icon: <ClipboardDocumentCheckIcon className="h-9 w-9" />,
    number: 6,
    label: "Rutinas cargadas",
  },
];

export default function Profile() {
  const { data: sessionData, status } = useSession();

  if (status == "unauthenticated") return void Router.push("/signin");

  if (!sessionData || !sessionData?.user.name) return;

  return (
    <ProfileLayout
      header={<Header userName={sessionData.user.name} />}
      sessionData={sessionData}
    >
      <div className="relative flex w-full items-center py-3">
        <div className="absolute left-0 top-0 h-1/2 w-full bg-teal">
          <span className="absolute bottom-1 left-1/2 -translate-x-2 text-2xl text-white">
            {sessionData.user.name}
          </span>
        </div>
        <div className="z-10 ml-8 flex h-[120px] w-[120px] items-center justify-center rounded-full border-[3px] border-teal bg-[#d9d9d9]">
          <span className="text-7xl text-teal">
            {sessionData.user.name[0]?.toLocaleUpperCase()}
          </span>
        </div>
      </div>
      <div className="flex w-full flex-col items-center gap-4 px-6 pb-[72px] pt-2">
        <Section title="Estadísticas">
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
        </Section>
        <Section title="Logros">Logros</Section>
        <Section title="Resumen semanal">Resumen semanal</Section>
      </div>
    </ProfileLayout>
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

function Header({ userName }: { userName: string }) {
  return (
    <div className="flex w-full items-center justify-end bg-teal py-3 pr-3">
      <Link
        href={`/${userName}/configuracion`}
        className="no-highlight rounded-md bg-orange p-1"
      >
        <Cog6ToothIcon className="h-6 w-6 text-white" />
      </Link>
    </div>
  );
}
