import Layout from "~/components/layout";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import Head from "next/head";
import React, { useState } from "react";
import { motion } from "framer-motion";
import TaskList from "../components/task/taskList";
import RoutineList from "../components/routine/routineList";
import { useSession } from "next-auth/react";
import Router from "next/router";
import { messaging } from "../utils/firebase";
import {getToken, onMessage} from "firebase/messaging";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const tabOptions = [
  { value: "tareas", label: "Tareas" },
  { value: "rutinas", label: "Rutinas" },
];

export default function Home() {
  const [selectedTab, setSelectedTab] = useState("tareas");
  const { data: sessionData, status } = useSession();

  React.useEffect(() => {
    onMessage(messaging, (payload) => {
      console.log("Message received. ", payload);
      toast("Tienes una nueva tarea", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
      });
    });
  }, []);

  if (status == "unauthenticated") return void Router.push("/signin");
  if (!sessionData) return;

  const activateNotification = async () => {
    const token = await getToken(messaging, {
      vapidKey: "BP5uRjnZKgTEbIjvIZRcRbpP93jXilaxX9nfuZREoOZeUuz8hwMeXOa3MLgpxFenYTSoBCpClA4wVpqjNgiuzTg" 
    }).catch((err) => {
      console.log(err);
    });
    if(token) {console.log(token)}
    if(!token) {console.log("no token")}
  };

  return (
  activateNotification(),
    <>
      <Head>
        <title>MindFuel</title>
      </Head>
      <Layout sessionData={sessionData}>
        <ToastContainer />
        <button
          className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"        >
          Probar Notificacion
        </button>
        <Tabs defaultValue="tareas" className="h-full w-full">
          <div className="mt-5 flex justify-center">
            <TabsList>
              {tabOptions.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="relative w-1/2"
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
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          <TabsContent value="tareas" className="h-full">
            <TaskList />
          </TabsContent>
          <TabsContent value="rutinas" className="h-full">
            <RoutineList />
          </TabsContent>
        </Tabs>
      </Layout>
    </>
  );
}
