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
  const { data: sessionData } = useSession();
  const [theme, setTheme] = useState<ThemeColor>(defaultThemeValue);
  const { mutate: updateTheme } = api.user.updateTheme.useMutation();
  const { data: themeData } = api.user.getTheme.useQuery({
    user_id: sessionData?.user.id ?? "",
  });

  useEffect(() => {
    if (themeData?.theme && isThemeColor(themeData.theme)) {
      setTheme(themeData.theme);
    }
  }, [themeData?.theme]);

  const setThemeColor: SetThemeColor = (userId: string, value?: ThemeColor) => {
    const newValue = value || theme == "teal" ? "orange-red" : "teal";
    setTheme(newValue);
    updateTheme({ user_id: userId, theme: newValue });
  };

  return (
    <ThemeContext.Provider value={{ themeColor: theme, setThemeColor }}>
      {children}
    </ThemeContext.Provider>
  );
}
