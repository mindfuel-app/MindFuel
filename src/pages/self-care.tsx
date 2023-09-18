import Head from "next/head";
import Layout from "~/components/layout";
import { useSession } from "next-auth/react";
import Router from "next/router";
import Link from "next/link";
import Image from "next/image";

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
];

export default function SelfCare() {
  const { data: sessionData, status } = useSession();

  if (status == "unauthenticated") return void Router.push("/signin");

  if (!sessionData) return;

  return (
    <>
      <Head>
        <title>Self-care</title>
      </Head>
      <div className="flex h-screen flex-col">
        <div className="relative flex w-full justify-between py-4">
          <span className="pl-5 text-lg font-medium text-teal">Self-care</span>
          <span className="pr-5">Icono</span>
          <div className="absolute bottom-0 w-full border-[3px] border-teal" />
        </div>
        <div className="flex flex-col gap-3 py-5">
          {options.map((option) => (
            <Link
              key={option.title}
              href={option.href}
              className="flex w-72 rounded-md bg-white p-3"
            >
              <Image width={50} height={50} alt={option.title} src="" />
              <div className="flex flex-col gap-2">
                <h2>{option.title}</h2>
                <h3>{option.duration}</h3>
                <h4>{option.description}</h4>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
