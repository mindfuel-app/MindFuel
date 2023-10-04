import Layout from "~/components/layouts/homeLayout";
import { Tabs, TabsList } from "../components/ui/tabs";
import Head from "next/head";
import { motion } from "framer-motion";
import TaskList from "../components/task/taskList";
import RoutineList from "../components/routine/routineList";
import { useSession } from "next-auth/react";
import Router from "next/router";
import useSwipe from "~/hooks/useSwipe";
import { registerServiceWorker } from "~/utils/registerPushSuscription";
import { askPermission } from "~/utils/registerPushSuscription";
import { subscribeUserToPush } from "~/utils/registerPushSuscription";
import { useNotifications } from "~/hooks/useNotifications";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import AddButton from "~/components/addButton";
import { useEffect, useState } from "react";
import { useUser } from "~/lib/UserContext";
import { api } from "~/utils/api";
import { json } from "stream/consumers";


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

  const swipeLeftHandler = useSwipe({
    onSwipedLeft: () => router.push("?tab=rutinas"),
  });

  const swipeRightHandler = useSwipe({
    onSwipedRight: () => router.push("?tab=tareas"),
  });
  const permission = useNotifications();
  const [pushSubscription, setPushSubscription] = useState<PushSubscription>();
  const { mutate: addPush } = api.pushSuscriptions.addPush.useMutation();
  const {mutate: sendPush} = api.pushSuscriptions.sendPushToOne.useMutation()

  useEffect(() => console.log(pushSubscription), [pushSubscription]);
  

  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      // Service Worker isn't supported on this browser, disable or hide UI.
      throw new Error(
        "Service Worker not supported, we need Notification API support"
      );
    }
  
    if (!("PushManager" in window)) {
      // Push isn't supported on this browser, disable or hide UI.
      throw new Error("Push not supported, we need Notification API support");
    }
    if (permission == "granted" && sessionData?.user.id) {
      void navigator.serviceWorker
        .register("./push-sw.js")
        .then(function (registration) {
          const subscribeOptions = {
            userVisibleOnly: true,
            applicationServerKey:
              "BJw57keq3mApSgaxzVzpdNMmViHi4EG5zTXalzO3ktWP4PXDHHW0qXTCfrJuZYF4ehzGI6yOI1jATxXcfo2W5Ww",
          };

          return registration.pushManager.subscribe(subscribeOptions);
        })
        .then((pushSubscription) => {
          const pushJSON = pushSubscription.toJSON()
          if(!pushJSON.keys || !pushJSON.endpoint) return 
          console.log(JSON.stringify(pushJSON))
          addPush({
          userId: sessionData.user.id,
          PushSubscription: JSON.stringify(pushJSON)
        })});
    }
  }, [permission]);

  if (status == "unauthenticated") return void Router.push("/signin");

  if (!sessionData) return;

  // registerServiceWorker().catch((error) => console.error(error));
  // console.log(
  //   askPermission(sessionData.user.id).catch((error) => console.error(error))
  // );
  function sendNotification(){
    if(!sessionData) return;
    const user_Id = sessionData.user.id
    const Notification = sendPush({user_id:user_Id, title:"Welcome to MindFuel", body:"This is a test notification"})
    console.log(Notification)
  }

  return (
    <>
      <Head>
        <title>MindFuel</title>
      </Head>
      <Layout sessionData={sessionData}>
        <Tabs className="h-full w-full">
        
          <div className="mt-5 flex justify-center">
            
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
            <button className="rounded-sm bg-teal p-2 border-2 border-indigo-600" onClick={sendNotification}>Send Notification</button>
          </div>
          {selectedTab == "tareas" && (
            <div {...swipeLeftHandler} className="h-full">
              <TaskList />
            </div>
          )}
          {selectedTab == "rutinas" && (
            <div {...swipeRightHandler} className="h-full">
              <RoutineList />
            </div>
          )}
        </Tabs>
        <div className="fixed bottom-[120px] right-[80px] lg:hidden">
          <AddButton />
        </div>
      </Layout>
    </>
  );
}
