
import { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "~/contexts/ThemeContext";
import { cn } from "~/lib/utils";
import { useUser } from "~/contexts/UserContext";


export default function ThemeToggleButton() {
  const { themeColor, setThemeColor } = useTheme();
  const { id } = useUser();
  const [isToggled, setIsToggled] = useState(themeColor == "orange-red");

  return (
    <div className="flex items-center p-2 gap-3">
      <span className="text-xl font-medium text-teal">Teal</span>
      <button
        onClick={() => {
          setIsToggled(!isToggled);
          setThemeColor(id);
        }}
        className={cn(
          "relative h-7 w-14 rounded-full transition-colors duration-300 shadow-inner",
          themeColor == "teal" ? "bg-teal/90" : "bg-orange-red/90"
        )}
      >
        <motion.div
          className="absolute top-1 left-1 h-5 w-5 rounded-full bg-white shadow-md"
          animate={{ x: isToggled ? 28 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      </button>
      <span className="text-xl font-medium text-orange-red">Orange-red</span>
    </div>
  );
}