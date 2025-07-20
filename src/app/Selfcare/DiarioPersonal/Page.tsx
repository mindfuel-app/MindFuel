"use client";

import OptionLayout from "../Components/OptionLayout";
import { api } from "~/utils/api";
import { useState } from "react";
import { CircularProgress } from "@mui/material";
import toast, { Toaster } from "react-hot-toast";
import { cn } from "~/lib/utils";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import Note from "../Components/Note";

export default function DiarioPersonal() {
  const { data: sessionData } = useSession();

  const { data: previousNotes, refetch: refetchNotes } =
    api.selfCare.getNotes.useQuery({
      user_id: sessionData?.user.id ?? "",
    });

  const [note, setNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showOldNotes, setShowOldNotes] = useState(false);
  const { mutate: createNote } = api.selfCare.createNote.useMutation();

  if (!sessionData) return null;

  const handleSave = () => {
    if (!note.trim()) return;
    setIsSaving(true);
    createNote(
      {
        user_id: sessionData.user.id,
        note,
      },
      {
        onSuccess: () => {
          toast.success("Nota guardada");
          setNote("");
          void refetchNotes();
        },
        onError: () => {
          toast.error("Error al guardar la nota");
        },
        onSettled: () => {
          setIsSaving(false);
        },
      }
    );
  };

  return (
    <OptionLayout title="Diario personal">
      <Toaster />
      <span className="ml-3 mt-1 flex w-full items-center justify-start text-lg">
        {showOldNotes ? (
          <span
            onClick={() => setShowOldNotes(false)}
            className="text-sky-500 active:underline"
          >
            Volver
          </span>
        ) : (
          <>
            Ver&nbsp;
            <span
              onClick={() => {
                void refetchNotes();
                setShowOldNotes(true);
              }}
              className="text-sky-500 active:underline"
            >
              mis notas
            </span>
          </>
        )}
      </span>

      {showOldNotes && previousNotes && (
        <motion.div
          initial={{ opacity: 0.5, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex w-full flex-col items-center gap-5 pt-5"
        >
          {previousNotes.length == 0 ? (
            <div className="mt-10 max-w-[250px] text-center text-xl">
              No tienes ninguna nota.{" "}
              <span
                onClick={(e) => {
                  e.preventDefault();
                  setShowOldNotes(false);
                }}
                className="text-2xl text-sky-500 active:underline"
              >
                Crea una nueva
              </span>
            </div>
          ) : (
            <>
              {previousNotes.map((item) => (
                <Note
                  key={item.id}
                  id={item.id}
                  date={item.createdAt}
                  content={item.note}
                  refetchNotes={void refetchNotes()}
                />
              ))}
            </>
          )}
        </motion.div>
      )}

      {!showOldNotes && (
        <div className="mt-5 flex w-full max-w-md flex-col gap-4">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="h-40 w-full rounded-md border p-2 text-sm"
            placeholder="Escribí lo que quieras..."
          />
          <button
            disabled={isSaving}
            onClick={handleSave}
            className={cn(
              "rounded-md bg-sky-500 px-4 py-2 text-white",
              isSaving && "opacity-50"
            )}
          >
            {isSaving ? <CircularProgress size={20} /> : "Guardar"}
          </button>
        </div>
      )}
    </OptionLayout>
  );
}
