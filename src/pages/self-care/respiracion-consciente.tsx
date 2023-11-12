import SelfCareLayout from "../../components/layouts/selfCareLayout";
import { Button } from "~/components/ui/button";
import { useState } from "react";
import { ArrowRightIcon, CheckIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import type { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import type { Session } from "next-auth";
import { useRouter } from "next/router";
import { useTheme } from "~/lib/ThemeContext";
import { cn } from "~/lib/utils";

interface PageProps {
  sessionData: Session;
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  context
) => {
  const sessionData = await getSession(context);

  if (!sessionData) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  }

  return {
    props: {
      sessionData,
    },
  };
};

export default function RespiracionConsciente({ sessionData }: PageProps) {
  const [progress, setProgress] = useState(0);
  const { themeColor } = useTheme();

  return (
    <SelfCareLayout sessionData={sessionData}>
      {progress == 0 ? (
        <motion.div
          initial={{ opacity: 0.5, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex max-w-sm flex-col items-center gap-4 px-[18px] pt-8 text-center"
        >
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
            className={cn(
              "no-highlight mt-3 flex rounded-full px-4 font-medium",
              themeColor == "teal" ? "bg-cornflower-blue" : "bg-orange-red"
            )}
          >
            Empezar
          </Button>
        </motion.div>
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
  const router = useRouter();
  const { themeColor } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0.5, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "mt-4 flex w-[85%] max-w-sm flex-col items-center gap-8 rounded-xl py-5 text-center",
        themeColor == "teal" ? "bg-cornflower-blue" : "bg-orange-red"
      )}
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
            <ArrowRightIcon
              className={
                themeColor == "teal"
                  ? "text-cornflower-blue"
                  : "text-orange-red"
              }
            />
          </Button>
        ) : (
          <Button
            onClick={() => void router.push("/self-care")}
            className="no-highlight h-16 w-16 rounded-full bg-white"
          >
            <CheckIcon
              className={
                themeColor == "teal"
                  ? "text-cornflower-blue"
                  : "text-orange-red"
              }
            />
          </Button>
        )}
      </div>
    </motion.div>
  );
}
