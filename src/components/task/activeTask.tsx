import { Progress } from "~/components/ui/progressBar";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Checkbox } from "~/components/ui/checkbox";
import { CircularProgress } from "@mui/material";
import { api } from "~/utils/api";
import { useUser } from "~/lib/UserContext";

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
  taskName,
}: {
  initialSeconds: number;
  isRunning: boolean;
  taskName: string;
}) {
  const { id } = useUser();
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const { mutate: sendNotification } =
    api.pushSuscriptions.sendPushToOne.useMutation({
      onSuccess: () => {
        console.log("Notification sent");
      },
      onError: (error) => {
        console.error(error);
      },
    });

  useEffect(() => {
    if (secondsLeft == 0) {
      return sendNotification({
        user_id: id,
        title: "¿Sigues ahí?",
        body: `¡Se acabó el tiempo para ${taskName}!`,
        url: "/home?tab=rutinas",
      });
    }
    if (secondsLeft > 0 && isRunning) {
      const interval = setInterval(() => {
        setSecondsLeft((prevSeconds) => prevSeconds - 1);
      }, 1000);

      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, isRunning]);

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

export default function ActiveTask({
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
  const [loadingSteps, setLoadingSteps] = useState(true);
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
    <div className="flex flex-col gap-3 rounded-lg border-2 border-teal bg-teal/20 p-3">
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
          taskName={name}
          initialSeconds={estimatedTime}
          isRunning={isTimerRunning && !loadingSteps}
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
    </div>
  );
}
