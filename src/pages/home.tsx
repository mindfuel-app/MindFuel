/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import Layout from "~/components/layouts/homeLayout";
import { Tabs, TabsList } from "../components/ui/tabs";
import { motion } from "framer-motion";
import TaskList from "../components/task/taskList";
import RoutineList from "../components/routine/routineList";
import useSwipe from "~/hooks/useSwipe";
import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { cn } from "~/lib/utils";
import { useTheme } from "~/lib/ThemeContext";
import AddButton from "~/components/inputs/addButton";
import {
  CalendarDaysIcon,
  CheckCircleIcon,
  FireIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

const tabOptions = [
  { value: "tareas", label: "Tareas" },
  { value: "rutinas", label: "Rutinas" },
] as const;

export default function Home() {
  const { data: sessionData, status } = useSession();
  const { themeColor } = useTheme();
  const router = useRouter();
  const selectedTab =
    router.query.tab == "rutinas" || router.query.tab == "tareas"
      ? router.query.tab
      : "tareas";

  const { data: tasksData } = api.tasks.getTasks.useQuery(
    {
      user_id: sessionData?.user.id ?? "",
    },
    {
      enabled: Boolean(sessionData?.user.id),
    }
  );

  const { data: routinesData } = api.routines.getRoutines.useQuery(
    {
      user_id: sessionData?.user.id ?? "",
    },
    {
      enabled: Boolean(sessionData?.user.id),
    }
  );
  const swipeHandler = useSwipe({
    onSwipedLeft: () => void router.push("?tab=rutinas"),
    onSwipedRight: () => void router.push("?tab=tareas"),
  });

  useEffect(() => {
    if (!router.isReady) return;

    if (selectedTab !== router.query.tab) {
      void router.replace({
        pathname: router.pathname,
        query: { ...router.query, tab: selectedTab },
      });
    }
  }, [router, selectedTab]);

  const totalTasks = tasksData?.length ?? 0;
  const pendingTasks =
    tasksData?.filter((task: { done: boolean }) => !task.done).length ?? 0;
  const completedToday = totalTasks - pendingTasks;
  const routinesCount = routinesData?.length ?? 0;

  const currentDate = useMemo(
    () =>
      new Date().toLocaleDateString("es-AR", {
        weekday: "long",
        day: "numeric",
        month: "short",
      }),
    []
  );
  if (status == "unauthenticated") return void router.push("/signin");

  if (!sessionData) return;

  return (
    <Layout sessionData={sessionData}>
      <Tabs {...swipeHandler} className="relative h-full w-full">
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-3 w-full rounded-3xl border border-white/70 bg-white/80 p-4 shadow-lg shadow-black/5 backdrop-blur sm:p-6 lg:p-7"
        >
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                <CalendarDaysIcon className="h-4 w-4" />
                {currentDate}
              </div>
              <h1 className="mt-3 text-2xl font-semibold leading-tight tracking-tight text-eerie-black sm:text-3xl lg:text-4xl">
                Hola, {sessionData.user.name}
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-600 sm:text-base">
                Mantiene el enfoque con acciones pequeñas y constantes.
              </p>
            </div>
            <div className="hidden lg:flex">
              <AddButton
                showLabel={true}
                initialTab={selectedTab}
                variant="inline"
              />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard
              title="Pendientes"
              value={pendingTasks}
              icon={<SparklesIcon className="h-4 w-4" />}
              accent={themeColor == "teal" ? "text-teal" : "text-orange-red"}
            />
            <StatCard
              title="Completadas"
              value={completedToday}
              icon={<CheckCircleIcon className="h-4 w-4" />}
              accent="text-cornflower-blue"
            />
            <StatCard
              title="Rutinas"
              value={routinesCount}
              icon={<CalendarDaysIcon className="h-4 w-4" />}
              accent="text-gray-700"
            />
            <StatCard
              title="Streak"
              value={pendingTasks == 0 && totalTasks > 0 ? "On" : "Go"}
              icon={<FireIcon className="h-4 w-4" />}
              accent="text-orange"
            />
          </div>
        </motion.section>

        <div className="mt-5 flex justify-center">
          <TabsList className="w-full max-w-lg rounded-2xl border border-white/70 bg-white/80 p-1 shadow-lg shadow-black/5 backdrop-blur">
            {tabOptions.map((tab) => {
              const isSelected = tab.value == selectedTab;
              const count =
                tab.value == "tareas" ? pendingTasks : routinesCount;

              return (
                <Link
                  href={`?tab=${tab.value}`}
                  key={tab.value}
                  className={cn(
                    "relative inline-flex w-1/2 select-none items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-base font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    isSelected ? "text-white shadow-sm" : "text-gray-700"
                  )}
                >
                  <span className="z-20">{tab.label}</span>
                  <span
                    className={cn(
                      "z-20 rounded-full px-2 py-0.5 text-xs",
                      isSelected ? "bg-white/20 text-white" : "bg-gray-200"
                    )}
                  >
                    {count}
                  </span>
                  {isSelected && (
                    <motion.div
                      layoutId="bg"
                      transition={{
                        type: "spring",
                        bounce: 0,
                        duration: 0.3,
                      }}
                      className={cn(
                        "absolute left-0 top-0 z-10 h-full w-full rounded-xl",
                        themeColor == "teal" ? "bg-teal" : "bg-orange-red"
                      )}
                    />
                  )}
                </Link>
              );
            })}
          </TabsList>
        </div>

        {selectedTab == "tareas" && <TaskList />}
        {selectedTab == "rutinas" && <RoutineList />}
      </Tabs>
    </Layout>
  );
}

function StatCard({
  title,
  value,
  icon,
  accent,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white/90 p-3 shadow-sm">
      <div className="mb-2 flex items-center justify-between text-xs text-gray-500">
        <span>{title}</span>
        <span className={accent}>{icon}</span>
      </div>
      <div className={cn("text-xl font-semibold", accent)}>{value}</div>
    </div>
  );
}
