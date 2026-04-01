import { Footer } from "../inputs/navigation";
import Header from "../inputs/header";
import { UserProvider } from "~/lib/UserContext";
import { type Session } from "next-auth";
import Head from "next/head";
import useWindowWidth from "~/hooks/useWindowWidth";

export default function HomeLayout({
  children,
  sessionData,
}: {
  children: React.ReactNode;
  sessionData: Session;
}) {
  const windowWidth = useWindowWidth();

  return (
    <>
      <Head>
        <title>MindFuel</title>
      </Head>
      <UserProvider
        id={sessionData.user.id}
        name={sessionData.user.name || ""}
        email={sessionData.user.email || ""}
      >
        <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#f4f6f3]">
          <div className="pointer-events-none absolute -left-20 top-20 h-80 w-80 rounded-full bg-teal/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-28 top-40 h-96 w-96 rounded-full bg-orange-red/10 blur-3xl" />
          <Header showNavigation={windowWidth >= 1024} />
          <main className="relative mx-auto flex h-full w-full max-w-6xl flex-col items-center px-3 pb-4">
            {children}
          </main>
          {windowWidth < 1024 && <Footer />}
        </div>
      </UserProvider>
    </>
  );
}
