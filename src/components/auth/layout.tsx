import Logo from "../logo";
import Title from "./title";

export default function AuthLayout({
  children,
  authMethod,
}: {
  children: React.ReactNode;
  authMethod: "Inicio sesión" | "Registrarse";
}) {
  return (
    <div className="flex min-h-screen bg-teal">
      <div className="h-full w-0 min-[1440px]:w-1/6" />
      <main className="flex min-h-screen w-full flex-col bg-alabaster pt-10">
        <Logo />
        <div className="flex flex-col items-center p-5 lg:p-0">
          <Title title={authMethod} />
          {children}
        </div>
      </main>
      <div className="h-full w-0 min-[1440px]:w-1/6" />
    </div>
  );
}
