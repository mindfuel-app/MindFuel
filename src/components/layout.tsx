import Link from "next/link";
import Navigation from "./navigation";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const {data: sessionData} = useSession()

    return (
        <>
            <div className="flex justify-between py-3 px-2 items-center">
                <h1>{sessionData && <p>Bienvenido {sessionData.user.name}</p>}</h1>
                {sessionData && <Link className="border-2 border-black rounded-xl px-2 py-1" href="" onClick={() => void signOut({callbackUrl: '/login'})}>Cerrar sesión</Link>}
            </div>
            {children}
            <Navigation />
        </>
    )
}