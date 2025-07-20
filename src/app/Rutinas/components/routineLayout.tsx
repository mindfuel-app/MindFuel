import Head from "next/head";
import { UserProvider } from "~/contexts/UserContext";
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
      <div className="flex h-screen flex-col">{children}</div>
    </UserProvider>
  );
}
