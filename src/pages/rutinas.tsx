import Layout from "~/components/layout";
import Recommend from "~/components/ia";
import { signOut, useSession } from "next-auth/react";

export default function Rutinas() {
  const { data: sessionData } = useSession();

  if (!sessionData) return void signOut({ callbackUrl: "/signin" });

  return (
    <Layout sessionData={sessionData}>
      <div>Rutinas</div>
      <Recommend></Recommend>
    </Layout>
  );
}
