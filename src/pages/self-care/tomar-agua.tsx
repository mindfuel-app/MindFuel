import SelfCareLayout from "~/components/layouts/selfCareLayout";
import { useState } from "react";
import { CheckIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { OptionLayout } from ".";
import Image from "next/image";
import { api } from "~/utils/api";
import { selfCarePoints } from "~/lib/points";
import { usePoints } from "~/hooks/usePoints";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function TomarAgua() {
  const router = useRouter();
  const { data: sessionData, status } = useSession();
  const { addPoints } = usePoints();
  const utils = api.useContext();
  const { mutate: updateWater } = api.selfCare.updateWater.useMutation({
    onSuccess: () => {
      void utils.selfCare.getWater.invalidate({
        user_id: sessionData?.user.id,
      });
    },
  });
  const { data } = api.selfCare.getWater.useQuery({
    user_id: sessionData?.user.id ?? "",
  });
  const [glassesOfWater, setGlassesOfWater] = useState(
    Array(8)
      .fill(null)
      .map((_, index) => {
        if (!data || !data.water) return false;
        return index < data.water;
      })
  );
  const [finalMessage, setFinalMessage] = useState(false);
  const [hasCompletedWater, setHasCompletedWater] = useState(data?.water == 8);

  if (status == "unauthenticated") return void router.push("/signin");

  if (!sessionData) return;

  const handleClose = () => {
    if (!glassesOfWater) return;
    updateWater({
      water: glassesOfWater.filter(Boolean).length,
      user_id: sessionData.user.id,
    });
  };

  return (
    <SelfCareLayout sessionData={sessionData} onClose={handleClose}>
      <OptionLayout title="Tomar agua">
        <div className="flex h-[160px] w-[160px] items-center justify-center rounded-full border-2 border-[#75CFF9] bg-white">
          <Image
            width={80}
            height={80}
            alt="Tomar agua"
            src={`/self-care/tomar-agua.png`}
          />
        </div>
        {hasCompletedWater ? (
          <p className="max-w-[300px] pt-16 text-center text-lg">
            Hoy ya has cumplido con tu meta diaria de tomar 8 vasos de agua. Si
            quieres puedes{" "}
            <span
              onClick={() => {
                updateWater({
                  water: 0,
                  user_id: sessionData.user.id,
                });
                setGlassesOfWater(Array(8).fill(false));
                setHasCompletedWater(false);
              }}
              className="text-sky-500 active:underline"
            >
              hacerlo de vuelta
            </span>{" "}
            y sino vuelve mañana!
          </p>
        ) : !finalMessage ? (
          <>
            <p className="max-w-[290px] text-center text-xl">
              Es recomendable tomar 8 vasos de agua (2L) al día para mantenerse{" "}
              <strong>bien hidratado</strong>.
            </p>
            <div className="grid grid-cols-4 gap-4 pb-3 pt-5">
              {Array(8)
                .fill(null)
                .map((_, index) => (
                  <Checkbox
                    key={index}
                    isChecked={glassesOfWater[index] ?? false}
                    onCheckedChange={() => {
                      setGlassesOfWater((prev) => {
                        if (!prev) return prev;
                        const newGlassesOfWater = [...prev];
                        newGlassesOfWater[index] = !newGlassesOfWater[index];

                        if (newGlassesOfWater[index]) {
                          for (let i = 0; i < index; i++) {
                            newGlassesOfWater[i] = true;
                          }
                        } else {
                          for (
                            let i = index + 1;
                            i < newGlassesOfWater.length;
                            i++
                          ) {
                            newGlassesOfWater[i] = false;
                          }
                        }

                        return newGlassesOfWater;
                      });
                      if (index == 7) {
                        updateWater({
                          water: 8,
                          user_id: sessionData.user.id,
                        });
                        addPoints({
                          user_id: sessionData.user.id,
                          points: selfCarePoints.completedWater,
                        });
                        setFinalMessage(true);
                      }
                    }}
                  />
                ))}
            </div>
          </>
        ) : (
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="flex flex-col gap-5 pt-16 text-center"
          >
            <h3 className="text-3xl font-semibold">¡Felicidades!</h3>
            <p className="max-w-[320px] text-lg">
              Has completado el objetivo de tomar 8 vasos de diarios de agua y
              sumaste <strong>{selfCarePoints.completedWater} puntos</strong>.
              Hazlo de nuevo mañana.
            </p>
          </motion.div>
        )}
      </OptionLayout>
    </SelfCareLayout>
  );
}

function Checkbox({
  isChecked,
  onCheckedChange,
}: {
  isChecked: boolean;
  onCheckedChange: () => void;
}) {
  return (
    <div
      onClick={onCheckedChange}
      className={`no-highlight flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#75CFF9] transition-colors ${
        isChecked ? "bg-[#75CFF9]" : "bg-white"
      }`}
    >
      {isChecked && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 25,
          }}
        >
          <CheckIcon className="h-10 w-10 text-white" />
        </motion.div>
      )}
    </div>
  );
}
