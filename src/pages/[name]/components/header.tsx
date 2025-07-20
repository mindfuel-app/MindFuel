import { useTheme } from "~/lib/ThemeContext";
import { Dispatch, useEffect, useState } from "react";
import useWindowWidth from "~/hooks/useWindowWidth";
import { TopNavigation } from "~/components/inputs/navigation";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export default function Header({
  username,
  points,
  currentLevelBasePoints,
  setConfigirationTab,
  configurationTab,
}: {
  username: string;
  points: number;
  currentLevelBasePoints: number;
  setConfigirationTab: Dispatch<React.SetStateAction<boolean>>;
  configurationTab: boolean;
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
        "relative h-[150px] md:h-[250px] bg-gradient-to-r pt-3",
        themeColor === "teal"
          ? "from-teal to-green-700"
          : "from-orange-red to-[#FF7373]"
      )}
    >
      {windowWidth > 1024 && <TopNavigation />}
      <div className="hidden w-full justify-between px-8 min-[200px]:flex xl:pr-10 ">
        <Image
          alt="Logo"
          src="/transparent-icon.png"
          width={75}
          height={75}
          priority={true}
        />
        <Button className="border" onClick={() => setConfigirationTab(!configurationTab)}>{!configurationTab ? 'Configuración' : 'Perfil'}</Button>
      </div>
      <div
        className={cn(
          "absolute -bottom-[60px] left-1/2 z-10 flex h-[100px] w-[100px] md:h-[130px] md:w-[130px] items-center justify-center rounded-full border-[4px] bg-white text-6xl md:text-7xl shadow-xl",
          "transform -translate-x-1/2 md:left-[150px] md:translate-x-0",
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