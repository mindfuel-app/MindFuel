import Layout from "~/components/layout";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import Head from "next/head";
import { useState } from "react";
import { motion } from "framer-motion";
import TaskList from "../components/taskList";
import RoutineList from "../components/routineList";

const tabOptions = [
  { value: "tareas", label: "Tareas" },
  { value: "rutinas", label: "Rutinas" },
];

export default function Home() {
  const [selectedTab, setSelectedTab] = useState("tareas");

  return (
    <>
      <Head>
        <title>MindFuel</title>
      </Head>
      <Layout>
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
