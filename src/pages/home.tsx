import Layout from "~/components/layout";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { type Task, TaskCard } from "~/components/taskCard";
import { type Routine, RoutineCard } from "~/components/routineCard";
import Head from "next/head";
import { useState } from "react";
import { motion } from "framer-motion";

//const UserTasks = getTasks();
const userTasks: Task[] = [
  { id: 1, numeroTarea: 1, nombreTarea: "Terminar tarea" },
  { id: 2, numeroTarea: 2, nombreTarea: "Cocinar" },
];

// const userRoutines = getRoutines();
const userRoutines: Routine[] = [
  {
    id: 1,
    nombre: "Rutina mañana",
    descripcion: "Todos los dias hábiles",
    tareas: userTasks,
  },
  {
    id: 2,
    nombre: "Rutina tarde",
    descripcion: "Todos los dias",
    tareas: userTasks,
  },
];

const tabOptions = [
  { value: "tareas", label: "Tareas" },
  { value: "rutinas", label: "Rutinas" },
];

export default function Home() {
  const [selectedTab, setSelectedTab] = useState("tareas");
  const xTranslation = 10;

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
            <motion.div
              initial={{ x: xTranslation, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex h-full flex-col items-center pb-16 text-lg font-medium"
            >
              {userTasks.length == 0 && (
                <h1 className="my-5">No hay tareas cargadas</h1>
              )}
              {userTasks.length > 0 && (
                <>
                  <h2 className="my-5">Tareas pendientes de hoy</h2>
                  <ul className="flex w-72 flex-col gap-3">
                    {userTasks.map((task) => (
                      <TaskCard
                        numeroTarea={task.numeroTarea}
                        nombreTarea={task.nombreTarea}
                        key={task.id}
                      />
                    ))}
                  </ul>
                </>
              )}
            </motion.div>
          </TabsContent>
          <TabsContent value="rutinas" className="h-full">
            <motion.div
              initial={{ x: -xTranslation, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex h-full flex-col items-center pb-16 text-lg font-medium"
            >
              {userRoutines.length == 0 && (
                <h1 className="my-5">No hay rutinas cargadas</h1>
              )}
              {userRoutines.length > 0 && (
                <>
                  <h2 className="my-5">Tus rutinas</h2>
                  <ul className="flex flex-col gap-5">
                    {userRoutines.map((routine) => (
                      <RoutineCard
                        nombre={routine.nombre}
                        descripcion={routine.descripcion}
                        tareas={routine.tareas}
                        key={routine.id}
                      />
                    ))}
                  </ul>
                </>
              )}
            </motion.div>
          </TabsContent>
        </Tabs>
      </Layout>
    </>
  );
}
