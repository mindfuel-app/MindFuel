import Navigation from "./navigation";
import ProfileInfo from "./profileInfo";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ProfileInfo />
      {children}
      <Navigation />
    </>
  );
}
