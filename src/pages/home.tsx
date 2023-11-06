import Layout from "~/components/layouts/homeLayout";
import { Tabs, TabsList } from "../components/ui/tabs";
import { motion } from "framer-motion";
import TaskList from "../components/task/taskList";
import RoutineList from "../components/routine/routineList";
import useSwipe from "~/hooks/useSwipe";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useNotifications } from "~/hooks/useNotifications";
import { useEffect } from "react";
import { api } from "~/utils/api";
import type { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import type { Session } from "next-auth";

interface PageProps {
  sessionData: Session;
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  context
) => {
  const sessionData = await getSession(context);

  if (!sessionData) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  }

  return {
    props: {
      sessionData,
    },
  };
};

const tabOptions = [
  { value: "tareas", label: "Tareas" },
  { value: "rutinas", label: "Rutinas" },
];

export default function Home({ sessionData }: PageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedTab =
    searchParams.get("tab") == "tareas" || searchParams.get("tab") == "rutinas"
      ? searchParams.get("tab")
      : "tareas";

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

    if (permission == "granted") {
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
  }, [addPushSubscription, permission, sessionData.user.id]);

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
