import { useSession } from "next-auth/react";
import SelfCareLayout from "./layout";
import Router from "next/router";

export default function Mindfulness() {
  const { data: sessionData, status } = useSession();

  if (status == "unauthenticated") return void Router.push("/signin");

  if (!sessionData) return;

  return (
    <SelfCareLayout sessionData={sessionData}>
      <h1>Mindfulness</h1>
    </SelfCareLayout>
  );
}
