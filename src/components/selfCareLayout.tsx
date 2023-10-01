import router from "next/router";
import { type Session } from "next-auth";
import Head from "next/head";
import Link from "next/link";
import { MdArrowBackIosNew } from "react-icons/md";
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
  const isInMenus = !router.pathname.startsWith("/self-care/");

  return (
    <div
      className={`relative flex w-full items-center px-6 py-4 ${
        isInMenus ? "justify-end" : "justify-between"
      }`}
    >
      {!isInMenus && (
        <Link href="/self-care" className="no-highlight active:scale-95">
          <MdArrowBackIosNew className="text-2xl text-teal" />
        </Link>
      )}
      <TopNavigation />
      <span className="text-lg font-medium text-teal">Self-care</span>
      <div className="absolute bottom-0 left-0 w-full border-[3px] border-teal lg:hidden" />
    </div>
  );
}
