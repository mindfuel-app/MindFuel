import Head from "next/head";
import Layout from "~/components/layout";
import { useSession } from "next-auth/react";
import Router from "next/router";

export default function SelfCare() {
  const { data: sessionData, status } = useSession();

  if (status == "unauthenticated") return void Router.push("/signin");

  if (!sessionData) return;

  return (
    <>
      <Head>
        <title>Self-care</title>
      </Head>
      <Layout sessionData={sessionData}>
        <h1>Self Care</h1>
      </Layout>
    </>
  );
}
