
export default function OptionLayout({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <>
      <TodayDate />
      <div className="flex flex-col items-center gap-7 pt-5">
        <h1 className="text-3xl font-medium">{title}</h1>
        {children}
      </div>
    </>
  );
}

function TodayDate() {
  const today = new Date();
  const dayOfMonth = today.getDate();
  const monthNames = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];
  const monthName = monthNames[today.getMonth()] || "";
  const year = today.getFullYear();
  const formattedDate = `Hoy, ${dayOfMonth} de ${monthName} de ${year}`;

  return <h3 className="mt-3 text-lg">{formattedDate}</h3>;
}
