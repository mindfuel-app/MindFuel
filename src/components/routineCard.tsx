export default function RoutineCard({
  nombre,
  descripcion,
}: {
  nombre: string;
  descripcion: string;
}) {
  return (
    <div className="flex w-72 flex-col rounded-md bg-[#008080] p-2 text-white">
      <h1 className="text-lg font-medium">{nombre}</h1>
      <span className="text-sm font-medium text-black">
        5 habitos - 2 horas
      </span>
      <span className="text-sm">{descripcion}</span>
    </div>
  );
}
