import Head from "next/head";
import Layout from "~/components/layout";
import { signOut, useSession } from "next-auth/react";

export default function SelfCare() {
  const { data: sessionData } = useSession();

  if (!sessionData) return void signOut({ callbackUrl: "/signin" });

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
