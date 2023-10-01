import { type Session } from "next-auth";
import Head from "next/head";
import { FaHandHoldingHeart } from "react-icons/fa";
import { BottomNavigation, TopNavigation } from "~/components/navigation";
import { UserProvider } from "~/lib/UserContext";

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
          <div className="mb-[86px] flex h-full flex-col items-center bg-alabaster p-3">
            {children}
          </div>
          <BottomNavigation />
        </div>
      </UserProvider>
    </>
  );
}

function Header() {
  return (
    <div className="relative flex w-full items-center justify-between px-6 py-4">
      <span className="text-lg font-medium text-teal">Self-care</span>
      <TopNavigation />
      <FaHandHoldingHeart className="text-3xl text-teal" />
      <div className="absolute bottom-0 left-0 w-full border-[3px] border-teal lg:hidden" />
    </div>
  );
}
