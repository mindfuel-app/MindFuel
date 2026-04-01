import SelfCareLayout from "~/components/layouts/selfCareLayout";
import { OptionLayout } from ".";
import Image from "next/image";
import { usePoints } from "~/hooks/usePoints";
import { api } from "~/utils/api";
import { useEffect, useMemo, useState } from "react";
import { selfCarePoints } from "~/lib/points";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Apreciacion() {
  const { data: sessionData, status } = useSession();
  const { addPoints } = usePoints();
  const router = useRouter();
  const { data: previousGreetings } = api.selfCare.getGreetings.useQuery();
  const { mutate: createGreetins } = api.selfCare.createGreetings.useMutation({
    onSuccess: () => {
      void utils.selfCare.getGreetings.invalidate();
    },
  });
  const [greetings, setGreetins] = useState<string[]>([]);
  const [finalMessage, setFinalMessage] = useState(false);
  const utils = api.useContext();
  const [hasPreviousGreeting, setHasPreviousGreeting] = useState(false);
  const completedGreetings = useMemo(
    () => greetings.map((item) => item.trim()).filter(Boolean),
    [greetings]
  );

  useEffect(() => {
    const today = new Date();
    const hasGreetingToday =
      previousGreetings?.some((greeting) => {
        return (
          greeting.createdAt.getDate() == today.getDate() &&
          greeting.createdAt.getMonth() == today.getMonth() &&
          greeting.createdAt.getFullYear() == today.getFullYear()
        );
      }) ?? false;

    setHasPreviousGreeting(hasGreetingToday);
  }, [previousGreetings]);

  if (status == "unauthenticated") return void router.push("/signin");

  if (!sessionData) return;

  const handleSubmit = () => {
    if (completedGreetings.length < 4) return;

    createGreetins({
      greetings: completedGreetings.join("¡!"),
    });
    addPoints({
      user_id: sessionData.user.id,
      points: selfCarePoints.completedGreetings,
    });
    setFinalMessage(true);
  };

  return (
    <SelfCareLayout sessionData={sessionData}>
      <OptionLayout title="Apreciación">
        <div className="flex h-[160px] w-[160px] items-center justify-center rounded-full border-2 border-[#E97B82] bg-white">
          <Image
            width={80}
            height={80}
            alt="Apreciación"
            src={`/self-care/apreciacion.png`}
          />
        </div>
        {hasPreviousGreeting ? (
          <p className="mt-16 max-w-[300px] text-center text-lg">
            Hoy ya has ingresado tus agradecimientos. Si quieres puedes ingresar{" "}
            <button
              type="button"
              onClick={() => setHasPreviousGreeting(false)}
              className="font-medium text-sky-500 underline-offset-2 hover:underline"
            >
              nuevos agradecimientos
            </button>{" "}
            y, si no, vuelve mañana.
          </p>
        ) : !finalMessage ? (
          <>
            <p className="max-w-[290px] text-center text-xl">
              Di <strong>cuatro</strong> cosas por las que estés agradecido el
              día de hoy.
            </p>
            <div className="-mt-3 flex flex-col gap-4">
              {Array(4)
                .fill(null)
                .map((_, index) => (
                  <div
                    key={index}
                    className="relative flex items-center border-b border-black"
                  >
                    <input
                      type="text"
                      aria-label={`Agradecimiento ${index + 1}`}
                      placeholder={`Agradecimiento ${index + 1}`}
                      onChange={(e) =>
                        setGreetins((prev) => {
                          const updatedGreetings = [...prev];
                          updatedGreetings[index] = e.target.value;
                          return updatedGreetings;
                        })
                      }
                      className="ml-6 bg-transparent text-xl outline-none"
                    />
                    <span className="absolute left-0 text-lg">
                      {index + 1}.
                    </span>
                  </div>
                ))}
            </div>
            <button
              onClick={handleSubmit}
              disabled={completedGreetings.length < 4}
              className="no-highlight rounded-3xl bg-[#E97B82] px-4 py-2 text-white transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100"
            >
              <span className="font-medium">Guardar</span>
            </button>
          </>
        ) : (
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="flex flex-col gap-8 pt-12 text-center"
          >
            <h3 className="text-3xl font-semibold">¡Felicidades!</h3>
            <p className="max-w-[280px] text-center text-lg">
              Ya has cumplido con tu meta diaria de 4 agradecimientos y sumaste{" "}
              <strong>{selfCarePoints.completedGreetings} puntos</strong>.
              ¡Hazlo de nuevo mañana!
            </p>
          </motion.div>
        )}
      </OptionLayout>
    </SelfCareLayout>
  );
}
