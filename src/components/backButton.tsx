import Link from "next/link";
import { MdArrowBackIosNew } from "react-icons/md";

export default function BackButton({
  href,
  color,
}: {
  href: string;
  color?: "teal" | "white" | "black";
}) {
  return (
    <Link href={href} className="no-highlight active:scale-95">
      <MdArrowBackIosNew className={`text-2xl text-${color || "black"}`} />
    </Link>
  );
}
