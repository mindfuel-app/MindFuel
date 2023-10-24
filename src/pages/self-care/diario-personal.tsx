import Router from "next/router";
import { useSession } from "next-auth/react";
import SelfCareLayout from "~/components/layouts/selfCareLayout";
import { OptionLayout } from ".";
import Image from "next/image";

export default function DiarioPersonal() {
  const { data: sessionData, status } = useSession();

  if (status == "unauthenticated") return void Router.push("/signin");

  if (!sessionData) return;

  return (
    <SelfCareLayout sessionData={sessionData}>
      <OptionLayout title="Diario personal">
        <div className="flex h-[160px] w-[160px] items-center justify-center rounded-full border-2 border-[#b17c54] bg-white">
          <Image
            width={80}
            height={80}
            alt="Diario personal"
            src={`/self-care/diario.png`}
          />
        </div>{" "}
        <p className="max-w-[290px] text-center text-xl">
          Este es tu lugar seguro, puedes escribir lo que desees.
        </p>
        <textarea
          className="h-36 w-full resize-none rounded-lg border-2 border-gray-500 px-2 py-1 outline-none focus:border-gray-700"
          onChange={(e) => {
            e.preventDefault();
          }}
        />
        <button className="no-highlight rounded-3xl bg-[#b17c54] px-4 py-2 text-white transition-transform active:scale-95">
          <span className="font-medium">Guardar</span>
        </button>
      </OptionLayout>
    </SelfCareLayout>
  );
}
