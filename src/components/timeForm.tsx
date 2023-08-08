import { XMarkIcon, CheckIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { Button } from "./ui/button";

export default function TimeForm({ afterSave }: { afterSave: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0.5, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-5"
    >
      <div className="flex w-full justify-end">
        <XMarkIcon
          className="h-5 w-5 cursor-pointer"
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
    </motion.div>
  );
}
