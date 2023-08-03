import { cn } from "~/lib/utils";

export function TaskSkeleton() {
  return (
    <div className="flex w-full flex-col items-center gap-5 p-10">
      <div className="flex gap-2">
        <Rectangle className="w-52" />
        <Circle />
      </div>
      <Rectangle />
    </div>
  );
}

function Rectangle({ className }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "h-10 w-64 animate-pulse rounded-md bg-gray-300",
        className
      )}
    ></div>
  );
}

function Circle({ className }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "h-10 w-10 animate-pulse rounded-full bg-gray-300",
        className
      )}
    ></div>
  );
}
