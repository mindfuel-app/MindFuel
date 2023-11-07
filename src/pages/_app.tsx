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
  const [theme, setTheme] = useState<ThemeColor>("teal");
  const setThemeColor: SetThemeColor = (value?: ThemeColor) =>
    setTheme(value || theme == "teal" ? "orange-red" : "teal");

  return (
    <SessionProvider session={session}>
      <ThemeContextProvider themeColor={theme} setThemeColor={setThemeColor}>
        <Component {...pageProps} />
      </ThemeContextProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
