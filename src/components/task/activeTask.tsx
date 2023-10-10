import { Progress } from "~/components/ui/progressBar";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Checkbox } from "~/components/ui/checkbox";
import { CircularProgress } from "@mui/material";

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

  useEffect(() => {
    if (!usesAI) return;
    fetch("https://mindfuel-ia.onrender.com/dividir_tarea", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tareas: name }),
    })
      .then((res) => res.json())
      .then((data: string[]) => {
        setSteps(data);
        setLoadingSteps(false);
      })
      .catch((error) => {
        console.error(error);
        setLoadingSteps(false);
      });
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
