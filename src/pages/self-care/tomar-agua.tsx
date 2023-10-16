import Router from "next/router";
import { useSession } from "next-auth/react";
import SelfCareLayout from "~/components/layouts/selfCareLayout";
import { useState } from "react";
import { CheckIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { OptionLayout } from ".";
import Image from "next/image";
import { api } from "~/utils/api";
import { useSearchParams } from "next/navigation";

export default function TomarAgua() {
  const { data: sessionData, status } = useSession();
  const { refetch: refetchWater } = api.selfCare.getWater.useQuery({
    user_id: sessionData?.user.id || "",
  });
  const searchParams = useSearchParams();
  const data = Number(searchParams.get("water"));
  const [glassesOfWater, setGlassesOfWater] = useState(
    Array(8)
      .fill(null)
      .map((_, index) => {
        if (!data) return false;
        return index < data;
      })
  );
  const { mutate: updateWater } = api.selfCare.updateWater.useMutation({});

  if (status == "unauthenticated") return void Router.push("/signin");

  if (!sessionData) return;

  const handleClose = () => {
    if (!glassesOfWater) return;
    updateWater({
      water: glassesOfWater.filter(Boolean).length,
      user_id: sessionData.user.id,
    });
    void refetchWater();
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
        <p className="max-w-[290px] text-center text-xl">
          Es recomendable tomar 8 vasos de agua (2L) al día para mantenerse{" "}
          <strong>bien hidratado</strong>.
        </p>
        {glassesOfWater && (
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
                      return newGlassesOfWater;
                    });
                  }}
                />
              ))}
          </div>
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
