import { UserProvider } from "~/contexts/UserProvider";
import { ReactNode } from "react";

export const metadata = {
  title: "Rutinas | MindFuel",
};

export default async function RutinasLayout({ children }: { children: ReactNode }) {

  return (
    <UserProvider>
      <div className="flex h-screen flex-col">
        {children}
      </div>
    </UserProvider>
  );
}
