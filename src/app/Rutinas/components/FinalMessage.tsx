import { useTheme } from "~/contexts/ThemeContext";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "~/lib/utils";

export default function FinalMessage({
  completionStatus,
  points,
}: {
  completionStatus: "completed" | "partial" | "none";
  points: number;
}) {
  const { themeColor } = useTheme();

  let message;
  switch (completionStatus) {
    case "completed":
      message = "Has completado toda la rutina. ";
      break;
    case "partial":
      message = "Has completado casi toda la rutina. ";
      break;
    case "none":
      message =
        "No has completado ninguna tarea de la rutina. Vuelve a intentarlo más tarde.";
      break;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "relative flex w-[300px] flex-col items-center gap-1 rounded-xl border-2 bg-white p-5 pb-10 pt-8 shadow-xl md:w-[600px] md:pb-12 md:pt-4",
        themeColor == "teal" ? "border-teal" : "border-orange-red"
      )}
    >
      <strong className="text-lg">
        {completionStatus != "none" ? "¡Gran trabajo!" : "¡Sigue intentandolo!"}
      </strong>
      <span className="text-center">
        {message}
        {points > 0 && (
          <>
            Ganaste <strong>{points} puntos</strong>.
          </>
        )}
      </span>
      <Image
        className="mb-5 mt-2 md:mb-10"
        src="/finished-routine.png"
        width={200}
        height={200}
        alt=""
      />
      <p className="max-w-[220px] text-center">
        Sigue adelante para obtener más puntos y alcanzar nuevas metas 🚀
      </p>
      <Link
        href="/home"
        className={cn(
          "no-highlight absolute -bottom-5 rounded-2xl px-12 py-1.5 text-white transition-transform active:scale-95",
          themeColor == "teal" ? "bg-teal" : "bg-orange-red"
        )}
      >
        <span className="text-lg">Listo</span>
      </Link>
    </motion.div>
  );
}
