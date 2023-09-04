import Layout from "~/components/layout";
import { Tabs, TabsList } from "../components/ui/tabs";
import Head from "next/head";
import { useState } from "react";
import { motion } from "framer-motion";
import TaskList from "../components/task/taskList";
import RoutineList from "../components/routine/routineList";
import { useSession } from "next-auth/react";
import Router from "next/router";
import useSwipe from "~/hooks/useSwipe";

const tabOptions = [
  { value: "tareas", label: "Tareas" },
  { value: "rutinas", label: "Rutinas" },
];

export default function Home() {
  const [selectedTab, setSelectedTab] = useState("tareas");
  const { data: sessionData, status } = useSession();

  const swipeLeftHandler = useSwipe({
    onSwipedLeft: () => {
      setSelectedTab("rutinas");
    },
  });

  const swipeRightHandler = useSwipe({
    onSwipedRight: () => {
      setSelectedTab("tareas");
    },
  });

  if (status == "unauthenticated") return void Router.push("/signin");

  if (!sessionData) return;

  Notification.requestPermission().catch((err) => {
    alert(err);
  });

  const sendNotification = () => {
    new Notification("Bienvenido a MindFuel");
  };

  return (
    <>
      <Head>
        <title>MindFuel</title>
      </Head>
      <Layout sessionData={sessionData}>
        <button
          className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          onClick={() => sendNotification()}
        >
          Probar Notificacion
        </button>
        <Tabs className="h-screen w-full">
          <div className="mt-5 flex justify-center">
            <TabsList>
              {tabOptions.map((tab) => (
                <button
                  key={tab.value}
                  className={`relative inline-flex w-1/2 select-none items-center justify-center whitespace-nowrap rounded-sm px-5 py-1.5 text-lg font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50
                  ${
                    selectedTab == tab.value
                      ? "text-foreground text-white shadow-sm"
                      : ""
                  }
                  `}
                  onClick={() => setSelectedTab(tab.value)}
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
                </button>
              ))}
            </TabsList>
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
      </Layout>
    </>
  );
}
