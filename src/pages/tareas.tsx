import Layout from "~/components/layout";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import TaskCard from "~/components/taskCard";
import RoutineCard from "~/components/routineCard";

//const UserTasks = getTasks();
const userTasks = [
  { id: 1, numeroTarea: 1, nombreTarea: "Terminar tarea" },
  { id: 2, numeroTarea: 2, nombreTarea: "Cocinar" },
];

// const userRoutines = getRoutines();
const userRoutines = [
  { id: 1, nombre: "Rutina mañana", descripcion: "Todos los dias hábiles" },
];

export default function Tareas() {
  return (
    <Layout>
      <Tabs defaultValue="tareas" className="h-full w-full">
        <div className="flex justify-center">
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
          <div className="flex h-full flex-col">
            <h2 className="my-5 font-medium">Tareas pendientes de hoy</h2>
            <div className="mb-14 h-full rounded-md bg-[#D9D9D9]">
              <div className="flex flex-col items-center p-5">
                <ul className="flex flex-col gap-3">
                  {userTasks.map((task) => (
                    <TaskCard
                      numeroTarea={task.numeroTarea}
                      nombreTarea={task.nombreTarea}
                      key={task.id}
                    />
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="rutinas">
          <div className="flex flex-col">
            <h2 className="my-5 font-medium">Tus rutinas</h2>
            <div className="mb-14 h-full rounded-md bg-[#D9D9D9]">
              <div className="flex flex-col items-center p-5">
                <ul className="flex flex-col gap-3">
                  {userRoutines.map((routine) => (
                    <RoutineCard
                      nombre={routine.nombre}
                      descripcion={routine.descripcion}
                      key={routine.id}
                    />
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Layout>
  );
}
