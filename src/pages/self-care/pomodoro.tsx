import SelfCareLayout from "~/components/layouts/selfCareLayout";
import { OptionLayout } from ".";
import Image from "next/image";
import { useState } from "react";
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

export default function Pomodoro({ sessionData }: PageProps) {
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  return (
    <SelfCareLayout sessionData={sessionData}>
      <OptionLayout title="Técnica pomodoro">
        <div className="flex h-[160px] w-[160px] items-center justify-center rounded-full border-2 border-red-500 bg-white">
          <Image
            width={80}
            height={80}
            alt="Técnica pomodoro"
            src={`/self-care/manzana.png`}
          />
        </div>
        <button
          onClick={() => setIsTimerRunning(!isTimerRunning)}
          className={`no-highlight rounded-3xl bg-red-500 py-2 text-white transition-transform active:scale-95 ${
            isTimerRunning ? "px-7" : "px-4"
          }`}
        >
          <span className="font-medium">
            {isTimerRunning ? "Parar" : "Empezar"}
          </span>
        </button>
      </OptionLayout>
    </SelfCareLayout>
  );
}
