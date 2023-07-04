import Navigation from "./navigation";
import ProfileInfo from "./profileInfo";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex h-screen flex-col">
        <ProfileInfo />
        <div className="mb-[86px] flex h-full flex-col items-center bg-[#EDECE7] p-3">
          {children}
        </div>
        <Navigation />
      </div>
    </>
  );
}
