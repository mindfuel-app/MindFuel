import { useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";
import { api } from "~/utils/api";
import { isThemeColor } from "./checkTypes";

export type ThemeColor = "teal" | "orange-red";
export type SetThemeColor = (userId: string, themeColor?: ThemeColor) => void;
export type ThemeContextType = {
  themeColor: ThemeColor;
  setThemeColor: SetThemeColor;
};
export const defaultThemeValue: ThemeColor = "teal";

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

export function ThemeContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: sessionData, status } = useSession();
  const [theme, setTheme] = useState<ThemeColor>(defaultThemeValue);
  const { mutate: updateTheme } = api.user.updateTheme.useMutation();
  const userId = sessionData?.user.id;

  const { data: themeData } = api.user.getTheme.useQuery(
    {
      user_id: userId ?? "",
    },
    {
      enabled: status === "authenticated" && Boolean(userId),
    }
  );

  useEffect(() => {
    if (themeData?.theme && isThemeColor(themeData.theme)) {
      setTheme(themeData.theme);
    }
  }, [themeData?.theme]);

  useEffect(() => {
    if (status === "unauthenticated") {
      setTheme(defaultThemeValue);
    }
  }, [status]);

  const setThemeColor: SetThemeColor = (userId: string, value?: ThemeColor) => {
    const newValue = value ?? (theme === "teal" ? "orange-red" : "teal");
    setTheme(newValue);

    if (!userId) {
      return;
    }

    updateTheme({ user_id: userId, theme: newValue });
  };

  return (
    <ThemeContext.Provider value={{ themeColor: theme, setThemeColor }}>
      {children}
    </ThemeContext.Provider>
  );
}
