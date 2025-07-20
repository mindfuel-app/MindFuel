"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { usePreviousPath } from "~/hooks/usePreviousPath";
import { useSession } from "next-auth/react";

type Option = {
  title: string;
  href: string;
  description: string;
  image: string;
};

const options: Option[] = [
  {
    title: "Respiración consciente",
    href: "/respiracion-consciente",
    description: "Disfruta el hoy y mantente en el presente.",
    image: "/mindfulness.png",
  },
  {
    title: "Apreciación",
    href: "/apreciacion",
    description: "Concentrate en pequeñas cosas y aprecialas.",
    image: "/apreciacion.png",
  },
  {
    title: "Diario personal",
    href: "/diario-personal",
    description: "Escribe sobre lo que quieras aquí. Sé libre y exprésate.",
    image: "/diario.png",
  },
];

export default function Page() {
  const { data: session } = useSession();
  const { onRouteChange } = usePreviousPath();

  if (!session) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-3 px-4 pt-2"
    >
      <h3 className="text-lg">Opciones</h3>
      {options.map((option) => (
        <Link
          key={option.title}
          href={`/selfcare${option.href}`}
          className="no-highlight flex max-h-[120px] min-h-[100px] w-[300px] gap-2 rounded-md bg-white p-2 transition-transform active:scale-[97%] sm:w-[400px]"
          onClick={() => onRouteChange(`/selfcare${option.href}`)}
        >
          {option.image && (
            <Image
              width={100}
              height={100}
              alt={option.title}
              src={option.image}
              className="rounded-md object-cover"
            />
          )}
          <div className="flex flex-col justify-center gap-1">
            <p className="text-base font-semibold">{option.title}</p>
            <p className="text-sm">{option.description}</p>
          </div>
        </Link>
      ))}
    </motion.div>
  );
}
