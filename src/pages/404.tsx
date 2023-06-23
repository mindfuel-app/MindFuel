import Link from "next/link";

export default function Custom404() {
  return (
    <div className="flex flex-col items-center gap-5 px-4 py-36">
      <span className="mb-7 text-9xl text-gray-500">404</span>
      <span className="text-3xl font-bold max-[360px]:text-2xl xl:text-4xl">
        Página no encontrada
      </span>
      <p className="mt-3 max-w-[650px] text-center text-lg lg:text-xl">
        La página que intenta abrir no existe. Es posible que haya escrito mal
        la dirección o que la página se haya movido a otra URL.
      </p>
      <Link
        href="/tareas"
        className="no-highlight mt-10 rounded-xl bg-[#5C7AFF] px-5 py-3 text-xl text-white active:bg-[#7992ff]"
      >
        Volver a la home
      </Link>
    </div>
  );
}
