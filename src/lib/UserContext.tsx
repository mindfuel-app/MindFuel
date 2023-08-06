import { createContext, useContext } from "react";

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

export function UserProvider({
  children,
  id,
  name,
  email,
}: {
  children: React.ReactNode;
  id: string;
  name: string;
  email: string;
}) {
  return (
    <UserContext.Provider value={{ id, email, name }}>
      {children}
    </UserContext.Provider>
  );
}
