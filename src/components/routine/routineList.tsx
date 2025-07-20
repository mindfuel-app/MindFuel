import { motion } from "framer-motion";
import RoutineCard from "./routineCard";
import { useUser } from "~/contexts/UserContext";
import { api } from "~/utils/api";
import { RoutineSkeleton } from "../ui/skeleton";

export default function RoutineList() {
  const user = useUser();
  const { data: userRoutines, isLoading } = api.routines.getRoutines.useQuery({
    user_id: user.id,
  });
  const { data: tasks } = api.tasks.getTasksForRoutine.useQuery({
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
      className="max-lg:padding-footer-xl lg:padding-footer-sm relative flex flex-col items-center text-lg font-medium"
    >
      {userRoutines.length == 0 && (
        <h2 className="my-5">No hay rutinas cargadas</h2>
      )}
      {userRoutines.length > 0 && (
        <>
          <h2 className="my-5">Tus rutinas</h2>
          <ul className="flex flex-col gap-7">
            {userRoutines.map((routine) => (
              <RoutineCard
                days={routine.days}
                name={routine.name}
                category={routine.category || "Otro"}
                tasks={
                  tasks
                    ?.filter((task) => task.routineId == routine.id)
                    .sort((a, b) => a.routineOrder - b.routineOrder) || []
                }
                id={routine.id}
                key={routine.id}
              />
            ))}
          </ul>
        </>
      )}
    </motion.div>
  );
}
