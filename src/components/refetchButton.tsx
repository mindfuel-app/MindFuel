import { ArrowPathIcon } from "@heroicons/react/24/outline";

export default function RefetchButton({ refetch }: { refetch: () => void }) {
  return (
    <div
      className="no-highlight absolute right-3 top-5 cursor-pointer rounded-md p-1 active:bg-black/10 lg:hover:bg-black/10"
      onClick={void refetch()}
    >
      <ArrowPathIcon className="h-5 w-5" />
    </div>
  );
}
