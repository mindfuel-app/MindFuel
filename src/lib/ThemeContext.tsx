import { createContext, useContext } from "react";

export type ThemeColor = "teal" | "orange-red";
export type SetThemeColor = (themeColor?: ThemeColor) => void;

export type ThemeContextType = {
  themeColor: ThemeColor;
  setThemeColor: SetThemeColor;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

export function ThemeContextProvider({
  themeColor,
  setThemeColor,
  children,
}: {
  themeColor: ThemeColor;
  setThemeColor: SetThemeColor;
  children: React.ReactNode;
}) {
  return (
    <ThemeContext.Provider value={{ themeColor, setThemeColor }}>
      {children}
    </ThemeContext.Provider>
  );
}
