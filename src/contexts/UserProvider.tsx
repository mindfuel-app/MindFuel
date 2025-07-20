"use client";

import { createContext, useContext } from "react";
import { useSession } from "next-auth/react";

interface UserContextType {
  id: string;
  email: string;
  name: string;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  // Si querés evitar flashes, podés retornar null hasta que esté autenticado
  if (status !== "authenticated") return null;

  const user = session.user;
  if (!user || !user.id || !user.email || !user.name) {
    throw new Error("Incomplete user data in session");
  }

  return (
    <UserContext.Provider value={{ id: user.id, email: user.email, name: user.name }}>
      {children}
    </UserContext.Provider>
  );
}
