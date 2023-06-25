import { useSession } from "next-auth/react";
import Head from "next/head";
import Router from "next/router";
import Logo from "~/components/auth/logo";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { Progress } from "../components/ui/progressBar";

export default function Landing() {
  const { status } = useSession();
  const [screenTouches, setScreenTouches] = useState(0);

  if (status === "authenticated") {
    void Router.push("/tareas");
  } else if (status === "unauthenticated") {
    return (
      <>
        <Head>
          <title>MindFuel</title>
        </Head>
        <div
          className="flex h-screen flex-col py-10"
          onTouchStart={() => setScreenTouches(screenTouches + 1)}
        >
          <Logo />
          {screenTouches == 0 && (
            <div className="flex flex-col items-center gap-12 py-24 text-center font-semibold">
              <h1 className="max-w-[300px] text-3xl text-[#008080] min-[360px]:text-4xl">
                Bienvenido a MindFuel
              </h1>
              <p className="max-w-[280px] text-lg min-[360px]:text-xl">
                Toque en cualquier parte de la pantalla para comenzar
              </p>
              <Icon icon="carbon:touch-1" className="text-8xl" />
            </div>
          )}
          {screenTouches > 0 && (
            <div className="flex flex-col px-6 py-3">
              <h1 className="text-2xl font-semibold italic text-[#F57F11] sm:text-3xl">
                Fuel your mind, fuel your life
              </h1>
              <div className="flex max-w-[500px] flex-col gap-7 py-8 text-left font-semibold sm:py-12 sm:text-lg">
                {screenTouches > 1 && (
                  <p>
                    La{" "}
                    <span className="font-extrabold">
                      planificación de rutinas
                    </span>{" "}
                    es un paso importante que no puede faltar en nuestro día a
                    día.
                  </p>
                )}
                {screenTouches > 2 && (
                  <p>
                    Sin una{" "}
                    <span className="font-extrabold">buena organización</span>{" "}
                    existe la posibilidad de tener dificultades al completar
                    tareas, concentrarse, mantener foco en una única cosa a la
                    vez y vivir en el presente.
                  </p>
                )}
                {screenTouches > 3 && (
                  <p>
                    Con la ayuda de{" "}
                    <span className="font-extrabold">MindFuel</span>, mediante
                    una buena planificación de objetivos alcanzables, la
                    motivación y la disciplina se generan en el tiempo.
                  </p>
                )}
                {screenTouches > 4 && (
                  <p>
                    Es un{" "}
                    <span className="font-extrabold text-[#F57F11]">
                      proceso
                    </span>
                    , las pequeñas acciones diarias son la llave secreta para el
                    éxito.
                  </p>
                )}
                {screenTouches > 5 && void Router.push("/signup")}
              </div>
              <div className="flex justify-center">
                <Progress
                  value={20 * (screenTouches - 1)}
                  className="fixed bottom-7 w-[90%] min-[769px]:hidden"
                />
              </div>
            </div>
          )}
        </div>
      </>
    );
  }
}
