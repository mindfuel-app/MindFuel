import { useSession } from "next-auth/react";
import Router from "next/router";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import SelfCareLayout from "./layout";

const options = [
  {
    title: "Mindfulness",
    href: "/mindfulness",
    duration: 10,
    description: "Variedad de ejercicios para relajar",
    image: "/mindfulness.png",
  },
  {
    title: "Apreciacion",
    href: "/apreciacion",
    duration: 10,
    description: "Concentrate en pequeñas cosas y aprecialas",
    image: "/apreciacion.png",
  },
  {
    title: "Tomar agua",
    href: "/tomar-agua",
    duration: 10,
    description: "Es importante mantenerse hidratado",
    image: "/tomar-agua.png",
  },
];

export default function SelfCare() {
  const { data: sessionData, status } = useSession();

  if (status == "unauthenticated") return void Router.push("/signin");

  if (!sessionData) return;

  return (
    <SelfCareLayout sessionData={sessionData}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-3 px-4 py-2"
      >
        <h3 className="text-lg">Opciones</h3>
        {options.map((option) => (
          <Link
            key={option.title}
            href={`/self-care${option.href}`}
            className="no-highlight flex gap-1 rounded-md bg-white p-2 transition-transform active:scale-[97%]"
          >
            <Image
              width={71}
              height={68}
              alt={option.title}
              src={`/self-care${option.image}`}
              className="w-1/4"
            />
            <div className="w-3/4">
              <h2 className="font-semibold">{option.title}</h2>
              <h3 className="text-sm font-medium">{`Duracion: ${option.duration} minutos`}</h3>
              <h4 className="text-sm">{option.description}</h4>
            </div>
          </Link>
        ))}
      </motion.div>
    </SelfCareLayout>
  );
}
