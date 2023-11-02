import { CheckIcon } from "@heroicons/react/24/outline";
import { cn } from "~/lib/utils";

export default function InactiveTask({
  name,
  isDone,
}: {
  name: string;
  isDone: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-lg p-2",
        isDone ? "bg-teal" : "border-2 border-teal bg-white"
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
            <CheckIcon className="h-6 w-6 text-teal" />
          </div>
        )}
      </div>
    </div>
  );
}
