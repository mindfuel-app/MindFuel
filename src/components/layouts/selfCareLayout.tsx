import { useRouter } from "next/router";
import { type Session } from "next-auth";
import Head from "next/head";
import { Footer, TopNavigation } from "~/components/navigation";
import { UserProvider } from "~/lib/UserContext";
import BackButton from "../backButton";
import { FaHandHoldingHeart } from "react-icons/fa";
import useWindowWidth from "~/hooks/useWindowWidth";
import { useTheme } from "~/lib/ThemeContext";
import { cn } from "~/lib/utils";

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
          <main className="flex h-full flex-col items-center p-3 pb-16">
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
  const router = useRouter();
  const isInMenus = !router.pathname.startsWith("/self-care/");
  const { themeColor } = useTheme();

  return (
    <div className="relative flex w-full items-center justify-between px-6 py-4">
      {!isInMenus ? (
        <BackButton
          handleClick={onClose}
          href="/self-care"
          color={themeColor}
        />
      ) : (
        <FaHandHoldingHeart
          className={cn(
            "text-2xl",
            themeColor == "teal" ? "text-teal" : "text-orange-red"
          )}
        />
      )}
      {showNavigation ? (
        <TopNavigation />
      ) : (
        <div
          className={cn(
            "absolute bottom-0 left-0 w-full border-[3px] lg:hidden",
            themeColor == "teal" ? "border-teal" : "border-orange-red"
          )}
        />
      )}
      <span
        className={cn(
          "text-lg font-medium",
          themeColor == "teal" ? "text-teal" : "text-orange-red"
        )}
      >
        Self-care
      </span>
    </div>
  );
}
