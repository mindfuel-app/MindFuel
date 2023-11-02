import router from "next/router";
import { type Session } from "next-auth";
import Head from "next/head";
import { Footer, TopNavigation } from "~/components/navigation";
import { UserProvider } from "~/lib/UserContext";
import BackButton from "../backButton";
import { FaHandHoldingHeart } from "react-icons/fa";
import useWindowWidth from "~/hooks/useWindowWidth";

export default function SelfCareLayout({
  children,
  sessionData,
  onClose,
}: {
  children: React.ReactNode;
  sessionData: Session;
  onClose?: () => void;
}) {
  const windowWidth = useWindowWidth();

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
          <Header onClose={onClose} showNavigation={windowWidth >= 1024} />
          <main className="flex h-full flex-col items-center p-3">
            {children}
          </main>
          {windowWidth < 1024 && <Footer />}
        </div>
      </UserProvider>
    </>
  );
}

function Header({
  onClose,
  showNavigation,
}: {
  onClose?: () => void;
  showNavigation: boolean;
}) {
  const isInMenus = !router.pathname.startsWith("/self-care/");

  return (
    <div className="relative flex w-full items-center justify-between px-6 py-4">
      {!isInMenus ? (
        <BackButton handleClick={onClose} href="/self-care" color="teal" />
      ) : (
        <FaHandHoldingHeart className="text-2xl text-teal" />
      )}
      {showNavigation ? (
        <TopNavigation />
      ) : (
        <div className="absolute bottom-0 left-0 w-full border-[3px] border-teal lg:hidden" />
      )}
      <span className="text-lg font-medium text-teal">Self-care</span>
    </div>
  );
}
