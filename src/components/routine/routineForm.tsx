import {
  ClockIcon,
  EllipsisVerticalIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { CircularProgress } from "@mui/material";
import { Button } from "../ui/button";
import Modal from "../ui/modal";
import { motion, AnimatePresence } from "framer-motion";
import { type FormEvent, useState, useRef } from "react";
import { type Task } from "~/hooks/useTasks";
import { useUser } from "~/lib/UserContext";
import toast from "react-hot-toast";
import { dayOptions, orderDays } from "~/lib/days";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useRoutines } from "~/hooks/useRoutines";
import TimeForm from "../timeForm";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "~/lib/utils";
import { Command, CommandGroup, CommandItem } from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

const categories = [
  {
    value: "fitness",
    label: "Fitness",
  },
  {
    value: "higiene",
    label: "Higiene",
  },
  {
    value: "salud",
    label: "Salud",
  },
  {
    value: "trabajo",
    label: "Trabajo",
  },
  {
    value: "estudio",
    label: "Estudio",
  },
  {
    value: "otro",
    label: "Otro",
  },
];

export default function RoutineForm({
  mode,
  afterSave,
  id,
  initialDays,
  initialName,
  initialCategory,
  initialTasks,
}: {
  mode?: "create" | "edit";
  afterSave: () => void;
  id?: string;
  initialDays?: string;
  initialName?: string;
  initialCategory?: string;
  initialTasks?: Task[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const user = useUser();
  const { createRoutine, editRoutine, deleteRoutine } = useRoutines({
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
  const [days, setDays] = useState(initialDays ? initialDays : "");
  const [name, setName] = useState(initialName ? initialName : "");
  const [selectedCategory, setSelectedCategory] = useState(
    initialCategory ? initialCategory : ""
  );
  const [tasks, setTasks] = useState<Task[]>(
    initialTasks
      ? initialTasks
      : [
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
        ]
  );
  const [nameError, setNameError] = useState(false);
  const [emptyTaskError, setEmptyTaskError] = useState(false);
  const [isClockOpen, setIsClockOpen] = useState(false);
  const [isComboboxOpen, setIsComboboxOpen] = useState(false);
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
    setNameError(false);
    setEmptyTaskError(false);
    setSaving(true);

    if (name == "") {
      setNameError(true);
      return setSaving(false);
    }

    for (const task of tasks) {
      if (task.name == "") {
        setEmptyTaskError(true);
        return setSaving(false);
      }
    }

    setTimeout(() => {
      if (mode == "edit" && id) {
        editRoutine({
          routine: {
            id,
            name,
            category: selectedCategory,
            user_id: user.id,
            days: orderDays(days),
            tasks,
          },
        });
      } else {
        createRoutine({
          routine: { name, user_id: user.id, days: orderDays(days), tasks },
        });
      }

      afterSave();
    }, 1000);
  }

  if (isClockOpen && activeTaskIndex !== undefined) {
    return (
      <TimeForm
        taskId={activeTaskId}
        taskIndex={activeTaskIndex}
        afterSave={() => {
          setIsClockOpen(false);
          const time = localStorage.getItem(`${activeTaskIndex}`);
          if (time) {
            setTasks((prevTasks) => {
              const updatedTasks = [...prevTasks];
              updatedTasks[activeTaskIndex] = {
                ...updatedTasks[activeTaskIndex],
                estimated_time: Number(time),
              } as Task;
              return updatedTasks;
            });
          }
          localStorage.removeItem(`${activeTaskIndex}`);
        }}
      />
    );
  }

  return (
    <motion.div
      initial={{ scale: 0.97 }}
      animate={{ scale: 1 }}
      className="p-5"
    >
      {mode == "edit" && <h2 className="mb-5 text-xl">Editar rutina</h2>}
      <form onSubmit={handleSubmit}>
        <fieldset disabled={saving} className="group">
          <div className="flex flex-col gap-4 group-disabled:opacity-50">
            <span className="-mt-3">
              {orderDays(days).length == 33
                ? "Todos los dias"
                : orderDays(days).length == 0
                ? "Nunca"
                : orderDays(days)}
            </span>
            <div className="-mt-2 flex justify-between md:justify-around">
              {dayOptions.map((day) => (
                <button
                  key={day.value}
                  className={`no-highlight flex h-7 w-7 items-center justify-center rounded-full active:bg-gray-100 lg:hover:bg-gray-100 ${
                    days.includes(day.value) ? "border-[1px] border-teal" : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    if (!days.includes(day.value)) {
                      if (days == "") return setDays(day.value);
                      return setDays(days + `, ${day.value}`);
                    }
                    if (days.length == 3) return setDays("");
                    if (days.includes(`${day.value}, `))
                      return setDays(days.replace(`${day.value}, `, ""));
                    setDays(days.replace(`, ${day.value}`, ""));
                  }}
                >
                  <span
                    className={`${
                      days.includes(day.value) ? "text-teal" : "text-gray-600"
                    }`}
                  >
                    {day.label}
                  </span>
                </button>
              ))}
            </div>
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
              className="flex flex-col gap-1"
              onClick={(e) => e.preventDefault()}
            >
              <span>Categoría</span>
              <Popover open={isComboboxOpen} onOpenChange={setIsComboboxOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={isComboboxOpen}
                    className="no-highlight w-[200px] justify-between border-gray-400"
                  >
                    {selectedCategory
                      ? categories.find(
                          (category) => category.value === selectedCategory
                        )?.label || "Seleccionar categoría"
                      : "Seleccionar categoría"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandGroup>
                      {categories.map((category) => (
                        <CommandItem
                          key={category.value}
                          onSelect={(currentValue) => {
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                            setSelectedCategory(
                              currentValue === selectedCategory
                                ? ""
                                : currentValue
                            );
                            setIsComboboxOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedCategory === category.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {category.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
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
                          setIsClockOpen(true);
                        }}
                        className="no-highlight cursor-pointer rounded-full"
                      >
                        <ClockIcon className="h-6 w-6" />
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
          <div
            className={`flex pt-8 ${
              mode == "edit" ? "justify-between" : "justify-end"
            }`}
          >
            {mode == "edit" && id && (
              <div
                onClick={() => {
                  deleteRoutine({ id });
                }}
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
    </motion.div>
  );
}
