import {
  CalendarDaysIcon,
  CheckIcon,
  EllipsisVerticalIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import { type FormEvent, useState, useRef } from "react";
import { useTasks, type Task } from "~/hooks/useTasks";
import { Button } from "../ui/button";
import Modal from "../ui/modal";
import { CircularProgress } from "@mui/material";
import toast from "react-hot-toast";
import { useUser } from "~/lib/UserContext";
import { Calendar } from "../ui/calendar";
import { api } from "~/utils/api";

export default function TaskForm({ afterSave }: { afterSave: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const user = useUser();
  const { createTasks } = useTasks({
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
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      name: "",
      description: null,
      category: null,
      deadline: null,
      routine_id: null,
      event_id: null,
      estimated_time: null,
      done: false,
      real_time: null,
      user_id: user.id,
      required_energy: null,
    },
  ]);
  const [emptyTaskError, setEmptyTaskError] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState("");
  const [activeTaskIndex, setActiveTaskIndex] = useState<number>();

  const addEmptyTask = () => {
    setTasks([
      ...tasks,
      {
        id: (tasks.length + 1).toString(),
        name: "",
        description: null,
        category: null,
        deadline: null,
        routine_id: null,
        event_id: null,
        estimated_time: null,
        done: false,
        real_time: null,
        user_id: user.id,
        required_energy: null,
      },
    ]);
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  const removeTask = (indexToRemove: number) => {
    setTasks((prevTasks) => {
      return prevTasks.filter((_, i) => i !== indexToRemove);
    });
  };

  const handleTaskChange = (index: number, value: string) => {
    setTasks((prevTasks) => {
      const updatedTasks = [...prevTasks];
      updatedTasks[index] = {
        id: (index + 1).toString(),
        name: value,
        description: null,
        category: null,
        deadline: null,
        routine_id: null,
        event_id: null,
        estimated_time: null,
        done: false,
        real_time: null,
        user_id: user.id,
        required_energy: null,
      };
      return updatedTasks;
    });
  };

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setEmptyTaskError(false);
    setSaving(true);

    for (const task of tasks) {
      if (task.name == "") {
        setEmptyTaskError(true);
        return setSaving(false);
      }
    }

    setTimeout(() => {
      createTasks({
        tasks: tasks,
      });
      afterSave();
    }, 1000);
  }

  if (isCalendarOpen && activeTaskIndex !== undefined)
    return (
      <CalendarForm
        taskId={activeTaskId}
        taskIndex={activeTaskIndex}
        afterSave={() => {
          setIsCalendarOpen(false);
          const date = localStorage.getItem(`${activeTaskIndex}`);
          if (date) {
            setTasks((prevTasks) => {
              const updatedTasks = [...prevTasks];
              updatedTasks[activeTaskIndex] = {
                ...updatedTasks[activeTaskIndex],
                deadline: new Date(date),
              } as Task;
              return updatedTasks;
            });
          }
        }}
      />
    );

  return (
    <div className="p-5">
      <form onSubmit={handleSubmit}>
        <fieldset disabled={saving} className="group">
          <div className="flex flex-col gap-5 group-disabled:opacity-50">
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
              <div
                ref={containerRef}
                className="flex max-h-[200px] flex-col gap-3 overflow-y-auto overflow-x-hidden scrollbar-track-white scrollbar-thumb-slate-200 lg:scrollbar-thin"
              >
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
                      className="-mx-1 flex items-center gap-2"
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
                      <div
                        onClick={() => {
                          setActiveTaskId(task.id);
                          setActiveTaskIndex(index);
                          setIsCalendarOpen(true);
                        }}
                        className="no-highlight cursor-pointer rounded-full"
                      >
                        <CalendarDaysIcon className="h-6 w-6" />
                      </div>
                      <XMarkIcon
                        className={`no-highlight h-6 w-6 cursor-pointer text-gray-500 hover:text-gray-600 ${
                          index == 0 ? "cursor-auto opacity-0" : ""
                        }`}
                        onClick={() => {
                          if (index != 0) removeTask(index);
                        }}
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
            <Button className="rounded-md bg-teal px-4 py-2 text-base font-medium text-white group-disabled:pointer-events-none active:bg-teal/80">
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

function CalendarForm({
  taskId,
  taskIndex,
  afterSave,
}: {
  taskId?: string;
  taskIndex: number;
  afterSave: () => void;
}) {
  const { data: task } = api.tasks.getTaskById.useQuery({
    id: taskId || "",
  });
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <motion.div
      initial={{ opacity: 0.7, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-5"
    >
      <div className="no-highlight flex w-full justify-end active:text-gray-600 lg:hover:text-gray-600">
        <div className="flex w-full items-center justify-between">
          <h2 className="text-lg">Fecha de vencimiento</h2>
          <XMarkIcon
            className="h-5 w-5 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              afterSave();
            }}
          />
        </div>
      </div>
      <div className="flex flex-col items-center gap-5 pt-2">
        <Calendar mode="single" selected={date} onSelect={setDate} />
        <Button
          onClick={() => {
            if (date) localStorage.setItem(`${taskIndex}`, date.toString());
            afterSave();
          }}
          className="no-highlight h-10 w-10 rounded-full bg-[#5c7aff] p-2"
        >
          <CheckIcon className="h-16 w-16" />
        </Button>
      </div>
    </motion.div>
  );
}
