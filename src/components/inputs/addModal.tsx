import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import useSwipe from "~/hooks/useSwipe";
import { useTheme } from "~/lib/ThemeContext";
import { cn } from "~/lib/utils";

export default function AddModal({
  TaskModal,
  RoutineModal,
  initialTab = "tareas",
}: {
  TaskModal: JSX.Element;
  RoutineModal: JSX.Element;
  initialTab?: "tareas" | "rutinas";
}) {
  const [selectedTab, setSelectedTab] = useState<"tareas" | "rutinas">(
    initialTab
  );
  const { themeColor } = useTheme();

  useEffect(() => {
    setSelectedTab(initialTab);
  }, [initialTab]);

  const swipeLeftHandler = useSwipe({
    onSwipedLeft: () => {
      setSelectedTab("rutinas");
    },
  });

  const swipeRightHandler = useSwipe({
    onSwipedRight: () => {
      setSelectedTab("tareas");
    },
  });

  return (
    <>
      <div className="no-highlight relative flex w-full">
        <Button
          className={`relative h-14 w-1/2 text-xl active:bg-gray-100 ${
            selectedTab == "tareas"
              ? "font-medium text-gray-800"
              : "text-gray-500"
          }`}
          onClick={() => setSelectedTab("tareas")}
        >
          Tareas
          {selectedTab == "tareas" && (
            <div
              className={cn(
                "absolute bottom-[2px] w-[50%] rounded-full border-[2px]",
                themeColor == "teal" ? "border-teal" : "border-orange-red"
              )}
            />
          )}
        </Button>
        <Button
          className={`relative h-14 w-1/2 text-xl active:bg-gray-100 ${
            selectedTab == "rutinas"
              ? "font-medium text-gray-800"
              : "text-gray-500"
          }`}
          onClick={() => setSelectedTab("rutinas")}
        >
          Rutinas
          {selectedTab == "rutinas" && (
            <div
              className={cn(
                "absolute bottom-[2px] w-[50%] rounded-full border-[2px]",
                themeColor == "teal" ? "border-teal" : "border-orange-red"
              )}
            />
          )}
        </Button>
        <div className="absolute bottom-0 w-full border border-gray-100"></div>
      </div>
      {selectedTab == "tareas" ? (
        <div {...swipeLeftHandler}>{TaskModal}</div>
      ) : (
        <div {...swipeRightHandler}>{RoutineModal}</div>
      )}
    </>
  );
}
