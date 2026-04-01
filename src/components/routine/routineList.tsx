import { motion } from "framer-motion";
import RoutineCard from "./routineCard";
import { useUser } from "~/lib/UserContext";
import { api } from "~/utils/api";
import { RoutineSkeleton } from "../ui/skeleton";

const listVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

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
      className="max-lg:padding-footer-xl lg:padding-footer-sm relative mx-auto flex w-full max-w-[980px] flex-col items-center text-lg font-medium"
    >
      {userRoutines.length == 0 && (
        <div className="mt-4 w-full max-w-[760px] rounded-2xl border border-dashed border-gray-300 bg-white/70 px-6 py-9 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-eerie-black">
            Aun no tienes rutinas
          </h2>
          <p className="mt-1 text-sm text-gray-600 sm:text-base">
            Crea una rutina para convertir tareas en hábitos consistentes.
          </p>
        </div>
      )}
      {userRoutines.length > 0 && (
        <>
          <h2 className="my-5 text-xl text-eerie-black">Tus rutinas</h2>
          <motion.ul
            variants={listVariants}
            initial="hidden"
            animate="show"
            className="flex w-full flex-col items-center gap-7"
          >
            {userRoutines.map(
              (routine: {
                id: string;
                days: string;
                name: string;
                category: string | null;
              }) => (
                <motion.li key={routine.id} variants={itemVariants}>
                  <RoutineCard
                    days={routine.days}
                    name={routine.name}
                    category={routine.category || "Otro"}
                    tasks={
                      tasks
                        ?.filter((task) => task.routineId === routine.id)
                        .sort((a, b) => a.routineOrder - b.routineOrder) || []
                    }
                    id={routine.id}
                  />
                </motion.li>
              )
            )}
          </motion.ul>
        </>
      )}
    </motion.div>
  );
}
