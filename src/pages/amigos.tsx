import Head from "next/head";
import Layout from "~/components/layouts/homeLayout";
import { useSession } from "next-auth/react";
import Router from "next/router";

export default function SelfCare() {
  const { data: sessionData, status } = useSession();

  if (status == "unauthenticated") return void Router.push("/signin");

  if (!sessionData) return;

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
