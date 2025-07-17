import SelfCareLayout from "../../components/layouts/selfCareLayout";
import { Button } from "~/components/ui/button";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useTheme } from "~/lib/ThemeContext";
import { cn } from "~/lib/utils";
import { useSession } from "next-auth/react";
import RespirationCircle from "./components/respiration-guide";

export default function RespiracionConsciente() {
  const router = useRouter();
  const { data: sessionData, status } = useSession();
  const { themeColor } = useTheme();
  const [started, setStarted] = useState(false);

  if (status == "unauthenticated") return void router.push("/signin");

  if (!sessionData) return;

  return (
    <SelfCareLayout sessionData={sessionData}>
      <motion.div
        initial={{ opacity: 0.5, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex h-full justify-between max-w-sm flex-col items-center gap-4 p-[18px] py-10 text-justify"
      >
        {started ? (
          <>
            <p>
              La <strong>respiración consciente</strong> consiste en desviar la
              atención hacia la respiracion, como una manera de concentrarte
              en lo que esta mas cercano a este momento, <strong> al presente</strong>.
            </p>
            <p>
              Practicarla permite{" "}
              <strong>
                calmar la mente, reducir los niveles de estrés, la ansiedad y las
                emociones negativas
              </strong>{" "}
              y agudizar las habilidades de concentración.
            </p>
            <p>
              Bastan <strong>5 minutos diarios </strong>
              para ponerla en práctica, centrar la atención y conseguir sus
              beneficios.{" "}
            </p>
            <p>
              Solo busca un espacio cómodo y tranquilo, un lugar para sentarte y
              punto de enfoque. <strong>Pruébalo</strong>.
            </p>
          </>
        ) : (
          <RespirationCircle size={150} theme={themeColor == "teal" ? "teal" : "orange-red"} />
        )}
        <Button
          onClick={() => setStarted(!started)}
          className={cn(
            "no-highlight mt-3 flex rounded-full px-4 font-medium",
            themeColor == "teal" ? "bg-cornflower-blue" : "bg-orange-red"
          )}
        >
          {started ? "Comenzar" : "Ya estoy mejor"}
        </Button>
      </motion.div>
    </SelfCareLayout>
  );
}