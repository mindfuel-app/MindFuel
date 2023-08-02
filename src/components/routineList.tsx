import { motion } from "framer-motion";
import RoutineCard from "./routineCard";

export default function RoutineList() {
  // const {data: userRoutines, isLoading} = api.routines.getRoutines.useQuery({});

  const userRoutines = [
    {
      id: "1",
      name: "Rutina mañana",
      description: "Todos los dias hábiles",
      tasks: [],
    },
    {
      id: "2",
      name: "Rutina tarde",
      description: "Todos los dias",
      tasks: [],
    },
  ];

  return (
    <motion.div
      initial={{ x: -10, opacity: 0 }}
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
                name={routine.name}
                description={routine.description}
                tasks={routine.tasks}
                key={routine.id}
              />
            ))}
          </ul>
        </>
      )}
    </motion.div>
  );
}
