import { motion } from "framer-motion";
import RoutineCard from "./routineCard";
import { useUser } from "~/lib/UserContext";
import { api } from "~/utils/api";
import { RoutineSkeleton } from "../ui/skeleton";

// const userRoutines = [
//   {
//     id: "1",
//     name: "Rutina mañana",
//     description: "Todos los dias hábiles",
//     tasks: [],
//   },
//   {
//     id: "2",
//     name: "Rutina tarde",
//     description: "Todos los dias",
//     tasks: [],
//   },
// ];

export default function RoutineList() {
  const user = useUser();
  const { data: userRoutines, isLoading } = api.routines.getRoutines.useQuery({
    user_id: user.id,
  });

  if (isLoading) return <RoutineSkeleton />;

  if (!userRoutines)
    return (
      <div className="mt-10 flex justify-center text-center font-medium sm:text-lg">
        <p className="max-w-[300px] sm:max-w-[400px]">
          No se pudo obtener la información deseada. Intentelo de nuevo más
          tarde
        </p>
      </div>
    );

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
                description="Todos los dias"
                tasks={[]}
                key={routine.id}
              />
            ))}
          </ul>
        </>
      )}
    </motion.div>
  );
}
