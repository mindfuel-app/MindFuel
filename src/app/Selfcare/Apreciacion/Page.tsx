"use client";

import OptionLayout from "../Components/OptionLayout";
import Image from "next/image";
import { usePoints } from "~/hooks/usePoints";
import { api } from "~/utils/api";
import { useState, useEffect } from "react";
import { selfCarePoints } from "~/lib/points";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";

export default function Apreciacion() {
  const { data: sessionData, status } = useSession();
  const { addPoints } = usePoints();
  const utils = api.useContext();

  const { data: previousGreetings } = api.selfCare.getGreetings.useQuery({
    user_id: sessionData?.user.id ?? "",
  });

  const { mutate: createGreetings } = api.selfCare.createGreetings.useMutation({
    onSuccess: () => {
      void utils.selfCare.getGreetings.invalidate();
    },
  });

  const [greetings, setGreetings] = useState<string[]>([]);
  const [finalMessage, setFinalMessage] = useState(false);
  const [hasPreviousGreeting, setHasPreviousGreeting] = useState(false);

  useEffect(() => {
    if (!previousGreetings) return;

    const today = new Date();
    const found = previousGreetings.some((greeting) => {
      const createdAt = new Date(greeting.createdAt);
      return (
        createdAt.getDate() === today.getDate() &&
        createdAt.getMonth() === today.getMonth() &&
        createdAt.getFullYear() === today.getFullYear()
      );
    });
    setHasPreviousGreeting(found);
  }, [previousGreetings]);

  if (!sessionData) return null;

  const handleSubmit = () => {
    createGreetings({
      user_id: sessionData.user.id,
      greetings: greetings.join("¡!"),
    });

    addPoints({
      user_id: sessionData.user.id,
      points: selfCarePoints.completedGreetings,
    });

    setFinalMessage(true);
  };

  return (
    <OptionLayout title="Apreciación">
      <div className="flex h-[160px] w-[160px] items-center justify-center rounded-full border-2 border-[#E97B82] bg-white">
        <Image
          width={80}
          height={80}
          alt="Apreaciacion"
          src={`/self-care/apreciacion.png`}
        />
      </div>
      {hasPreviousGreeting ? (
        <p className="mt-16 max-w-[300px] text-center text-lg">
          Hoy ya has ingresado tus agradecimientos. Si quieres puedes ingresar{" "}
          <span
            onClick={() => setHasPreviousGreeting(false)}
            className="text-sky-500 active:underline"
          >
            nuevos agradecimientos
          </span>{" "}
          y sino vuelve mañana!
        </p>
      ) : !finalMessage ? (
        <>
          <p className="max-w-[290px] text-center text-xl">
            Dí <strong>cuatro</strong> cosas por las que estés agradecido el
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
                    onChange={(e) =>
                      setGreetings((prev) => {
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
            className="no-highlight rounded-3xl bg-[#E97B82] px-4 py-2 text-white transition-transform active:scale-95"
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
  );
}
