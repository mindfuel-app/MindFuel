import { useSession } from "next-auth/react";
import Router from "next/router";
import SelfCareLayout from "~/components/layouts/selfCareLayout";
import { OptionLayout } from ".";

export default function Apreciacion() {
  const { data: sessionData, status } = useSession();

  if (status == "unauthenticated") return void Router.push("/signin");

  if (!sessionData) return;

  return (
    <SelfCareLayout sessionData={sessionData}>
      <OptionLayout title="Apreciación">
        <div className="flex h-[170px] w-[170px] items-center justify-center rounded-full border-2 border-[#E97B82] bg-white">
          Apreciacion
        </div>
        <p className="max-w-[270px] text-center text-xl">
          Dí <span className="font-bold">cuatro</span> cosas por las que estés
          agradecido el día de hoy.
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
                  className="ml-6 bg-transparent text-xl outline-none"
                />
                <span className="absolute left-0 text-lg">{index + 1}.</span>
              </div>
            ))}
        </div>
        <button className="no-highlight rounded-3xl bg-[#E97B82] px-4 py-2 text-white transition-transform active:scale-95">
          <span className="font-medium">Guardar</span>
        </button>
      </OptionLayout>
    </SelfCareLayout>
  );
}
