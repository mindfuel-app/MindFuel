import Link from "next/link";

export default function Custom404() {
  return (
    <div className="flex flex-col items-center gap-5 px-4 py-36">
      <span className="mb-10 text-9xl text-gray-500">404</span>
      <span className="text-3xl font-bold">Página no encontrada</span>
      <p className="text-center text-lg">
        La página que intenta abrir no existe. Es posible que haya escrito mal
        la dirección o que la página se haya movido a otra URL.
      </p>
      <Link
        href="/tareas"
        className="no-highlight mt-16 rounded-xl bg-[#5C7AFF] px-5 py-3 text-xl text-white active:bg-[#7992ff]"
      >
        Volver a la home
      </Link>
    </div>
  );
}
