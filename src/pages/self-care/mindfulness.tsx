import { useSession } from "next-auth/react";
import SelfCareLayout from "../../components/layouts/selfCareLayout";
import Router from "next/router";
import { OptionLayout } from ".";

export default function Mindfulness() {
  const { data: sessionData, status } = useSession();

  if (status == "unauthenticated") return void Router.push("/signin");

  if (!sessionData) return;

  return (
    <SelfCareLayout sessionData={sessionData}>
      <OptionLayout title="Mindfulness">Mindfulness</OptionLayout>
    </SelfCareLayout>
  );
}
