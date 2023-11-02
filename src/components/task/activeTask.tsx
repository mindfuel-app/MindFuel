import { Progress } from "~/components/ui/progressBar";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Checkbox } from "~/components/ui/checkbox";
import { CircularProgress } from "@mui/material";
import { api } from "~/utils/api";
import { useUser } from "~/lib/UserContext";
import * as Dialog from "@radix-ui/react-dialog";
import { CheckIcon } from "@heroicons/react/24/outline";
import {
  ChevronDoubleRightIcon,
  PauseCircleIcon,
  PlayCircleIcon,
} from "@heroicons/react/24/solid";
import { cn } from "~/lib/utils";

function LoadingSteps() {
  return (
    <div className="flex flex-col items-center gap-3 pb-2 pt-4">
      <CircularProgress color="primary" size={25} />
      <span className="font-normal">Cargando desglose de tarea...</span>
    </div>
  );
}

function CountdownTimer({
  initialSeconds,
  isRunning,
  onComplete,
}: {
  initialSeconds: number;
  isRunning: boolean;
  onComplete: () => void;
}) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isTimerRunning, setIsTimerRunning] = useState(isRunning);

  useEffect(() => setIsTimerRunning(isRunning), [isRunning]);

  useEffect(() => {
    if (secondsLeft == 0) {
      return onComplete();
    }

    if (secondsLeft > 0 && isTimerRunning) {
      const interval = setInterval(() => {
        setSecondsLeft((prevSeconds) => prevSeconds - 1);
      }, 1000);

      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, isTimerRunning]);

  const hours = Math.floor(secondsLeft / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = Math.floor((secondsLeft % 3600) % 60);

  return (
    <>
      <div className="flex">
        <div className="rounded-l-md border-2 border-orange bg-white pl-1 pr-3 text-orange">
          <span>{`${
            hours > 0 ? `${hours.toString().padStart(2, "0")}:` : ""
          }${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`}</span>
        </div>
        <div
          onClick={() => {
            setSecondsLeft(initialSeconds);
            setIsTimerRunning(true);
          }}
          className="no-highlight flex cursor-pointer items-center rounded-r-md bg-orange px-2 text-white"
        >
          <span>Re-setear</span>
        </div>
        <div
          onClick={() => setIsTimerRunning((prev) => !prev)}
          className="ml-3 flex h-7 w-7 items-center justify-center rounded-full bg-orange"
        >
          {isTimerRunning ? (
            <PauseCircleIcon className="h-5 w-5 text-white" />
          ) : (
            <PlayCircleIcon className="h-5 w-5 text-white" />
          )}
        </div>
      </div>
      <Progress
        className="my-2"
        value={(100 / initialSeconds) * (initialSeconds - secondsLeft)}
      />
    </>
  );
}

export default function ActiveTask({
  name,
  usesAI,
  estimatedTime,
  increaseRoutineProgress,
  increaseSkippedTasks,
}: {
  name: string;
  usesAI: boolean;
  estimatedTime: number | null;
  increaseRoutineProgress: () => void;
  increaseSkippedTasks: () => void;
}) {
  const { id } = useUser();
  const [checked, setChecked] = useState<boolean[]>([]);
  const [steps, setSteps] = useState<string[]>();
  const [loadingSteps, setLoadingSteps] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { mutate: sendNotification } =
    api.pushSuscriptions.sendPushToOne.useMutation({
      onSuccess: () => {
        console.log("Notification sent");
      },
      onError: (error) => {
        console.error(error);
      },
    });

  const hours = estimatedTime ? Math.floor(estimatedTime / 3600) : null;
  const minutes = estimatedTime
    ? Math.floor((estimatedTime % 3600) / 60)
    : null;
  const seconds = estimatedTime
    ? Math.floor((estimatedTime % 3600) % 60)
    : null;

  useEffect(() => {
    if (!usesAI) return;

    const controller = new AbortController();
    const signal = controller.signal;

    const timeout = setTimeout(() => controller.abort(), 5000);

    fetch("https://mindfuel-ia.onrender.com/dividir_tarea", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      signal,
      body: JSON.stringify({ tareas: name }),
    })
      .then((res) => res.json())
      .then((data: string[]) => {
        clearTimeout(timeout);
        setSteps(data);
        setLoadingSteps(false);
      })
      .catch((error) => {
        console.error(error);
        setLoadingSteps(false);
      });

    return () => clearTimeout(timeout);
  }, [usesAI, name]);

  return (
    <div className="flex flex-col gap-4 rounded-lg border-2 border-teal bg-teal/20 p-3">
      <span className="text-sm">Ahora</span>
      <div className="-mt-2">
        {name}
        {estimatedTime && (
          <span>{` - ${hours ? `${hours} hs` : ""} ${
            minutes ? `${minutes} min` : ""
          } ${seconds ? `${seconds} s` : ""}`}</span>
        )}
      </div>
      {estimatedTime && (
        <CountdownTimer
          initialSeconds={estimatedTime}
          isRunning={!loadingSteps}
          onComplete={() => {
            setShowModal(true);
            sendNotification({
              user_id: id,
              title: "¿Sigues ahí?",
              body: `¡Se acabó el tiempo para ${name}!`,
              url: "/home?tab=rutinas",
            });
          }}
        />
      )}
      {usesAI &&
        (loadingSteps ? (
          <LoadingSteps />
        ) : steps ? (
          <ul className="flex flex-col gap-2 px-1">
            {steps.map((task, index) => (
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
            ))}
          </ul>
        ) : (
          <span className="py-2 text-center font-normal">
            No se pudo cargar el desglose de tarea
          </span>
        ))}
      {(!usesAI || !loadingSteps) && (
        <div
          className={cn(
            "no-highlight flex items-center justify-end gap-3",
            !usesAI && "-mt-8"
          )}
        >
          <div
            onClick={() => increaseRoutineProgress()}
            className="flex h-10 w-10 transform cursor-pointer items-center justify-center rounded-full bg-cornflower-blue transition-all active:scale-95 min-[425px]:h-12 min-[425px]:w-12"
          >
            <CheckIcon className="h-7 w-7 text-white" />
          </div>
          <div
            onClick={() => {
              increaseSkippedTasks();
              increaseRoutineProgress();
            }}
            className="flex h-10 w-10 transform cursor-pointer items-center justify-center rounded-full bg-cornflower-blue transition-all active:scale-95 min-[425px]:h-12 min-[425px]:w-12"
          >
            <ChevronDoubleRightIcon className="h-7 w-7 text-white" />
          </div>
        </div>
      )}
      <CompletedTimerModal
        show={showModal}
        completeTask={() => {
          increaseRoutineProgress();
          setShowModal(false);
        }}
        skipTask={() => {
          increaseSkippedTasks();
          increaseRoutineProgress();
          setShowModal(false);
        }}
      />
    </div>
  );
}

