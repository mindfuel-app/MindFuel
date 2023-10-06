import {
  ArrowPathIcon,
  CalendarDaysIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { type FormEvent, useState } from "react";
import { useTasks } from "~/hooks/useTasks";
import { Button } from "../ui/button";
import Modal from "../ui/modal";
import { CircularProgress } from "@mui/material";
import toast from "react-hot-toast";
import { useUser } from "~/lib/UserContext";
import { Calendar } from "../ui/calendar";

type Task = {
  id: string;
  name: string;
  deadline: Date | null;
  description: string;
};

export default function TaskForm({
  mode,
  id,
  initialName,
  initialDeadline,
  initialDescription,
  afterSave,
}: {
  mode: "create" | "edit";
  id?: string;
  initialName?: string;
  initialDeadline?: Date | null;
  initialDescription?: string;
  afterSave: () => void;
}) {
  const user = useUser();
  const { createTask, editTask, deleteTask } = useTasks({
    onSuccess: () => {
      setSaving(false);
      afterSave();
    },
    onError: (e) => {
      setSaving(false);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      toast.error(e.message);
    },
  });
  const [saving, setSaving] = useState(false);
  const [task, setTask] = useState<Task>({
    id: id || "",
    name: initialName || "",
    deadline: initialDeadline || null,
    description: initialDescription || "",
  });
  const [emptyTaskError, setEmptyTaskError] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setEmptyTaskError(false);
    setSaving(true);

    if (task.name == "") {
      setEmptyTaskError(true);
      return setSaving(false);
    }

    setTimeout(() => {
      if (mode == "edit" && id) {
        editTask({
          task: { ...task, user_id: user.id },
        });
      } else {
        createTask({
          task: { ...task, user_id: user.id },
        });
      }

      afterSave();
    }, 1000);
  }

  if (isCalendarOpen) {
    return (
      <CalendarForm
        taskName={mode == "edit" ? task.name : null}
        initialDate={task.deadline}
        afterSave={() => {
          setIsCalendarOpen(false);
          const date = localStorage.getItem("deadline");
          if (date) {
            setTask({ ...task, deadline: new Date(date) });
          }
          localStorage.removeItem("deadline");
        }}
      />
    );
  }

  return (
    <div className="p-5">
      {mode == "edit" && <h2 className="mb-5 text-xl">Editar tarea</h2>}
      <form onSubmit={handleSubmit}>
        <fieldset disabled={saving} className="group">
          <motion.div
            initial={{ x: 10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-5 group-disabled:opacity-50"
          >
            <label
              className="flex flex-col gap-2"
              onClick={(e) => e.preventDefault()}
            >
              <div className="flex items-center gap-4">
                Nombre
                {emptyTaskError && (
                  <motion.span
                    initial={{ opacity: 0.7 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-red-500 "
                  >
                    Complete los campos
                  </motion.span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  className="w-full rounded-lg border-2 border-gray-500 px-2 py-1 outline-none focus:border-gray-700"
                  value={task.name}
                  onChange={(e) => {
                    e.preventDefault();
                    setTask({ ...task, name: e.target.value });
                  }}
                />
              </div>
            </label>
            <label
              onClick={(e) => e.preventDefault()}
              className="flex flex-col gap-2"
            >
              Fecha de vencimiento
              <div className="flex items-center gap-3">
                <div className="flex w-[150px] items-center justify-between gap-4 rounded-lg border-2 border-gray-500 p-2 pl-3">
                  {task.deadline
                    ? task.deadline.toLocaleDateString()
                    : "--/--/--"}
                  <div
                    onClick={() => {
                      setIsCalendarOpen(true);
                    }}
                    className="no-highlight cursor-pointer rounded-full"
                  >
                    <CalendarDaysIcon className="h-6 w-6" />
                  </div>
                </div>
                <Button
                  onClick={() => {
                    setTask({ ...task, deadline: null });
                  }}
                  className="no-highlight p-2"
                >
                  <ArrowPathIcon className="h-6 w-6 text-gray-900" />
                </Button>
              </div>
            </label>
            <label
              onClick={(e) => e.preventDefault()}
              className="flex flex-col gap-2"
            >
              Descripcion
              <textarea
                className="h-20 w-full resize-none rounded-lg border-2 border-gray-500 px-2 py-1 outline-none focus:border-gray-700"
                value={task.description}
                onChange={(e) => {
                  e.preventDefault();
                  setTask({ ...task, description: e.target.value });
                }}
              />
            </label>
          </motion.div>
          <div
            className={`flex pt-9 ${
              mode == "edit" ? "justify-between" : "justify-end"
            }`}
          >
            {mode == "edit" && id && (
              <div
                onClick={() => deleteTask({ id })}
                className="no-highlight flex cursor-pointer items-center rounded-md border-[1px] border-red-500 p-2 text-red-500 transition-colors active:bg-red-500 active:text-white lg:hover:bg-red-500 lg:hover:text-white"
              >
                <TrashIcon className="h-5 w-5" />
              </div>
            )}
            <div className="no-highlight space-x-1 text-right">
              <Modal.Close className="text rounded-md bg-transparent px-4 py-2 text-base text-teal">
                Cancelar
              </Modal.Close>
              <Button className="rounded-md bg-teal px-4 py-2 text-base font-medium text-white group-disabled:pointer-events-none active:bg-teal/80">
                <CircularProgress
                  color="inherit"
                  size={20}
                  className="absolute group-enabled:opacity-0"
                />
                <span className="group-disabled:opacity-0">Guardar</span>
              </Button>
            </div>
          </div>
        </fieldset>
      </form>
    </div>
  );
}

function CalendarForm({
  taskName,
  initialDate,
  afterSave,
}: {
  taskName: string | null;
  initialDate?: Date | null;
  afterSave: () => void;
}) {
  const [date, setDate] = useState<Date | undefined>(initialDate || new Date());

  return (
    <div className="p-5">
      {taskName && <h2 className="mb-6 text-xl">Editar tarea</h2>}
      <div className="-mt-5 flex flex-col items-center gap-3">
        <Calendar mode="single" selected={date} onSelect={setDate} />
        <div className="no-highlight flex w-full justify-end gap-1 text-right">
          <Button
            onClick={(e) => {
              e.preventDefault();
              afterSave();
            }}
            className="text rounded-md bg-transparent px-4 py-2 text-base text-teal"
          >
            Cancelar
          </Button>
          <Button
            onClick={() => {
              if (date) localStorage.setItem("deadline", date.toString());
              afterSave();
            }}
            className="rounded-md bg-teal px-4 py-2 text-base font-medium text-white group-disabled:pointer-events-none active:bg-teal/80"
          >
            <span className="group-disabled:opacity-0">Guardar</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
