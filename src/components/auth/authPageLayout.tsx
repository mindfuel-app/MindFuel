export default function authPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex bg-[#008080]">
      <div className="h-screen w-0 xl:w-1/6"></div>
      <main className="z-100 flex min-h-screen w-full flex-col bg-[#edece7] py-10 xl:shadow-2xl">
        <div>{children}</div>
      </main>
      <div className="h-screen w-0 xl:w-1/6"></div>
    </div>
  );
}
