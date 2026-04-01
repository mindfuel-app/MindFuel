import { cn } from "~/lib/utils";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { JoinedDateSkeleton } from "~/components/ui/skeleton";
import { StatsSkeleton } from "./skeleton";
import { TrophyIcon } from "lucide-react";
import { type Session } from "next-auth";
import useWindowWidth from "~/hooks/useWindowWidth";

export default function UserInfo({
  sessionData,
  joinedDate,
  pointsData,
  completedTasks,
  themeColor,
}: {
  sessionData: Session;
  joinedDate: { month: string; year: number } | undefined;
  pointsData: { puntos: number; nextLevelPoints: number; levelNumber?: number } | undefined;
  completedTasks: number;
  themeColor: "teal" | "orange-red";
}
) {
  const windowWidth = useWindowWidth();
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-4">
        <div className={cn("text-3xl flex gap-2 font-normal text-gray-800", windowWidth < 390 ? "flex-col" : "")}>
          {sessionData.user.name}{" "}
          {pointsData?.levelNumber && (
            <div
              className={cn(
                "break-none",
                themeColor === "teal" ? "text-teal" : "text-orange-red")
              }
            >
              · Nivel {pointsData.levelNumber}
            </div>
          )}
        </div>
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
      <div className="flex flex-col justify-end gap-8">
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
    </div>
  )
}