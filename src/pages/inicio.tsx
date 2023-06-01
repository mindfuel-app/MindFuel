import Head from "next/head";
import Image from "next/image";
import Button from "~/components/login/Button";

export default function Inicio() {
    return (
        <>
            <Head>
                <title>Inicio</title>
                <link rel="icon" href="/logo.ico" />
            </Head>
            <main className="flex flex-col p-5 min-h-screen">
                <div className="flex justify-end">
                    <Image alt="Logo" src="/logo.png" width={75} height={58}></Image>
                </div>
                <div className="flex flex-col px-5 py-36 text-center">
                    <div className="flex flex-col justify-center items-center">
                        <p className="text-xl">
                            Puedes crearte una cuenta mediante la <span className="font-bold">conexion</span> con cualquiera de las siguientes plataformas:
                        </p>
                        <div className="flex flex-col mt-10 space-y-7 items-center justify-center">
                            <Button iconAdress="/login/google.png" platformName="Google"></Button>
                            <Button iconAdress="/login/apple.png" platformName="Apple"></Button>
                            <Button iconAdress="/login/microsoft.png" platformName="Microsoft"></Button>
                        </div>
                    </div>
                </div>
            </main>
        </>
        
    )
}