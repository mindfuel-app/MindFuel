// app/ClientLanding.tsx
"use client";

import { useRouter } from "next/navigation";
import Logo from "~/components/logo";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { Progress } from "~/components/ui/progressBar";
import useWindowWidth from "~/hooks/useWindowWidth";
import { motion } from "framer-motion";

export default function ClientLanding() {
  const router = useRouter();
  const [touches, setTouches] = useState(0);
  const width = useWindowWidth();

  if (width > 768) {
    router.push("/signup");
    return null;
  }

  const handleTouch = () => setTouches((t) => t + 1);

  if (touches > 5) {
    router.push("/signup");
    return null;
  }

  return (
    <div className="flex h-screen flex-col py-10" onTouchStart={handleTouch}>
      <Logo />
      {touches === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-12 py-24 text-center font-semibold"
        >
          <h1 className="max-w-[300px] text-3xl text-teal min-[360px]:text-4xl">
            Bienvenido a MindFuel
          </h1>
          <p className="max-w-[280px] text-lg min-[360px]:text-xl">
            Toque en cualquier parte de la pantalla para comenzar
          </p>
          <Icon icon="carbon:touch-1" className="text-8xl" />
        </motion.div>
      )}

      {touches > 0 && (
        <div className="flex flex-col px-6 py-3">
          <motion.h1
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-semibold italic text-orange sm:text-3xl"
          >
            Fuel your mind, fuel your life
          </motion.h1>

          <div className="flex max-w-[500px] flex-col gap-7 py-8 text-left font-semibold sm:py-12 sm:text-lg">
            {touches > 1 && (
              <Message>
                <p>
                  La <span className="font-extrabold">planificación de rutinas</span> es un paso importante que no puede faltar en nuestro día a día.
                </p>
              </Message>
            )}
            {touches > 2 && (
              <Message>
                <p>
                  Sin una <span className="font-extrabold">buena organización</span> existe la posibilidad de tener dificultades al completar tareas, concentrarse, mantener foco en una única cosa a la vez y vivir en el presente.
                </p>
              </Message>
            )}
            {touches > 3 && (
              <Message>
                <p>
                  Con la ayuda de <span className="font-extrabold">MindFuel</span>, mediante una buena planificación de objetivos alcanzables, la motivación y la disciplina se generan en el tiempo.
                </p>
              </Message>
            )}
            {touches > 4 && (
              <Message>
                <p>
                  Es un <span className="font-extrabold text-orange">proceso</span>, las pequeñas acciones diarias son la llave secreta para el éxito.
                </p>
              </Message>
            )}
          </div>

          <div className="flex justify-center">
            <Progress
              value={20 * (touches - 1)}
              className="fixed bottom-7 w-[90%] min-[769px]:hidden"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function Message({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {children}
    </motion.div>
  );
}
