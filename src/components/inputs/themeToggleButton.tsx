import { motion } from "framer-motion";
import { useTheme } from "~/lib/ThemeContext";
import { cn } from "~/lib/utils";
import { useUser } from "~/lib/UserContext";

export default function ThemeToggleButton() {
  const { themeColor, setThemeColor } = useTheme();
  const { id } = useUser();
  const isToggled = themeColor === "orange-red";

  return (
    <div className="flex items-center gap-3 p-2">
      <span className="text-xl font-medium text-teal">Teal</span>
      <button
        onClick={() => {
          setThemeColor(id);
        }}
        className={cn(
          "relative h-7 w-14 rounded-full shadow-inner transition-colors duration-300",
          themeColor == "teal" ? "bg-teal/90" : "bg-orange-red/90"
        )}
      >
        <motion.div
          className="absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow-md"
          animate={{ x: isToggled ? 28 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      </button>
      <span className="text-xl font-medium text-orange-red">Orange-red</span>
    </div>
  );
}
