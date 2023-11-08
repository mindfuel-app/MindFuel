import Link from "next/link";
import { MdArrowBackIosNew } from "react-icons/md";

export default function BackButton({
  href,
  color,
  handleClick,
}: {
  href: string;
  color?: "teal" | "white" | "black" | "orange-red";
  handleClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={handleClick}
      className="no-highlight active:scale-95"
    >
      <MdArrowBackIosNew className={`text-2xl text-${color || "black"}`} />
    </Link>
  );
}
