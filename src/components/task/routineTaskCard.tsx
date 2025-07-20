import { type ThemeColor } from "~/contexts/ThemeContext";
import { cn } from "~/lib/utils";

export default function RoutineTaskCard({
  number,
  name,
  themeColor = "teal",
}: {
  number: number;
  name: string;
  themeColor?: ThemeColor;
}) {
  return (
    <div className="flex w-full">
      <div
        className={cn(
          "flex w-[15%] items-center justify-center rounded-l-md p-2 text-white",
          themeColor == "teal" ? "bg-teal" : "bg-orange-red"
        )}
      >
        {number}
      </div>
      <div
        className={cn(
          "flex w-full items-center rounded-r-md border-2 bg-white py-2 pl-3 text-black",
          themeColor == "teal" ? "border-teal" : "border-orange-red"
        )}
      >
        {name}
      </div>
    </div>
  );
}
