import Head from "next/head";
import Layout from "~/components/layouts/homeLayout";
import type { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import type { Session } from "next-auth";

interface PageProps {
  sessionData: Session;
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  context
) => {
  const sessionData = await getSession(context);

  if (!sessionData) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  }

  return {
    props: {
      sessionData,
    },
  };
};

export default function Amigos({ sessionData }: PageProps) {
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
