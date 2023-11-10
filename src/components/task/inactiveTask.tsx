import { CheckIcon } from "@heroicons/react/24/outline";
import { useTheme } from "~/lib/ThemeContext";
import { cn } from "~/lib/utils";

export default function InactiveTask({
  name,
  isDone,
}: {
  name: string;
  isDone: boolean;
}) {
  const { themeColor } = useTheme();
  return (
    <div
      className={cn(
        "rounded-lg p-2",
        isDone
          ? themeColor == "teal"
            ? "bg-teal"
            : "bg-orange-red"
          : themeColor == "teal"
          ? "border-2 border-teal bg-white"
          : "border-2 border-orange-red bg-white"
      )}
    >
      <div
        className={`flex items-center ${
          isDone ? "justify-between" : "justify-start"
        }`}
      >
        <span className={cn("ml-2", isDone ? "text-white" : "text-black")}>
          {name}
        </span>
        {isDone && (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
            <CheckIcon
              className={cn(
                "h-6 w-6",
                themeColor == "teal" ? "text-teal" : "text-orange-red"
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
}
