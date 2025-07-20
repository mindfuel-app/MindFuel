import Layout from "~/components/layouts/homeLayout";
import { Tabs, TabsList } from "../components/ui/tabs";
import { motion } from "framer-motion";
import TaskList from "../components/task/taskList";
import RoutineList from "../components/routine/routineList";
import useSwipe from "~/hooks/useSwipe";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { cn } from "~/lib/utils";
import { useTheme } from "~/contexts/ThemeContext";

const tabOptions = [
  { value: "tareas", label: "Tareas" },
  { value: "rutinas", label: "Rutinas" },
];

export default function Home() {
  const { data: sessionData, status } = useSession();
  const { themeColor } = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedTab =
    searchParams.get("tab") == "tareas" || searchParams.get("tab") == "rutinas"
      ? searchParams.get("tab")
      : "tareas";

  const swipeHandler = useSwipe({
    onSwipedLeft: () => router.push("?tab=rutinas"),
    onSwipedRight: () => router.push("?tab=tareas"),
  });

  if (status == "unauthenticated") return void router.push("/signin");

  if (!sessionData) return;

  return (
    <Layout sessionData={sessionData}>
      <Tabs {...swipeHandler} className="h-full w-full">
        <div className="mt-3 flex justify-center">
          <TabsList>
            {tabOptions.map((tab) => (
              <Link
                href={`?tab=${tab.value}`}
                key={tab.value}
                className={`relative inline-flex w-1/2 select-none items-center justify-center whitespace-nowrap rounded-sm px-5 py-1.5 text-lg font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50
                  ${selectedTab == tab.value
                    ? "text-foreground text-white shadow-sm"
                    : ""
                  }
                  `}
              >
                <div className="z-20">{tab.label}</div>
                {tab.value == selectedTab && (
                  <motion.div
                    layoutId="bg"
                    transition={{
                      type: "spring",
                      bounce: 0,
                      duration: 0.3,
                    }}
                    className={cn(
                      "absolute left-0 top-0 z-10 h-full w-full rounded-sm",
                      themeColor == "teal" ? "bg-teal" : "bg-orange-red"
                    )}
                  />
                )}
              </Link>
            ))}
          </TabsList>
        </div>
        {selectedTab == "tareas" && <TaskList />}
        {selectedTab == "rutinas" && <RoutineList />}
      </Tabs>
    </Layout>
  );
}
