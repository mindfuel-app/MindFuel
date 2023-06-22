import Logo from "./logo";

export default function authPageLayout({
  children,
  authMethod,
}: {
  children: React.ReactNode;
  authMethod: "Inicio sesión" | "Registrarse";
}) {
  return (
    <div className="flex bg-[#008080]">
      <div className="h-screen w-0 min-[1400px]:w-1/6"></div>
      <main className="z-100 flex min-h-screen w-full flex-col bg-[#edece7] py-10 xl:shadow-2xl">
        <div className="flex flex-col items-center">
          <Logo />
          <div className="flex select-none flex-col items-center gap-2 px-5 py-3">
            <h1 className="mb-4 mt-5 text-2xl font-semibold text-[#008080] sm:text-3xl">
              {authMethod}
            </h1>
            {children}
          </div>
        </div>
      </main>
      <div className="h-screen w-0 min-[1400px]:w-1/6"></div>
    </div>
  );
}
