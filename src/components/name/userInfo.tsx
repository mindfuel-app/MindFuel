import { CalendarIcon } from "@heroicons/react/24/outline";
import { TrophyIcon } from "lucide-react";
import { type Session } from "next-auth";
import { JoinedDateSkeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";
import { StatsSkeleton } from "./skeleton";

export default function UserInfo({
  sessionData,
  joinedDate,
  pointsData,
  completedTasks,
  themeColor,
}: {
  sessionData: Session;
  joinedDate: { month: string; year: number } | undefined;
  pointsData:
    | { puntos: number; nextLevelPoints: number; levelNumber?: number }
    | undefined;
  completedTasks: number;
  themeColor: "teal" | "orange-red";
}) {
  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-end gap-2 text-3xl font-semibold text-gray-800 sm:text-4xl">
          <h1>{sessionData.user.name}</h1>
          {pointsData?.levelNumber && (
            <span
              className={cn(
                "text-xl font-medium sm:text-2xl",
                themeColor === "teal" ? "text-teal" : "text-orange-red"
              )}
            >
              · Nivel {pointsData.levelNumber}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-gray-100 px-3 py-2 text-sm text-gray-600 sm:w-fit sm:text-base">
          <CalendarIcon className="h-5 w-5 text-gray-500" />
          {joinedDate ? (
            <span className="mt-[2px]">
              Se unio en {joinedDate.month} de {joinedDate.year}
            </span>
          ) : (
            <JoinedDateSkeleton />
          )}
        </div>
      </div>

      <div className="flex flex-col justify-end gap-6">
        {completedTasks !== undefined && pointsData ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div
              className={cn(
                "flex flex-col gap-1 rounded-2xl p-4",
                themeColor === "teal"
                  ? "bg-teal/10 text-teal"
                  : "bg-orange-red/10 text-orange-red"
              )}
            >
              <span className="text-2xl font-medium">{completedTasks}</span>
              <span className="text-sm">Tareas completadas</span>
            </div>
            <div className="flex flex-col gap-1 rounded-2xl bg-orange/10 p-4 text-orange">
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

      <div className="w-full border-t border-gray-200" />

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <h3 className="ml-1 text-lg font-medium text-gray-800">Logros</h3>
          <TrophyIcon className="h-5 w-5 text-[#d4af37]" />
        </div>
        <div className="max-w-lg rounded-2xl bg-gray-100 p-4 text-gray-600">
          Todavia no hay nada aqui
        </div>
      </div>
    </div>
  );
}
