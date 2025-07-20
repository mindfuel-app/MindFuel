"use client";

import { useTheme } from "~/contexts/ThemeContext";
import { useSession } from "next-auth/react";

export default function RutinasPage() {
  const { themeColor, setThemeColor } = useTheme();
  const { data: session } = useSession();

  if (!session) return null;

  return (
    <div className="flex flex-col gap-10 rounded-md p-2">
      <span
        className={`text-${themeColor} rounded-md bg-white p-2 text-center`}
      >
        {themeColor.toUpperCase()}
      </span>
      <button
        className="no-highlight rounded-md bg-white p-2"
        onClick={() => setThemeColor(session.user.id)}
      >
        Cambiar tema
      </button>
    </div>
  );
}
