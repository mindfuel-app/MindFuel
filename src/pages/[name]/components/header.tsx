import BackButton from "~/components/backButton";
import useWindowWidth from "~/hooks/useWindowWidth";
import { ThemeColor } from "~/lib/ThemeContext";
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
        "relative flex w-full items-center justify-start  px-4 py-3 transition-colors",
        themeColor == "teal"
          ? windowWidth < 1024
            ? "bg-teal"
            : "bg-gradient-to-r from-teal to-green-700"
          : windowWidth < 1024
          ? "bg-orange-red"
          : "bg-gradient-to-r from-orange-red to-[#FF7373]"
      )}
    >
      <BackButton href={`/${userName}`} color="white" />
      <h1 className="absolute left-1/2 -translate-x-1/2 text-xl font-medium text-white">
        Configuración
      </h1>
    </header>
  );
}