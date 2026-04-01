import Head from "next/head";
import Link from "next/link";
import Logo from "~/components/auth/logo";
import { motion } from "framer-motion";
import type { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import {
  BellAlertIcon,
  CheckCircleIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const sessionData = await getSession(context);

  if (sessionData) {
    return {
      redirect: {
        destination: "/home",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default function Landing() {
  return (
    <>
      <Head>
        <title>MindFuel</title>
      </Head>
      <div className="relative min-h-screen overflow-hidden bg-[#f4f6f3] px-5 pb-14 pt-8 sm:px-8 lg:px-12">
        <div className="bg-teal/15 pointer-events-none absolute -left-20 -top-28 h-72 w-72 rounded-full blur-3xl" />
        <div className="bg-orange-red/15 pointer-events-none absolute -right-24 top-1/3 h-80 w-80 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-60 w-60 rounded-full bg-cornflower-blue/10 blur-3xl" />

        <main className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 lg:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="pt-3"
          >
            <Logo />
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <motion.section
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-white/85 rounded-3xl border border-white/70 p-6 shadow-xl shadow-black/5 backdrop-blur sm:p-8 lg:p-10"
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-teal/10 px-3 py-1 text-sm font-medium tracking-wide text-teal">
                <SparklesIcon className="h-4 w-4" />
                Organiza tu día en minutos
              </span>
              <h1 className="mt-5 max-w-xl text-4xl font-semibold leading-[1.1] tracking-tight text-eerie-black sm:text-5xl lg:text-6xl">
                Enfócate en lo importante sin fricción.
              </h1>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-gray-700 sm:text-lg">
                Planifica tareas, crea rutinas y recibe recordatorios que te
                ayudan a mantener constancia todos los días.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/signup"
                  className="rounded-2xl bg-eerie-black px-6 py-3 text-center text-base font-medium text-white transition hover:bg-eerie-black/90"
                >
                  Crear mi primer plan
                </Link>
                <Link
                  href="/signin"
                  className="rounded-2xl border border-gray-300 bg-white px-6 py-3 text-center text-base font-medium text-gray-800 transition hover:bg-gray-50"
                >
                  Ya tengo una cuenta
                </Link>
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                <span className="rounded-full bg-gray-100 px-3 py-1">
                  Privacidad primero
                </span>
                <span className="rounded-full bg-gray-100 px-3 py-1">
                  Notificaciones opcionales
                </span>
                <span className="rounded-full bg-gray-100 px-3 py-1">
                  PWA instalada en segundos
                </span>
              </div>
            </motion.section>

            <motion.aside
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="grid gap-4 lg:gap-5"
            >
              <FeatureCard
                icon={<CheckCircleIcon className="h-6 w-6" />}
                title="Prioridades claras"
                description="Visualiza tus tareas activas y completa pendientes con seguimiento simple."
              />
              <FeatureCard
                icon={<BellAlertIcon className="h-6 w-6" />}
                title="Recordatorios útiles"
                description="Configura avisos para mantener foco sin sobrecargarte durante el día."
              />
              <FeatureCard
                icon={<SparklesIcon className="h-6 w-6" />}
                title="Rutinas sostenibles"
                description="Convierte pequeñas acciones en hábitos constantes con pasos alcanzables."
              />
            </motion.aside>
          </div>
        </main>
      </div>
    </>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/90 p-5 shadow-lg shadow-black/5 backdrop-blur">
      <div className="mb-3 inline-flex rounded-xl bg-gray-100 p-2 text-eerie-black">
        {icon}
      </div>
      <h2 className="text-lg font-semibold text-eerie-black">{title}</h2>
      <p className="mt-1 text-sm leading-relaxed text-gray-600">
        {description}
      </p>
    </div>
  );
}
