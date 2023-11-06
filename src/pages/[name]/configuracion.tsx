import { PencilIcon } from "@heroicons/react/24/solid";
import BackButton from "~/components/backButton";
import ProfileLayout from "~/components/layouts/profileLayout";
import type { GetServerSideProps } from "next";
import type { Session } from "next-auth";
import { getSession } from "next-auth/react";
import NotFoundPage from "../404";

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

export default function Configuracion({ sessionData }: PageProps) {
  if (!sessionData.user.name) return <NotFoundPage />;

  return (
    <ProfileLayout
      header={<Header userName={sessionData.user.name} />}
      sessionData={sessionData}
    >
      <div className="flex w-full flex-col items-center gap-3 pt-7">
        <div className="flex h-[100px] w-[100px] items-center justify-center rounded-full border-[3px] border-teal bg-[#d9d9d9]">
          <span className="text-6xl text-teal">
            {sessionData.user.name[0]?.toLocaleUpperCase()}
          </span>
        </div>
        <div className="flex w-full items-center justify-center">
          <span className="relative text-2xl text-teal">
            {sessionData.user.name}
            <PencilIcon className="absolute -right-8 bottom-1 h-6 w-6 text-orange" />
          </span>
        </div>
      </div>
    </ProfileLayout>
  );
}

function Header({ userName }: { userName: string }) {
  return (
    <div className="relative flex w-full items-center justify-start bg-teal px-4 py-3">
      <BackButton href={`/${userName}`} color="white" />
      <h1 className="absolute left-1/2 -translate-x-1/2 text-xl font-medium text-white">
        Configuración
      </h1>
    </div>
  );
}
