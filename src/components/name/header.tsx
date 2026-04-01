import { useTheme } from "~/lib/ThemeContext";
import { useEffect, useState } from "react";
import useWindowWidth from "~/hooks/useWindowWidth";
import { TopNavigation } from "~/components/inputs/navigation";
import Image from "next/image";
import { cn } from "~/lib/utils";
import ThemeToggleButton from "../inputs/themeToggleButton";

export default function Header({
  username,
  points,
  currentLevelBasePoints,
}: {
  username: string;
  points: number;
  currentLevelBasePoints: number;
}) {
  const { themeColor } = useTheme();
  const [progress, setProgress] = useState(0);
  const windowWidth = useWindowWidth();
  const levelPoints = points - currentLevelBasePoints;

  useEffect(() => {
    if (progress >= levelPoints) return;

    const addProgress = levelPoints - progress > 100 ? 100 : 10;

    const interval = setInterval(() => {
      setProgress((progress) => Math.round((progress + addProgress) / 10) * 10);
    }, 10);

    return () => clearInterval(interval);
  }, [levelPoints, progress]);

  return (
    <header
      className={cn(
        "relative h-[150px] bg-gradient-to-r pt-3 md:h-[250px]",
        themeColor === "teal"
          ? "from-teal to-green-700"
          : "from-orange-red to-[#FF7373]"
      )}
    >
      {windowWidth >= 1024 && <TopNavigation />}
      <div className="hidden w-full items-start justify-between px-6 pt-2 min-[200px]:flex xl:px-10">
        <Image
          alt="Logo"
          src="/transparent-icon.png"
          width={75}
          height={75}
          priority={true}
        />
        <div className="rounded-2xl bg-white/85 px-4 py-2 shadow-md backdrop-blur">
          <ThemeToggleButton />
        </div>
      </div>
      <div
        className={cn(
          "absolute -bottom-[60px] left-1/2 z-10 flex h-[100px] w-[100px] items-center justify-center rounded-full border-[4px] bg-white text-6xl shadow-xl md:h-[130px] md:w-[130px] md:text-7xl",
          "-translate-x-1/2 transform md:left-[150px] md:translate-x-0",
          themeColor === "teal"
            ? "border-teal/90 text-teal/90"
            : "border-orange-red text-orange-red"
        )}
      >
        {username[0]?.toUpperCase()}
      </div>
    </header>
  );
}
