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
        <div className="flex h-screen flex-col">
          <Header showNavigation={windowWidth >= 1024} />
          <main className="flex h-full flex-col items-center p-3">
            {children}
          </main>
          {windowWidth < 1024 && <Footer />}
        </div>
      </UserProvider>
    </>
  );
}
