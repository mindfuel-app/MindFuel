import Navigation from "./navigation";
import ProfileInfo from "./profileInfo";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex h-screen flex-col">
        <ProfileInfo />
        <div className="flex h-full flex-col items-center bg-[#E9E9E9] p-5">
          {children}
        </div>
        <Navigation />
      </div>
    </>
  );
}
