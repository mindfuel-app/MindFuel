import Head from "next/head";
import Link from "next/link";

export default function Custom404() {
  return (
    <>
      <Head>
        <title>404: Esta página no existe</title>
      </Head>
      <div className="flex flex-col items-center gap-5 px-4 py-36">
        <span className="mb-7 text-9xl text-gray-500">404</span>
        <span className="text-3xl font-bold max-[360px]:text-2xl lg:text-4xl">
          Página no encontrada
        </span>
        <p className="mt-3 max-w-[650px] text-center text-lg lg:text-xl">
          La página que intenta abrir no existe. Es posible que haya escrito mal
          la dirección o que la página se haya movido a otra URL.
        </p>
        <Link
          href="/home"
          className="no-highlight mt-10 rounded-xl bg-cornflower-blue px-5 py-3 text-xl text-white active:bg-cornflower-blue/80"
        >
          Volver a la home
        </Link>
      </div>
    </>
  );
}
