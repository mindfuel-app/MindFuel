import Link from "next/link";

export default function Custom404() {
    return (
        <div className="flex flex-col px-5 py-36 items-center gap-5">
            <span className="text-gray-500 text-9xl mb-10">404</span>
            <span className="text-3xl font-bold">Página no encontrada</span>
            <p className="text-center text-lg">
La página que intenta abrir no existe. Es posible que haya escrito mal la dirección o que la página se haya movido a otra URL.
            </p>
            <Link href="/tareas" className="bg-[#5C7AFF] rounded-xl text-white text-xl px-5 py-3 mt-16">
                Volver a la home
            </Link>
        </div>
    )
}