function CompletedTimerModal({
  show,
  completeTask,
  skipTask,
}: {
  show: boolean;
  completeTask: () => void;
  skipTask: () => void;
}) {
  return (
    <Dialog.Root open={show}>
      <Dialog.Overlay className="fixed inset-0 z-30 bg-[#d9d9d9]/80 data-[state=closed]:animate-[dialog-overlay-hide_200ms] data-[state=open]:animate-[dialog-overlay-show_200ms]" />
      <Dialog.Content className="fixed left-1/2 top-1/2 z-40 w-full max-w-[75%] -translate-x-1/2 -translate-y-1/2 rounded-2xl border-2 border-orange bg-white shadow transition-transform data-[state=closed]:animate-[dialog-content-hide_200ms] data-[state=open]:animate-[dialog-content-show_200ms] min-[500px]:max-w-sm">
        <div className="flex flex-col items-center gap-5 pt-5 text-center">
          <p className="px-7 ">
            El tiempo ha acabado. ¿Deseas continuar con el mismo hábito o
            saltear al próximo?
          </p>
          <div className="no-highlight flex w-full border-t-2 border-orange text-lg text-orange">
            <button
              onClick={(e) => {
                e.preventDefault();
                completeTask();
              }}
              className="w-1/2 py-2"
            >
              Continuar
            </button>
            <div className="border border-orange" />
            <button
              onClick={(e) => {
                e.preventDefault();
                skipTask();
              }}
              className="w-1/2 py-2"
            >
              Saltear
            </button>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}
