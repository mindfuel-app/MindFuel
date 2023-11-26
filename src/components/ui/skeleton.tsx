import { cn } from "~/lib/utils";

function TaskSkeleton() {
  return (
    <div className="flex w-full flex-col items-center gap-5 pt-16">
      <div className="flex gap-2">
        <Rectangle className="w-60" />
        <Circle />
      </div>
      <Rectangle />
    </div>
  );
}

function RoutineSkeleton() {
  return (
    <div className="flex w-full flex-col items-center gap-5 p-10">
      <Rectangle className="h-16 w-72" />
      <Rectangle className="h-16 w-72" />
    </div>
  );
}

function SingleRoutineSkeleton() {
  return (
    <div className="flex w-full flex-col items-center gap-20 py-16">
      <Rectangle className="h-16 w-72" />
      <div className="flex flex-col gap-3">
        <Rectangle className="h-16 w-80" />
        <Rectangle className="h-16 w-80" />
      </div>
    </div>
  );
}

function JoinedDateSkeleton() {
  return <Rectangle className="ml-1 h-8 w-60 bg-gray-200" />;
}

function Rectangle({ className }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "h-12 w-72 animate-pulse rounded-md bg-gray-300",
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

export {
  TaskSkeleton,
  RoutineSkeleton,
  SingleRoutineSkeleton,
  JoinedDateSkeleton,
};
