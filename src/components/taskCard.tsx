import { Checkbox } from "./ui/checkbox";

export type Task = {
  id: number;
  number: number;
  name: string;
};

export function TaskCard({ number, name }: { number: number; name: string }) {
  return (
    <div className="flex w-full">
      <div className="w-[15%] rounded-l-md bg-teal p-2 text-center text-white">
        {number}
      </div>
      <div className="relative flex w-full items-center justify-start rounded-r-md border-2 border-teal bg-white pl-3">
        <span className="text-black">{name}</span>
        <div className="group absolute -right-3 flex h-8 w-8 items-center justify-center rounded-full border-2 border-teal bg-white active:bg-gray-200 lg:hover:bg-gray-200">
          <Checkbox className="no-highlight border-0 group-active:border-gray-200 group-active:bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
