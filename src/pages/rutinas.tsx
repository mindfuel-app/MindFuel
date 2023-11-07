import Layout from "~/components/layouts/homeLayout";
import Recommend from "~/components/ia";
import { useSession } from "next-auth/react";
import Router from "next/router";
import { useTheme } from "~/lib/ThemeContext";

export default function Rutinas() {
  const { data: sessionData, status } = useSession();
  const { themeColor, setThemeColor } = useTheme();

  if (status == "unauthenticated") return void Router.push("/signin");

  if (!sessionData) return;

  return (
    <Layout sessionData={sessionData}>
      <div className="flex flex-col gap-10 rounded-md p-2">
        <span
          className={`text-${themeColor} rounded-md bg-white p-2 text-center`}
        >
          {themeColor.toUpperCase()}
        </span>
        <button
          className="no-highlight rounded-md bg-white p-2"
          onClick={() => setThemeColor()}
        >
          Cambiar tema
        </button>
      </div>
      {/* <Recommend></Recommend> */}
    </Layout>
  );
}
