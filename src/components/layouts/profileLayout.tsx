import { type Session } from "next-auth";
import Head from "next/head";
import { UserProvider } from "~/contexts/UserContext";
import { Footer } from "../inputs/navigation";
import useWindowWidth from "~/hooks/useWindowWidth";

export default function ProfileLayout({
  header,
  children,
  sessionData,
}: {
  header: JSX.Element;
  children: React.ReactNode;
  sessionData: Session;
}) {
  const windowWidth = useWindowWidth();

  return (
    <>
      <Head>
        <title>{sessionData.user.name}</title>
      </Head>
      <UserProvider
        id={sessionData.user.id}
        name={sessionData.user.name || ""}
        email={sessionData.user.email || ""}
      >
        <div className="flex h-screen flex-col">
          {header}
          <main className="flex h-full flex-col items-center">{children}</main>
          {windowWidth < 1024 && <Footer />}
        </div>
      </UserProvider>
    </>
  );
}
