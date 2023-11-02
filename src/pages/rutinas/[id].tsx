import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { motion } from "framer-motion";
import Image from "next/image";
import ActiveTask from "../../components/task/activeTask";
import InactiveTask from "../../components/task/inactiveTask";
import { SingleRoutineSkeleton } from "~/components/ui/skeleton";
import RoutineLayout from "~/components/layouts/routineLayout";
import { usePoints } from "~/hooks/usePoints";
import { routinePoints, taskPoints } from "~/lib/points";
import { type Session } from "next-auth";
import { Footer } from "~/components/navigation";
import { XMarkIcon } from "@heroicons/react/24/outline";

function ErrorPage({ sessionData }: { sessionData: Session }) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (seconds >= 5) return;
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  });

  return (
    <RoutineLayout title="Mindfuel" sessionData={sessionData}>
      {seconds < 5 ? (
        <SingleRoutineSkeleton />
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-10 py-36 text-center"
        >
          <span className="max-w-[250px] text-2xl">
            Ups... Parece que la rutina no existe
          </span>
          <Link
            href="/home"
            className="no-highlight rounded-xl bg-cornflower-blue px-5 py-3 text-xl text-white active:bg-cornflower-blue/80"
          >
            Volver a la home
          </Link>
        </motion.div>
      )}
    </RoutineLayout>
  );
}

export default function Routine() {
  const { addPoints } = usePoints();
  const router = useRouter();
  const { data: sessionData, status } = useSession();
  const { data: routine } = api.routines.getRoutineById.useQuery({
    id: typeof router.query.id == "string" ? router.query.id : "",
  });
  const { data: tasks } = api.tasks.getTasksbyRoutine.useQuery({
    routine_id: typeof router.query.id == "string" ? router.query.id : "",
  });
  const [routineProgress, setRoutineProgress] = useState(0);
  const [skippedTasks, setSkippedTasks] = useState<number[]>([]);
  const [rewardPoints, setRewardPoints] = useState(0);

  useEffect(() => {
    if (!sessionData?.user.id || !tasks) return;

    if (routineProgress === tasks.length) {
      setRewardPoints(
        skippedTasks.length == 0
          ? routinePoints.completed
          : (routineProgress - skippedTasks.length) *
              taskPoints.completedAfterDeadline
      );

      addPoints({
        user_id: sessionData.user.id,
        points: rewardPoints,
      });
    }
  }, [
    addPoints,
    rewardPoints,
    routineProgress,
    sessionData?.user.id,
    skippedTasks.length,
    tasks,
  ]);

  if (status == "unauthenticated") return void router.push("/signin");

  if (!sessionData) return;

  if (!tasks || !routine) {
    return <ErrorPage sessionData={sessionData} />;
  }

  return (
    <RoutineLayout title={routine.name} sessionData={sessionData}>
      <div className="flex h-full flex-col items-center gap-6 bg-alabaster px-6 pt-8">
        <div className="absolute top-0 flex w-full flex-col bg-teal p-4 font-medium text-white">
          {" "}
          <Link href={`/home?tab=rutinas`}>
            <XMarkIcon className="absolute right-5 top-5 h-6 w-6" />
          </Link>
          <h2 className="text-xl">{routine.name}</h2>
          <span className="text-[#93DADA]">{`${tasks.length} ${
            tasks.length == 1 ? "tarea" : "tareas"
          }`}</span>
          <span className="font-normal">
            {routine.days.length == 33
              ? "Todos los dias de la semana"
              : routine.days.length == 0
              ? "Nunca"
              : routine.days}
          </span>
        </div>
        {/* <Progress
          className="max-w-lg"
          value={(100 / tasks.length) * routineProgress}
        />
        <div className="flex w-[270px] flex-col rounded-md bg-teal p-2 font-medium text-white shadow-xl min-[350px]:w-[300px]">
          <h2 className="text-lg">{routine.name}</h2>
          <span className="text-sm text-black">{`${tasks.length} ${
            tasks.length == 1 ? "tarea" : "tareas"
          }`}</span>
          <span className="text-sm">{routine.days}</span>
        </div> */}
        {routineProgress < tasks.length && (
          <>
            <div className="flex w-full flex-col pb-[110px] pt-24 text-left font-medium">
              <div className="jutify-start flex w-full">Tareas</div>
              <ul className="flex max-w-xl flex-col gap-3 py-3">
                {tasks.map((task, index) => {
                  if (index == routineProgress) {
                    return (
                      <ActiveTask
                        name={task.name}
                        usesAI={task.usesAI}
                        estimatedTime={task.estimated_time || null}
                        increaseRoutineProgress={() =>
                          setRoutineProgress(
                            (routineProgress) => routineProgress + 1
                          )
                        }
                        increaseSkippedTasks={() =>
                          setSkippedTasks((prev) => [...prev, routineProgress])
                        }
                        key={task.id}
                      />
                    );
                  } else {
                    return (
                      <InactiveTask
                        name={task.name}
                        isDone={
                          index < routineProgress &&
                          !skippedTasks.includes(index)
                        }
                        key={task.id}
                      />
                    );
                  }
                })}
              </ul>
            </div>
            <Footer />
          </>
        )}
        {routineProgress == tasks.length && (
          <div className="pb-20 pt-36">
            <FinalMessage
              completionStatus={
                skippedTasks.length == 0
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

function FinalMessage({
  completionStatus,
  points,
}: {
  completionStatus: "completed" | "partial" | "none";
  points: number;
}) {
  let message;
  switch (completionStatus) {
    case "completed":
      message = "Has completado toda la rutina. ";
      break;
    case "partial":
      message = "Has completado casi toda la rutina. ";
      break;
    case "none":
      message =
        "No has completado ninguna tarea de la rutina. Vuelve a intentarlo más tarde.";
      break;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative flex w-[300px] flex-col items-center gap-1 rounded-xl border-2 border-teal bg-white p-5 pb-10 pt-8 shadow-xl md:w-[600px] md:pb-12 md:pt-4"
    >
      <strong className="text-lg">
        {completionStatus != "none" ? "¡Gran trabajo!" : "¡Sigue intentandolo!"}
      </strong>
      <span className="text-center">
        {message}
        {points > 0 && (
          <>
            Ganaste <strong>{points} puntos</strong>.
          </>
        )}
      </span>
      <Image
        className="mb-5 mt-2 md:mb-10"
        src="/finished-routine.png"
        width={200}
        height={200}
        alt=""
      />
      <p className="max-w-[220px] text-center">
        Sigue adelante para obtener más puntos y alcanzar nuevas metas 🚀
      </p>
      <Link
        href="/home"
        className="no-highlight absolute -bottom-5 rounded-2xl bg-teal px-12 py-1.5 text-white transition-transform active:scale-95"
      >
        <span className="text-lg">Listo</span>
      </Link>
    </motion.div>
  );
}
