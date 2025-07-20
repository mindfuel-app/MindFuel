// app/page.tsx
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import type { Metadata } from "next";
import { authOptions } from "~/server/auth";
import ClientLanding from "./Client";

export const metadata: Metadata = {
  title: "MindFuel",
  description: "An AI-powered lifestyle app",
};

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/home");
  }

  return <ClientLanding />;
}
