import Navigation from "./navigation";
import ProfileInfo from "./profileInfo";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex h-screen flex-col">
        <ProfileInfo />
        {children}
        <Navigation />
      </div>
    </>
  );
}
