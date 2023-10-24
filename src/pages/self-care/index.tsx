import { useSession } from "next-auth/react";
import Router from "next/router";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import SelfCareLayout from "../../components/layouts/selfCareLayout";
import { usePreviousPath } from "~/hooks/usePreviousPath";
import { api } from "~/utils/api";

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
    title: "Apreciacion",
    href: "/apreciacion",
    description: "Concentrate en pequeñas cosas y aprecialas.",
    image: "/apreciacion.png",
  },
  {
    title: "Tomar agua",
    href: "/tomar-agua",
    description: "Es importante mantenerse hidratado.",
    image: "/tomar-agua.png",
  },
  {
    title: "Técnica Pomodoro",
    href: "/pomodoro",
    description:
      "Haz tus tareas usando este método para mejorar la administración del tiempo.",
    image: "/manzana.png",
  },
  {
    title: "Diario personal",
    href: "/diario-personal",
    description: "Escribe sobre lo que quieras aquí. Sé libre y exprésate.",
    image: "/diario.png",
  },
  // {
  //   title: "Respiración",
  //   href: "/respiracion",
  //   description: "Tomate un tiempo para relajar y recuperar la atención.",
  //   image: "/respiracion.png",
  // },
];

export default function SelfCare() {
  const { data: sessionData, status } = useSession();
  const { data } = api.selfCare.getWater.useQuery(
    {
      user_id: sessionData?.user.id || "",
    },
    { cacheTime: 0 }
  );

  const { onRouteChange } = usePreviousPath();

  if (status == "unauthenticated") return void Router.push("/signin");

  if (!sessionData) return;
  return (
    <SelfCareLayout sessionData={sessionData}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="padding-footer-sm flex flex-col gap-3 px-4 pt-2"
      >
        <h3 className="text-lg">Opciones</h3>
        {options.map((option) => (
          <Link
            key={option.title}
            href={`/self-care${option.href}`}
            className="no-highlight flex max-h-[120px] min-h-[100px] w-[300px] gap-2 rounded-md bg-white p-2 transition-transform active:scale-[97%] sm:w-[400px]"
            onClick={() => onRouteChange(`/self-care${option.href}`)}
          >
            {option.image && (
              <Image
                width={100}
                height={100}
                alt={option.title}
                src={`/self-care${option.image}`}
                className="w-1/4 p-1.5"
              />
            )}
            <div className="flex w-3/4 flex-col pt-1">
              <h2 className="font-semibold sm:text-lg">{option.title}</h2>
              <h4 className="text-sm sm:text-base">{option.description}</h4>
            </div>
          </Link>
        ))}
      </motion.div>
    </SelfCareLayout>
  );
}

export function OptionLayout({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <>
      <TodayDate />
      <div className="padding-footer-sm flex flex-col items-center gap-7 pt-5">
        <h1 className="text-3xl font-medium">{title}</h1>
        {children}
      </div>
    </>
  );
}

function TodayDate() {
  const today = new Date();
  const dayOfMonth = today.getDate();
  const monthNames = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];
  const monthName = monthNames[today.getMonth()] || "";
  const year = today.getFullYear();
  const formattedDate = `Hoy, ${dayOfMonth} de ${monthName} de ${year}`;

  return <h3 className="mt-3 text-lg">{formattedDate}</h3>;
}
