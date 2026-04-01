import { cn } from "~/lib/utils";

function TaskSkeleton() {
  return (
    <div className="flex w-full max-w-[760px] flex-col items-center gap-4 pt-8 sm:pt-10">
      <div className="h-14 w-full rounded-2xl bg-white/80 p-3 shadow-sm">
        <Rectangle className="h-8 w-44" />
      </div>
      <div className="flex w-full flex-col gap-3">
        <Rectangle className="h-24 w-full rounded-2xl" />
        <Rectangle className="h-24 w-full rounded-2xl" />
        <Rectangle className="h-24 w-full rounded-2xl" />
      </div>
    </div>
  );
}

function RoutineSkeleton() {
  return (
    <div className="flex w-full max-w-[760px] flex-col items-center gap-5 pt-8 sm:pt-10">
      <Rectangle className="h-20 w-full rounded-2xl" />
      <Rectangle className="h-20 w-full rounded-2xl" />
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
  return <Rectangle className="ml-1 h-8 w-60" />;
}

function Rectangle({ className }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "h-12 w-72 animate-pulse rounded-md bg-gray-200",
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
