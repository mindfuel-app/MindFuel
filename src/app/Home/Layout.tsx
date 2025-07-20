import { Footer } from "~/components/inputs/navigation";
import Header from "~/components/inputs/header";
import { UserProvider } from "~/contexts/UserProvider";
import { ReactNode } from "react";

export const metadata = {
  title: "MindFuel",
};

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <UserProvider>
      <div className="flex h-screen flex-col">
        <Header showNavigation={true} />
        <main className="flex h-full flex-col items-center p-3">{children}</main>
        <Footer />
      </div>
    </UserProvider>
  );
}
