// app/layout.tsx
import "~/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { ThemeContextProvider } from "~/contexts/ThemeContext";
import { ReactNode } from "react";
import { TRPCProvider } from "~/contexts/TRPCProvider";
import { Rubik } from "next/font/google";

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata = {
  title: "Mindfuel",
  description: "An AI-powered lifestyle app",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={rubik.className}>
      <head>
        {/* Puedes seguir usando link para preconnect si lo deseas */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* No es necesario cargar la fuente Rubik manualmente si usas next/font */}
      </head>
      <body>
        <SessionProvider>
          <TRPCProvider>
            <ThemeContextProvider>{children}</ThemeContextProvider>
          </TRPCProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
