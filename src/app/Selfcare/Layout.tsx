import { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";
import { redirect } from "next/navigation";
import ClientWrapper from "./ClientWrapper"; // lo escribimos abajo

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin");
  }

  return <ClientWrapper session={session}>{children}</ClientWrapper>;
}
