import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import SelfCareLayout from "../../components/layouts/selfCareLayout";
import { usePreviousPath } from "~/hooks/usePreviousPath";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

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
    title: "Diario personal",
    href: "/diario-personal",
    description: "Escribe sobre lo que quieras aquí. Sé libre y exprésate.",
    image: "/diario.png",
  },
];

export default function SelfCare() {
  const router = useRouter();
  const { data: sessionData, status } = useSession();
  const { onRouteChange } = usePreviousPath();

  if (status == "unauthenticated") return void router.push("/signin");

  if (!sessionData) return;

  return (
    <SelfCareLayout sessionData={sessionData}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="padding-footer-sm mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 pt-2"
      >
        <h3 className="text-xl font-semibold tracking-tight text-eerie-black">
          Opciones
        </h3>
        {options.map((option) => (
          <Link
            key={option.title}
            href={`/self-care${option.href}`}
            className="glass-surface no-highlight flex min-h-[108px] w-full gap-2 rounded-2xl p-3 transition-transform active:scale-[98%]"
            onClick={() => onRouteChange(`/self-care${option.href}`)}
          >
            {option.image && (
              <Image
                width={100}
                height={100}
                alt={option.title}
                src={`/self-care${option.image}`}
                className="w-1/4 rounded-xl bg-white/80 p-1.5"
              />
            )}
            <div className="flex w-3/4 flex-col pt-1">
              <h2 className="font-semibold text-eerie-black sm:text-lg">
                {option.title}
              </h2>
              <h4 className="text-sm text-gray-600 sm:text-base">
                {option.description}
              </h4>
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
        <h1 className="text-3xl font-semibold tracking-tight text-eerie-black">
          {title}
        </h1>
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

  return <h3 className="mt-3 text-lg text-gray-700">{formattedDate}</h3>;
}
