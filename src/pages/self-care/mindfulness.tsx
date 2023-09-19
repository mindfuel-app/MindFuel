import { useSession } from "next-auth/react";
import SelfCareLayout from "./layout";
import Router from "next/router";
import { MdArrowBackIosNew } from "react-icons/md";
import Link from "next/link";

export default function Mindfulness() {
  const { data: sessionData, status } = useSession();

  if (status == "unauthenticated") return void Router.push("/signin");

  if (!sessionData) return;

  return (
    <SelfCareLayout sessionData={sessionData}>
      <div className="ml-3 mt-3 flex w-full items-center justify-start gap-3">
        <Link href="/self-care" className="no-highlight active:scale-95">
          <MdArrowBackIosNew className="text-2xl text-teal" />
        </Link>
        <span className="text-xl text-teal">Mindfulness</span>
      </div>
    </SelfCareLayout>
  );
}
