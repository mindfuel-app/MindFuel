import BackButton from "~/components/inputs/backButton";
import { TopNavigation } from "~/components/inputs/navigation";
import useWindowWidth from "~/hooks/useWindowWidth";
import { type ThemeColor } from "~/lib/ThemeContext";
import { cn } from "~/lib/utils";

export default function Header({
  userName,
  themeColor,
}: {
  userName: string;
  themeColor: ThemeColor;
}) {
  const windowWidth = useWindowWidth();

  return (
    <header
      className={cn(
        "relative flex w-full items-center bg-gradient-to-r justify-start h-20 px-4 py-3 transition-colors",
        themeColor == "teal"
          ? "from-teal to-green-700"
          : "from-orange-red to-[#FF7373]"
      )}
    >
      <BackButton href={`/${userName}`} color="white" />
      <h1 className="absolute left-1/2 -translate-x-1/2 text-xl font-medium text-white">
        Configuración
      </h1>
    </header>
  );
}