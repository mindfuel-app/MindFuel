import { useSession } from "next-auth/react";
import SelfCareLayout from "../../components/layouts/selfCareLayout";
import Router from "next/router";
import { OptionLayout } from ".";
import Image from "next/image";

export default function Mindfulness() {
  const { data: sessionData, status } = useSession();

  if (status == "unauthenticated") return void Router.push("/signin");

  if (!sessionData) return;

  return (
    <SelfCareLayout sessionData={sessionData}>
      <OptionLayout title="Mindfulness">
        <div className="flex h-[160px] w-[160px] items-center justify-center rounded-full border-2 border-green-600 bg-white">
          <Image
            width={80}
            height={80}
            alt="Mindfulness"
            src={`/self-care/mindfulness.png`}
          />
        </div>
      </OptionLayout>
    </SelfCareLayout>
  );
}
