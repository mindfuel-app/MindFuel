import Head from "next/head";
import Layout from "~/components/layout";
import { signOut, useSession } from "next-auth/react";

export default function SelfCare() {
  const { data: sessionData } = useSession();

  if (!sessionData) return void signOut({ callbackUrl: "/signin" });

  return (
    <>
      <Head>
        <title>Amigos</title>
      </Head>
      <Layout sessionData={sessionData}>
        <h1>Amigos</h1>
      </Layout>
    </>
  );
}
