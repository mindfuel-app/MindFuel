export default function RoutineTaskCard({
  number,
  name,
}: {
  number: number;
  name: string;
}) {
  return (
    <div className="flex w-full">
      <div className="flex w-[15%] items-center justify-center rounded-l-md bg-teal p-2 text-white">
        {number}
      </div>
      <div className="flex w-full items-center rounded-r-md border-2 border-teal bg-white py-2 pl-3 text-black">
        {name}
      </div>
    </div>
  );
}
