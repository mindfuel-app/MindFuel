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
  const { data: initialTheme } = api.user.getTheme.useQuery({
    user_id: session?.user?.id ?? "",
  });
  const { mutate: updateTheme } = api.user.updateTheme.useMutation();
  const [theme, setTheme] = useState<ThemeColor>("teal");
  const setThemeColor: SetThemeColor = (value?: ThemeColor) => {
    const newValue = value || theme == "teal" ? "orange-red" : "teal";
    setTheme(newValue);
    updateTheme({ user_id: session?.user?.id ?? "", theme: newValue });
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
