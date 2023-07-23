import Navigation from "./navigation";
import Header from "./header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex h-screen flex-col">
        <Header />
        <div className="mb-[86px] flex h-full flex-col items-center bg-alabaster p-3">
          {children}
        </div>
        <Navigation />
      </div>
    </>
  );
}
