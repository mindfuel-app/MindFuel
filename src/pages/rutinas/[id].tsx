import { CheckIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Header from "~/components/header";
import {
  PlayIcon,
  ChevronDoubleRightIcon,
  PauseIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { Progress } from "~/components/ui/progressBar";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import Head from "next/head";
import { motion } from "framer-motion";
import Image from "next/image";
import { Checkbox } from "~/components/ui/checkbox";
import { obtenerListaDePasos } from "~/components/openai";
import { CircularProgress } from "@mui/material";

export default function Routine() {
  const router = useRouter();
  const { data: sessionData, status } = useSession();
  const { data: routine } = api.routines.getRoutineById.useQuery({
    id: router.query.id as string,
  });
  const { data: tasks } = api.tasks.getTasksbyRoutine.useQuery({
    routine_id: router.query.id as string,
  });
  const [routineProgress, setRoutineProgress] = useState(0);
  const [skippedTasks, setSkippedTasks] = useState<number[]>([]);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  if (status == "unauthenticated") return void router.push("/signin");

  if (!sessionData) return;

  if (!tasks || !routine) return <div>No hay tareas</div>;

  return (
    <>
      <Head>
        <title>{routine.name}</title>
      </Head>
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="mb-[86px] flex h-full flex-col items-center gap-6 bg-alabaster px-6 py-8">
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
              <ul className="flex max-w-xl flex-col gap-3 py-3">
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
      </div>
    </>
  );
}

function CountdownTimer({
  initialSeconds,
  isRunning,
}: {
  initialSeconds: number;
  isRunning: boolean;
}) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    if (secondsLeft > 0 && isRunning) {
      const interval = setInterval(() => {
        setSecondsLeft((prevSeconds) => prevSeconds - 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [secondsLeft, isRunning]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <>
      <div className="flex">
        <div className="rounded-l-md border-2 border-orange bg-white pl-1 pr-3 text-orange">
          <span>{`${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`}</span>
        </div>
        <div
          onClick={() => setSecondsLeft(initialSeconds)}
          className="no-highlight flex cursor-pointer items-center rounded-r-md bg-orange px-2 text-white"
        >
          <span>Re-setear</span>
        </div>
      </div>
      <Progress
        className="my-2"
        value={(100 / initialSeconds) * (initialSeconds - secondsLeft)}
      />
    </>
  );
}

const aiTasks = [
  { name: "Prender el horno" },
  { name: "Preparar la masa" },
  { name: "Cortar los ingredientes" },
  { name: "Hornear la pizza" },
  { name: "Servir la pizza" },
];

function LoadingSteps() {
  return (
    <div className="flex flex-col items-center gap-3 pb-2 pt-4">
      <CircularProgress color="primary" size={25} />
      <span className="font-normal">Cargando desglose de tarea...</span>
    </div>
  );
}

function ActiveTask({
  name,
  usesAI,
  estimatedTime,
  isTimerRunning,
}: {
  name: string;
  usesAI: boolean;
  estimatedTime: number | null;
  isTimerRunning: boolean;
}) {
  const [checked, setChecked] = useState<boolean[]>([]);
  const [steps, setSteps] = useState<string[]>();
  const [loadingSteps, setLoadingSteps] = useState(false);

  useEffect(() => {
    if (!usesAI) return;
    setLoadingSteps(true);
    const stepsPromise = obtenerListaDePasos(name);
    void stepsPromise.then((result) => setSteps(result));
    void stepsPromise.finally(() => setLoadingSteps(false));
  }, [usesAI, name]);

  return (
    <div className="flex flex-col gap-3 rounded-lg border-2 border-teal bg-teal/20 p-3">
      <span className="text-sm">Ahora</span>
      <div className="-mt-2">
        {name}
        {estimatedTime && <span>{` - ${estimatedTime / 60} min`}</span>}
      </div>
      {estimatedTime && (
        <CountdownTimer
          initialSeconds={estimatedTime}
          isRunning={isTimerRunning}
        />
      )}
      {usesAI && (
        <ul className="flex flex-col gap-2 px-1">
          {loadingSteps ? (
            <LoadingSteps />
          ) : steps ? (
            steps.map((task, index) => (
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                key={task}
                onClick={() =>
                  setChecked((prev) => {
                    const updatedChecks = [...prev];
                    updatedChecks[index] = !updatedChecks[index];
                    return updatedChecks;
                  })
                }
                className="flex items-center gap-2"
              >
                <Checkbox checked={checked[index]} className="h-4 w-4" />
                <span className="text-sm">{task}</span>
              </motion.div>
            ))
          ) : (
            <span className="py-2 text-center font-normal">
              No se pudo cargar el desglose de tarea
            </span>
          )}
        </ul>
      )}
    </div>
  );
}

function InactiveTask({ name, isDone }: { name: string; isDone: boolean }) {
  return (
    <div className="rounded-lg bg-teal p-2">
      <div
        className={`flex items-center ${
          isDone ? "justify-between" : "justify-start"
        }`}
      >
        <span className="ml-2 text-white">{name}</span>
        {isDone && (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
            <CheckIcon className="h-6 w-6 text-teal" />
          </div>
        )}
      </div>
    </div>
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
