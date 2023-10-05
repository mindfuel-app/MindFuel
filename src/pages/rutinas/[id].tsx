import { CheckIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import {
  PlayIcon,
  ChevronDoubleRightIcon,
  PauseIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { Progress } from "~/components/ui/progressBar";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { motion } from "framer-motion";
import Image from "next/image";
import ActiveTask from "../../components/task/activeTask";
import InactiveTask from "../../components/task/inactiveTask";
import { SingleRoutineSkeleton } from "~/components/ui/skeleton";
import RoutineLayout from "~/components/layouts/routineLayout";

function ErrorPage() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (seconds >= 5) return;
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  });

  return (
    <RoutineLayout title="Mindfuel">
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
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  if (status == "unauthenticated") return void router.push("/signin");

  if (!sessionData) return;

  if (!tasks || !routine) {
    return <ErrorPage />;
  }

  return (
    <RoutineLayout title={routine.name}>
      <div className="flex h-full flex-col items-center gap-6 bg-alabaster px-6 pt-8">
        <Progress
          className="max-w-lg"
          value={(100 / tasks.length) * routineProgress}
        />
        <div className="flex w-[270px] flex-col rounded-md bg-teal p-2 font-medium text-white shadow-xl min-[350px]:w-[300px]">
          <h2 className="text-lg">{routine.name}</h2>
          <span className="text-sm text-black">{`${tasks.length} ${
            tasks.length == 1 ? "tarea" : "tareas"
          }`}</span>
          <span className="text-sm">{routine.days}</span>
        </div>
        {routineProgress < tasks.length && (
          <div className="flex w-full flex-col text-left font-medium">
            <div className="jutify-start flex w-full">Tareas</div>
            <ul className="padding-footer flex max-w-xl flex-col gap-3 py-3">
              {tasks.map((task, index) => {
                if (index == routineProgress) {
                  return (
                    <ActiveTask
                      name={task.name}
                      usesAI={task.usesAI}
                      estimatedTime={task.estimated_time || null}
                      isTimerRunning={isTimerRunning}
                      key={task.id}
                    />
                  );
                } else {
                  return (
                    <InactiveTask
                      name={task.name}
                      isDone={
                        index < routineProgress && !skippedTasks.includes(index)
                      }
                      key={task.id}
                    />
                  );
                }
              })}
            </ul>
          </div>
        )}
        {routineProgress == tasks.length && <SuccessMessage />}
      </div>
      {routineProgress < tasks.length && (
        <div className="no-highlight fixed bottom-0 w-full bg-white py-3">
          <div
            onClick={() => {
              if (routineProgress < tasks.length)
                setRoutineProgress(routineProgress + 1);
            }}
            className="absolute -top-8 left-1/2 flex h-14 w-14 -translate-x-1/2 transform cursor-pointer items-center justify-center rounded-full bg-cornflower-blue transition-all active:scale-95 min-[425px]:h-16 min-[425px]:w-16"
          >
            <CheckIcon className="h-8 w-8 text-white" />
          </div>
          <div className="flex w-full justify-around">
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className={`flex w-[65px] flex-col items-center gap-1 rounded-xl p-1 text-center active:bg-gray-100 min-[375px]:w-[71px]`}
            >
              {isTimerRunning ? (
                <PauseIcon className="h-6 w-6" />
              ) : (
                <PlayIcon className="h-6 w-6" />
              )}
              <span className="text-xs font-medium min-[375px]:text-sm">
                {isTimerRunning ? "Pausar" : "Reanudar"}
              </span>
            </button>
            <button
              onClick={() => {
                if (routineProgress < tasks.length) {
                  setSkippedTasks((prev) => [...prev, routineProgress]);
                  setRoutineProgress(routineProgress + 1);
                }
              }}
              className={`flex w-[65px] flex-col items-center gap-1 rounded-xl p-1 text-center active:bg-gray-100 min-[375px]:w-[71px]`}
            >
              <ChevronDoubleRightIcon className="h-5 w-5" />
              <span className="text-xs font-medium min-[375px]:text-sm">
                Saltear
              </span>
            </button>
          </div>
        </div>
      )}
    </RoutineLayout>
  );
}

function SuccessMessage() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative flex w-[300px] flex-col items-center gap-1 rounded-xl border-2 border-teal bg-white p-5 py-16 shadow-xl md:w-[600px] md:pb-8 md:pt-4"
    >
      <Image
        className="mb-5"
        src="/finished-routine.png"
        width={200}
        height={200}
        alt=""
      />
      <span className="font-bold">Gran trabajo!</span>
      <span className="font-medium">Has completado toda la rutina</span>
      <Link
        href="/home"
        className="no-highlight absolute -bottom-5 rounded-2xl bg-teal px-12 py-1.5 text-white transition-transform active:scale-95"
      >
        <span className="text-lg">Listo</span>
      </Link>
    </motion.div>
  );
}
