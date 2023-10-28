import { useSession } from "next-auth/react";
import SelfCareLayout from "../../components/layouts/selfCareLayout";
import Router from "next/router";
import { Button } from "~/components/ui/button";
import { useState } from "react";
import { ArrowRightIcon, CheckIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

export default function RespiracionConsciente() {
  const { data: sessionData, status } = useSession();
  const [progress, setProgress] = useState(0);

  if (status == "unauthenticated") return void Router.push("/signin");

  if (!sessionData) return;

  return (
    <SelfCareLayout sessionData={sessionData}>
      {progress == 0 ? (
        <div className="flex max-w-sm flex-col items-center gap-4 px-[18px] pt-8 text-center">
          <p>
            La <strong>respiración consciente</strong> consiste en desviar la
            atención hacia diferentes puntos para fijarnos en las veces que
            inhalamos y exhalamos.
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
          <Button
            onClick={() => setProgress(1)}
            className="no-highlight mt-3 flex rounded-full bg-cornflower-blue px-4 font-medium "
          >
            Empezar
          </Button>
        </div>
      ) : (
        <StepCard
          progress={progress}
          incrementProgress={() => setProgress((progress) => progress + 1)}
        >
          {progress == 1 ? (
            <p>
              Busca un espacio en el que te sientas cómodo y elegí la posición
              que mas te relaje. Puede ser sentarse en el piso, en tu silla
              favorita o hasta incluso simplemente echarte en la cama.{" "}
            </p>
          ) : progress == 2 ? (
            <>
              <p>Cierra los ojos y no hagas nada por al menos un minuto.</p>
              <p>Pueden aparecer pensamientos, y eso está bien. </p>
              <p>Tomate este momento para ti y comienza a relajarte. </p>
            </>
          ) : (
            <>
              <p>
                Inhala por la nariz durante 4 segundos, aguanta la respiración 8
                segundos y suelta el aire por la boca durante otros 8. Todo a un
                ritmo en el que te sientas cómodo.
              </p>
              <p>
                Tu estómago debería expandirse con cada inhalación y contraerse
                con cada exhalación.
              </p>
              <p>
                Una vez que termine, vuelve a respirar de manera natural y toma
                un minuto de silencio.
              </p>
              <p>Repite el proceso las veces que sea necesario</p>
            </>
          )}
        </StepCard>
      )}
    </SelfCareLayout>
  );
}

function StepCard({
  children,
  progress,
  incrementProgress,
}: {
  children: React.ReactNode;
  progress: number;
  incrementProgress: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0.5, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="mt-7 flex w-[85%] max-w-sm flex-col items-center gap-8 rounded-xl bg-cornflower-blue py-5 text-center"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full border-8 border-white bg-transparent text-3xl font-medium text-white">
        {progress}
      </div>
      <div className="flex flex-col items-center gap-3 px-8 leading-5 text-white sm:px-12">
        {children}
      </div>
      <div className="">
        {progress < 3 ? (
          <Button
            onClick={incrementProgress}
            className="no-highlight h-[60px] w-[60px] rounded-full bg-white"
          >
            <ArrowRightIcon className="text-cornflower-blue" />
          </Button>
        ) : (
          <Button
            onClick={() => void Router.push("/self-care")}
            className="no-highlight h-16 w-16 rounded-full bg-white"
          >
            <CheckIcon className="text-cornflower-blue" />
          </Button>
        )}
      </div>
    </motion.div>
  );
}
