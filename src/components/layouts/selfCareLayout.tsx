import router from "next/router";
import { type Session } from "next-auth";
import Head from "next/head";
import { Footer, TopNavigation } from "~/components/navigation";
import { UserProvider } from "~/lib/UserContext";
import BackButton from "../backButton";
import { FaHandHoldingHeart } from "react-icons/fa";

export default function SelfCareLayout({
  children,
  sessionData,
}: {
  children: React.ReactNode;
  sessionData: Session;
}) {
  return (
    <>
      <Head>
        <title>Self-care</title>
      </Head>
      <UserProvider
        id={sessionData.user.id}
        name={sessionData.user.name || ""}
        email={sessionData.user.email || ""}
      >
        <div className="flex h-screen flex-col">
          <Header />
          <main className="flex h-full flex-col items-center bg-alabaster p-3">
            {children}
          </main>
          <Footer />
        </div>
      </UserProvider>
    </>
  );
}

function Header() {
  const isInMenus = !router.pathname.startsWith("/self-care/");

  return (
    <div className="relative flex w-full items-center justify-between px-6 py-4">
      {!isInMenus ? (
        <BackButton href="/self-care" color="teal" />
      ) : (
        <FaHandHoldingHeart className="text-2xl text-teal" />
      )}
      <TopNavigation />
      <span className="text-lg font-medium text-teal">Self-care</span>
      <div className="absolute bottom-0 left-0 w-full border-[3px] border-teal lg:hidden" />
    </div>
  );
}
