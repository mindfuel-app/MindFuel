import { EllipsisVerticalIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { CircularProgress } from "@mui/material";
import { Button } from "../ui/button";
import Modal from "../ui/modal";
import { motion, AnimatePresence } from "framer-motion";
import { type FormEvent, useState } from "react";
import { type Task } from "~/hooks/useTasks";
import { useUser } from "~/lib/UserContext";

export default function RoutineForm({
  mode,
  afterSave,
  initialName,
  initialTasks,
}: {
  mode?: "create" | "edit";
  afterSave: () => void;
  initialName?: string;
  initialTasks?: Task[];
}) {
  const user = useUser();
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState(initialName ? initialName : "");
  const [tasks, setTasks] = useState<Task[]>(
    initialTasks
      ? initialTasks
      : [
          {
            id: 1,
            name: "",
            done: false,
            user_id: user.id,
          },
        ]
  );
  const [nameError, setNameError] = useState(false);
  const [emptyTaskError, setEmptyTaskError] = useState(false);

  const addEmptyTask = () => {
    setTasks([
      ...tasks,
      {
        id: tasks.length + 1,
        name: "",
        done: false,
        user_id: user.id,
      },
    ]);
  };

  const removeTask = (indexToRemove: number) => {
    setTasks((prevTasks) => {
      if (indexToRemove == 0) {
        return prevTasks;
      }

      return prevTasks.filter((_, i) => i !== indexToRemove);
    });
  };

  const handleTaskChange = (index: number, value: string) => {
    setTasks((prevTasks) => {
      const updatedTasks = [...prevTasks];
      updatedTasks[index] = {
        id: index + 1,
        name: value,
        done: false,
        user_id: user.id,
      };
      return updatedTasks;
    });
  };

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNameError(false);
    setEmptyTaskError(false);
    setSaving(true);

    if (name == "") {
      setNameError(true);
      setSaving(false);
      return;
    }

    for (const task of tasks) {
      if (task.name == "") {
        setEmptyTaskError(true);
        return setSaving(false);
      }
    }

    // await addRoutine(data)
    setTimeout(() => {
      afterSave();
    }, 1000);
  }

  return (
    <div className="p-5">
      {mode == "edit" && <h2 className="mb-5 text-xl">Editar rutina</h2>}
      <form onSubmit={handleSubmit}>
        <fieldset disabled={saving} className="group">
          <div className="flex flex-col gap-5 group-disabled:opacity-50">
            <label
              className="flex flex-col gap-1"
              onClick={(e) => e.preventDefault()}
            >
              <div className="flex items-center gap-3">
                <span>Nombre de rutina</span>
                {nameError && (
                  <motion.span
                    initial={{ opacity: 0.7 }}
                    animate={{ opacity: 1 }}
                    className="mt-1 text-xs text-red-500 "
                  >
                    Ingrese un nombre
                  </motion.span>
                )}
              </div>
              <input
                type="text"
                className="rounded-lg border-2 border-gray-500 px-2 py-1 outline-none focus:border-gray-700"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label
              className="flex flex-col gap-3"
              onClick={(e) => e.preventDefault()}
            >
              <div className="flex items-center">
                <span>Tareas</span>
                <Button
                  className="no-highlight h-6 w-10 text-xl text-teal"
                  onClick={() => {
                    addEmptyTask();
                  }}
                >
                  +
                </Button>
                {emptyTaskError && (
                  <motion.span
                    initial={{ opacity: 0.7 }}
                    animate={{ opacity: 1 }}
                    className="mt-1 text-xs text-red-500 "
                  >
                    Complete los campos
                  </motion.span>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <AnimatePresence>
                  {tasks.map((task, index) => (
                    <motion.div
                      initial={{
                        y: task.name == "" ? -3 : 0,
                        x: 0,
                        opacity: task.name == "" ? 0.5 : 1,
                      }}
                      animate={{
                        y: 0,
                        x: 0,
                        opacity: 1,
                      }}
                      exit={{ x: 10, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-2"
                      key={task.id}
                    >
                      <div className="no-highlight flex cursor-pointer justify-center rounded-sm py-2 transition-colors active:bg-gray-200 lg:hover:bg-gray-200">
                        <EllipsisVerticalIcon className="h-5 w-5 text-xl" />
                        <EllipsisVerticalIcon className="-ml-[14px] h-5 w-5 text-xl" />
                      </div>
                      <input
                        type="text"
                        className="w-full rounded-lg border-2 border-gray-500 px-2 py-1 outline-none focus:border-gray-700"
                        value={tasks[index]?.name}
                        onChange={(e) =>
                          handleTaskChange(index, e.target.value)
                        }
                      />
                      <XMarkIcon
                        className={`no-highlight h-6 w-6 cursor-pointer text-gray-500 hover:text-gray-600 ${
                          task.id == 1 ? "cursor-default opacity-0" : ""
                        }`}
                        onClick={() => removeTask(index)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </label>
          </div>
          <div className="no-highlight mt-8 space-x-1 text-right">
            <Modal.Close className="text rounded-md bg-transparent px-4 py-2 text-base text-teal">
              Cancelar
            </Modal.Close>
            <Button className="rounded-md bg-teal px-4 py-2 text-base font-medium text-white active:bg-teal/80 group-disabled:pointer-events-none">
              <CircularProgress
                color="inherit"
                size={20}
                className="absolute group-enabled:opacity-0"
              />
              <span className="group-disabled:opacity-0">Guardar</span>
            </Button>
          </div>
        </fieldset>
      </form>
    </div>
  );
}
