import Head from "next/head";
import BackButton from "../backButton";
import { UserProvider } from "~/lib/UserContext";
import { type Session } from "next-auth";

export default function RoutineLayout({
  title,
  children,
  sessionData,
}: {
  title: string;
  children: React.ReactNode;
  sessionData: Session;
}) {
  return (
    <UserProvider
      id={sessionData.user.id}
      name={sessionData.user.name || ""}
      email={sessionData.user.email || ""}
    >
      <Head>
        <title>{title}</title>
      </Head>
      <div className="flex h-screen flex-col">
        <div className="flex w-full items-center justify-start pl-5 pt-5">
          <BackButton href={`/home?tab=rutinas`} />
        </div>
        {children}
      </div>
    </UserProvider>
  );
}
