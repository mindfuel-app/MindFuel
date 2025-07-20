import { cn } from "~/lib/utils";

export default function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-200", className)}
    />
  );
}
export function StatsSkeleton({ themeColor }: { themeColor: 'teal' | 'orange-red' }) {

  return (
    <div className="flex items-center gap-3 animate-pulse ">
      <div
        className={cn(
          "flex flex-col w-1/2 gap-1 rounded-lg p-4",
          themeColor === "teal"
            ? "bg-teal/30"
            : "bg-orange-red/30"
        )}
      >

      </div>
      <div className="flex w-1/2 flex-col gap-1 rounded-lg bg-orange/30 p-4">

      </div>
    </div>
  );
}