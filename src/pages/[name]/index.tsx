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
import ProfileLayout from "~/components/profileLayout";

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
      <div className="relative h-[72px] w-full bg-teal">
        <div className="absolute bottom-0 left-8 flex h-[120px] w-[120px] translate-y-1/2 items-center justify-center rounded-full border-[3px] border-teal bg-[#d9d9d9]">
          <span className="text-7xl text-teal">
            {sessionData.user.name[0]?.toLocaleUpperCase()}
          </span>
        </div>
        <span className="absolute bottom-1 left-1/2 -translate-x-2 text-2xl text-white">
          {sessionData.user.name}
        </span>
      </div>
      <div className="flex w-full items-center justify-center px-7 pt-24">
        <div className="grid w-full grid-cols-2 gap-6 rounded-xl bg-[#d9d9d9] p-4">
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
      </div>
    </ProfileLayout>
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
