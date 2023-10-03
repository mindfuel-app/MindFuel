import { CheckIcon } from "@heroicons/react/24/outline";

export default function InactiveTask({
  name,
  isDone,
}: {
  name: string;
  isDone: boolean;
}) {
  return (
    <div className="rounded-lg bg-teal p-2">
      <div
        className={`flex items-center ${
          isDone ? "justify-between" : "justify-start"
        }`}
      >
        <span className="ml-2 text-white">{name}</span>
        {isDone && (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
            <CheckIcon className="h-6 w-6 text-teal" />
          </div>
        )}
      </div>
    </div>
  );
}
