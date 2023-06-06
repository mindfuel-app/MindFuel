import { signIn } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";

export default function Landing() {
    return (
        <>
            <Head>
                <title>Landing</title>
            </Head>
            <div className="flex flex-col py-2">
                <div className="flex px-5 py-3 justify-end">
                    <Link href="" onClick={() => void signIn('google', {callbackUrl: '/tareas'})}>
                        <span className="text-lg">Login</span>
                    </Link>
                </div>
                <div className="flex flex-col justify-between">
                    <div className="flex flex-col items-center py-28 px-4 space-y-20">
                        <h1 className="text-5xl font-bold">MindFuel</h1>
                        <p className="text-lg">MindFuel es una solución diseñada para ayudar a las personas diagnosticadas con trastorno por déficit de atención e hiperactividad (TDAH) en la generación de hábitos sustentables en el tiempo y mantención de la atención. </p>
                    </div>
                    <div className="flex justify-center ">
                        <Link href="/login" className="bg-white rounded-full py-3 px-28 mt-12 shadow-md">
                            <span className="text-lg text-black font-bold ">EMPEZAR</span>
                        </Link>
                    </div>
                </div>
                
            </div>
        </>
    )
}