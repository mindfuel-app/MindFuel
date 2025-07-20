"use client";

import { ReactNode } from "react";
import { Session } from "next-auth";
import { UserProvider } from "~/contexts/UserProvider";
import { Footer, TopNavigation } from "~/components/inputs/navigation";
import BackButton from "~/components/inputs/backButton";
import { FaHandHoldingHeart } from "react-icons/fa";
import useWindowWidth from "~/hooks/useWindowWidth";
import { useTheme } from "~/contexts/ThemeContext";
import { cn } from "~/lib/utils";
import { usePathname } from "next/navigation";

export default function ClientWrapper({
  session,
  children,
}: {
  session: Session;
  children: ReactNode;
}) {
  const windowWidth = useWindowWidth();

  return (
    <UserProvider>
      <div className="flex h-screen flex-col">
        <Header showNavigation={windowWidth >= 1024} />
        <main className="flex h-full flex-col items-center p-3 pb-16">
          {children}
        </main>
        {windowWidth < 1024 && <Footer />}
      </div>
    </UserProvider>
  );
}

function Header({ showNavigation }: { showNavigation: boolean }) {
  const pathname = usePathname();
  const isInMenus = !pathname?.startsWith("/selfcare");
  const { themeColor } = useTheme();

  return (
    <div className="relative flex w-full items-center justify-between px-6 py-4">
      {!isInMenus ? (
        <BackButton
          handleClick={undefined}
          href="/selfcare"
          color={themeColor}
        />
      ) : (
        <FaHandHoldingHeart
          className={cn(
            "text-2xl",
            themeColor === "teal" ? "text-teal" : "text-orange-red"
          )}
        />
      )}
      {showNavigation ? (
        <TopNavigation />
      ) : (
        <div
          className={cn(
            "absolute bottom-0 left-0 w-full border-[3px] lg:hidden",
            themeColor === "teal" ? "border-teal" : "border-orange-red"
          )}
        />
      )}
      <span
        className={cn(
          "text-lg font-medium",
          themeColor === "teal" ? "text-teal" : "text-orange-red"
        )}
      >
        Self-care
      </span>
    </div>
  );
}
