import Head from "next/head";
import BackButton from "../backButton";

export default function RoutineLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="flex h-screen flex-col">
        <div className="flex w-full items-center justify-start pl-5 pt-5">
          <BackButton href={`/home?tab=rutinas`} />
        </div>
        {children}
      </div>
    </>
  );
}
