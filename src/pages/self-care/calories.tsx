import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import SelfCareLayout from "~/components/layouts/selfCareLayout";

export default function Calories() {
  const router = useRouter();
  const { data: sessionData, status } = useSession();

  if (status == "unauthenticated") return void router.push("/signin");

  if (!sessionData) return;
  
  return (
    <SelfCareLayout sessionData={sessionData}>
      <div className="flex h-full items-center justify-center">
        <h1 className="text-2xl font-bold">Calorías</h1>
      </div>
    </SelfCareLayout>
  );
}