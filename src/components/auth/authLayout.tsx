export default function authLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="flex min-h-screen flex-col py-10">{children}</main>;
}
