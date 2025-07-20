"use client";

import { Button } from "~/components/ui/button";
import { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "~/contexts/ThemeContext";
import { cn } from "~/lib/utils";
import { useSession } from "next-auth/react";
import RespirationGuide from "../Components/respiration-guide";

export default function Page() {
  const { data: sessionData } = useSession();
  const { themeColor } = useTheme();
  const [started, setStarted] = useState(false);

  if (!sessionData) return null;

  return (
    <div className="flex h-full flex-col items-center justify-between pb-5">
      <motion.div
        initial={{ opacity: 0.5, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex max-w-sm flex-col items-center gap-4 p-[18px] text-justify"
      >
        {!started ? (
          <>
            <p>
              La <strong>respiración consciente</strong> consiste en desviar la
              atención hacia la respiración como una manera de concentrarte en
              lo que está más cercano a este momento, <strong>al presente</strong>.
            </p>
            <p>
              Practicarla permite{" "}
              <strong>
                calmar la mente, reducir los niveles de estrés, la ansiedad y
                las emociones negativas
              </strong>{" "}
              y agudizar las habilidades de concentración.
            </p>
            <p>
              Bastan <strong>5 minutos diarios</strong> para ponerla en práctica,
              centrar la atención y conseguir sus beneficios.
            </p>
            <p>
              Solo buscá una postura cómoda y un lugar tranquilo donde puedas
              dedicar este momento a vos.
            </p>
            <Button
              className={cn(
                "mt-4 px-5 py-2",
                themeColor === "teal" ? "bg-teal" : "bg-orange-red"
              )}
              onClick={() => setStarted(true)}
            >
              Empezar
            </Button>
          </>
        ) : (
          <RespirationGuide />
        )}
      </motion.div>
    </div>
  );
}
