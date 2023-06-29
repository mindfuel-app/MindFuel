export default function TaskCard({
  numeroTarea,
  nombreTarea,
}: {
  numeroTarea: number;
  nombreTarea: string;
}) {
  return (
    <div className="flex w-72">
      <div className="w-[15%] rounded-l-md bg-[#008080] p-2 text-center text-white">
        {numeroTarea}
      </div>
      <div className="flex w-full items-center justify-start rounded-r-md border-2 border-[#008080] bg-white pl-3">
        <span>{nombreTarea}</span>
      </div>
    </div>
  );
}
