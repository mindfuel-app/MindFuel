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
    <div className="flex min-h-screen bg-teal">
      <div className="h-full w-0 min-[1440px]:w-1/6" />
      <main className="flex min-h-screen w-full flex-col bg-alabaster py-10">
        <div className="flex flex-col items-center">
          <Logo />
          <div className="flex flex-col items-center p-5">
            <Title title={authMethod} />
            {children}
          </div>
        </div>
      </main>
      <div className="h-full w-0 min-[1440px]:w-1/6" />
    </div>
  );
}
