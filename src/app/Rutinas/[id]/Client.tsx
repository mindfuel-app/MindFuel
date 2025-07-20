"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import ActiveTask from "~/components/task/activeTask";
import InactiveTask from "~/components/task/inactiveTask";
import { Footer } from "~/components/inputs/navigation";
import { usePoints } from "~/hooks/usePoints";
import { routinePoints, taskPoints } from "~/lib/points";
import { cn } from "~/lib/utils";
import { useTheme } from "~/contexts/ThemeContext";
import FinalMessage from "../components/FinalMessage";
import RoutineLayout from "~/app/Rutinas/components/routineLayout";
import { SingleRoutineSkeleton } from "~/components/ui/skeleton";
import type { Session } from "next-auth";
import { Link } from "lucide-react";
import { XMarkIcon } from "@heroicons/react/24/outline";

function ErrorPage({ sessionData }: { sessionData: Session }) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (seconds >= 5) return;
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds]);

  return (
    <RoutineLayout title="Mindfuel" sessionData={sessionData}>
      {seconds < 5 ? (
        <SingleRoutineSkeleton />
      ) : (
        <div className="flex flex-col items-center gap-10 py-36 text-center">
          <span className="max-w-[250px] text-2xl">
            Ups... Parece que la rutina no existe
          </span>
          <a
            href="/home"
            className="no-highlight rounded-xl bg-cornflower-blue px-5 py-3 text-xl text-white active:bg-cornflower-blue/80"
          >
            Volver a la home
          </a>
        </div>
      )}
    </RoutineLayout>
  );
}

export default function ClientRoutine({ id }: { id: string }) {
  const { data: sessionData, status } = useSession();
  const { themeColor } = useTheme();
  const { addPoints } = usePoints();
  const router = useRouter();

  const { data: routine } = api.routines.getRoutineById.useQuery({ id });
  const { data: tasks } = api.tasks.getTasksbyRoutine.useQuery({ routine_id: id });

  const [routineProgress, setRoutineProgress] = useState(0);
  const [skippedTasks, setSkippedTasks] = useState<number[]>([]);
  const [rewardPoints, setRewardPoints] = useState(0);

  useEffect(() => {
    if (!sessionData?.user.id || !tasks) return;

    if (routineProgress === tasks.length) {
      const points =
        skippedTasks.length === 0
          ? routinePoints.completed
          : (routineProgress - skippedTasks.length) *
          taskPoints.completedAfterDeadline;

      setRewardPoints(points);

      addPoints({
        user_id: sessionData.user.id,
        points,
      });
    }
  }, [
    addPoints,
    routineProgress,
    sessionData?.user.id,
    skippedTasks.length,
    tasks,
  ]);

  if (status === "unauthenticated") {
    router.push("/signin");
    return null;
  }

  if (!sessionData) return null;

  if (!routine || !tasks) {
    return <ErrorPage sessionData={sessionData} />;
  }

  return (
    <RoutineLayout title={routine.name} sessionData={sessionData}>
      <div className="flex h-full flex-col items-center gap-6 bg-alabaster px-6 pt-8">
        <div
          className={cn(
            "absolute top-0 flex w-full flex-col p-4 font-medium text-white shadow-xl",
            themeColor == "teal" ? "bg-teal" : "bg-orange-red"
          )}
        >
          <Link href={`/home?tab=rutinas`}>
            <XMarkIcon className="absolute right-5 top-5 h-6 w-6" />
          </Link>
          <h2 className="text-xl">{routine.name}</h2>
          <span
            className={
              themeColor == "teal" ? "text-[#93DADA]" : "text-gray-700"
            }
          >{`${tasks.length} ${tasks.length == 1 ? "tarea" : "tareas"}`}</span>
          <span className="font-normal">
            {routine.days.length == 33
              ? "Todos los dias de la semana"
              : routine.days.length == 0
                ? "Nunca"
                : routine.days}
          </span>
        </div>

        {routineProgress < tasks.length && (
          <>
            <div className="flex w-full flex-col pb-[110px] pt-24 text-left font-medium">
              <div className="jutify-start flex w-full">Tareas</div>
              <ul className="flex max-w-xl flex-col gap-3 py-3">
                {tasks.map((task, index) => {
                  if (index === routineProgress) {
                    return (
                      <ActiveTask
                        key={task.id}
                        name={task.name}
                        usesAI={task.usesAI}
                        estimatedTime={task.estimated_time || null}
                        increaseRoutineProgress={() =>
                          setRoutineProgress((p) => p + 1)
                        }
                        increaseSkippedTasks={() =>
                          setSkippedTasks((prev) => [...prev, routineProgress])
                        }
                      />
                    );
                  } else {
                    return (
                      <InactiveTask
                        key={task.id}
                        name={task.name}
                        isDone={
                          index < routineProgress &&
                          !skippedTasks.includes(index)
                        }
                      />
                    );
                  }
                })}
              </ul>
            </div>
            <Footer />
          </>
        )}

        {routineProgress === tasks.length && (
          <div className="pb-20 pt-36">
            <FinalMessage
              completionStatus={
                skippedTasks.length === 0
                  ? "completed"
                  : skippedTasks.length < tasks.length
                    ? "partial"
                    : "none"
              }
              points={rewardPoints}
            />
          </div>
        )}
      </div>
    </RoutineLayout>
  );
}
