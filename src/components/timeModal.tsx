import { XMarkIcon, CheckIcon } from "@heroicons/react/24/outline";
import { Button } from "./ui/button";

export default function TimeModal({ afterSave }: { afterSave: () => void }) {
  return (
    <div className="p-3">
      <div className="flex w-full justify-end">
        <XMarkIcon
          className="h-5 w-5"
          onClick={(e) => {
            e.preventDefault();
            afterSave();
          }}
        />
      </div>
      <div className="flex flex-col items-center gap-5 py-5">
        <input
          type="text"
          className="rounded-md border-2 border-gray-400 p-1 outline-none"
        />
        <Button className="h-10 w-10 rounded-full bg-[#5c7aff] p-3">
          <CheckIcon className="h-16 w-16" />
        </Button>
      </div>
    </div>
  );
}
