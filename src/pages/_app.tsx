import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import {
  type ThemeColor,
  type SetThemeColor,
  ThemeContextProvider,
} from "~/lib/ThemeContext";
import { useState } from "react";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const [theme, setTheme] = useState<ThemeColor>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as ThemeColor) ?? "teal";
    }
    return "teal";
  });
  const setThemeColor: SetThemeColor = (value?: ThemeColor) => {
    const newValue = value || theme == "teal" ? "orange-red" : "teal";
    setTheme(newValue);
    localStorage.setItem("theme", newValue);
  };

  return (
    <SessionProvider session={session}>
      <ThemeContextProvider themeColor={theme} setThemeColor={setThemeColor}>
        <Component {...pageProps} />
      </ThemeContextProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
