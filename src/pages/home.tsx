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

export default function Home() {
  return (
    <>
      <Head>
        <title>MindFuel</title>
      </Head>
      <Layout>
        <Tabs defaultValue="tareas" className="h-full w-full">
          <div className="mt-5 flex justify-center">
            <TabsList>
              <TabsTrigger value="tareas" className="w-1/2">
                Tareas
              </TabsTrigger>
              <TabsTrigger value="rutinas" className="w-1/2">
                Rutinas
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="tareas" className="h-full">
            <div className="flex h-full flex-col items-center pb-16 text-lg font-medium">
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
            </div>
          </TabsContent>
          <TabsContent value="rutinas" className="h-full">
            <div className="flex h-full flex-col items-center pb-16 text-lg font-medium">
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
            </div>
          </TabsContent>
        </Tabs>
      </Layout>
    </>
  );
}
