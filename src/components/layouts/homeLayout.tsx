import { BottomNavigation } from "../navigation";
import Header from "../header";
import { UserProvider } from "~/lib/UserContext";
import { type Session } from "next-auth";

export default function HomeLayout({
  children,
  sessionData,
}: {
  children: React.ReactNode;
  sessionData: Session;
}) {
  return (
    <UserProvider
      id={sessionData.user.id}
      name={sessionData.user.name || ""}
      email={sessionData.user.email || ""}
    >
      <div className="flex h-screen flex-col">
        <Header />
        <main className="mb-[86px] flex h-full flex-col items-center bg-alabaster p-3">
          {children}
        </main>
        <BottomNavigation />
      </div>
    </UserProvider>
  );
}
