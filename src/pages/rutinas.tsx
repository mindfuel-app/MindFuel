import Layout from "~/components/layout";
import Recommend from "~/components/ia";
import { useSession } from "next-auth/react";
import Router from "next/router";

export default function Rutinas() {
  const { data: sessionData, status } = useSession();

  if (status == "unauthenticated") return void Router.push("/signin");

  if (!sessionData) return;

  return (
    <Layout sessionData={sessionData}>
      <div>Rutinas</div>
      <Recommend></Recommend>
    </Layout>
  );
}
