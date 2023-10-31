import Layout from "~/components/layouts/homeLayout";
import { Tabs, TabsList } from "../components/ui/tabs";
import { motion } from "framer-motion";
import TaskList from "../components/task/taskList";
import RoutineList from "../components/routine/routineList";
import { useSession } from "next-auth/react";
import Router from "next/router";
import useSwipe from "~/hooks/useSwipe";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import AddButton from "~/components/addButton";
import { useNotifications } from "~/hooks/useNotifications";
import { useEffect } from "react";
import { api } from "~/utils/api";

const tabOptions = [
  { value: "tareas", label: "Tareas" },
  { value: "rutinas", label: "Rutinas" },
];

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedTab =
    searchParams.get("tab") == "tareas" || searchParams.get("tab") == "rutinas"
      ? searchParams.get("tab")
      : "tareas";

  const { data: sessionData, status } = useSession();
  const permission = useNotifications();
  const { mutate: addPushSubscription } =
    api.pushSuscriptions.addPush.useMutation({
      onSuccess: () => {
        console.log("Subscription added");
      },
      onError: (error) => {
        console.error(error);
      },
    });
  const swipeHandler = useSwipe({
    onSwipedLeft: () => router.push("?tab=rutinas"),
    onSwipedRight: () => router.push("?tab=tareas"),
  });

  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      throw new Error("Service worker not found");
    }

    if (!("PushManager" in window)) {
      throw new Error("Push manager not found");
    }

    if (permission == "granted" && sessionData?.user.id) {
      void navigator.serviceWorker
        .register("./push-sw.js")
        .then((registration) => {
          const subscribeOptions = {
            userVisibleOnly: true,
            applicationServerKey:
              "BJw57keq3mApSgaxzVzpdNMmViHi4EG5zTXalzO3ktWP4PXDHHW0qXTCfrJuZYF4ehzGI6yOI1jATxXcfo2W5Ww",
          };

          return registration.pushManager.subscribe(subscribeOptions);
        })
        .then((pushSubscription) => {
          const pushJson = pushSubscription.toJSON();
          if (!pushJson.keys || !pushJson.endpoint) return;
          addPushSubscription({
            userId: sessionData.user.id,
            PushSubscription: JSON.stringify(pushJson),
          });
        });
    }
  }, [addPushSubscription, permission, sessionData?.user.id]);

  if (status == "unauthenticated") return void Router.push("/signin");

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
                  ${
                    selectedTab == tab.value
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
                    className="absolute left-0 top-0 z-10 h-full w-full rounded-sm bg-teal"
                  ></motion.div>
                )}
              </Link>
            ))}
          </TabsList>
        </div>
        {selectedTab == "tareas" && <TaskList />}
        {selectedTab == "rutinas" && <RoutineList />}
      </Tabs>
      <div className="fixed bottom-[100px] right-[80px] lg:hidden">
        <AddButton />
      </div>
    </Layout>
  );
}
