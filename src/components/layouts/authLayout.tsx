import Logo from "../auth/logo";
import Title from "../auth/title";

export default function authPageLayout({
  children,
  authMethod,
}: {
  children: React.ReactNode;
  authMethod: "Inicio sesión" | "Registrarse";
}) {
  return (
    <div className="app-ambient relative flex min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute -left-24 -top-28 h-72 w-72 rounded-full bg-teal/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 top-24 h-96 w-96 rounded-full bg-orange-red/10 blur-3xl" />
      <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-5 py-10 sm:px-8">
        <main className="glass-surface w-full rounded-3xl p-6 sm:p-8 lg:p-10">
          <Logo />
          <div className="mt-4 flex flex-col items-center">
            <Title title={authMethod} />
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
