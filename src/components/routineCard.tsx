export default function RoutineCard({
  nombre,
  descripcion,
}: {
  nombre: string;
  descripcion: string;
}) {
  return (
    <div className="flex w-[300px] flex-col rounded-md bg-[#008080] p-2 text-white">
      <h1 className="text-lg">{nombre}</h1>
      <span className="text-sm text-black">5 habitos - 2 horas</span>
      <span className="text-sm font-normal">{descripcion}</span>
    </div>
  );
}
