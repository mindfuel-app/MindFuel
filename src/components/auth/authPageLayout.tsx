import Logo from "./logo";

export default function authPageLayout({
  children,
  authMethod,
}: {
  children: React.ReactNode;
  authMethod: "Inicio sesión" | "Registrarse";
}) {
  return (
    <div className="flex h-screen overflow-y-hidden bg-[#008080]">
      <div className="h-screen w-0 min-[1440px]:w-1/6"></div>
      <main className="flex min-h-screen w-full flex-col bg-[#edece7] py-10 min-[1440px]:shadow-2xl">
        <div className="flex flex-col items-center">
          <Logo />
          <div className="flex select-none flex-col items-center p-5">
            <h1 className="my-5 text-2xl font-semibold text-[#008080] sm:text-3xl lg:-my-1">
              {authMethod}
            </h1>
            {children}
          </div>
        </div>
      </main>
      <div className="h-screen w-0 min-[1440px]:w-1/6"></div>
    </div>
  );
}
