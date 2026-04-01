import SelfCareLayout from "~/components/layouts/selfCareLayout";
import { OptionLayout } from ".";
import Image from "next/image";
import { api } from "~/utils/api";
import { useState } from "react";
import { CircularProgress } from "@mui/material";
import toast, { Toaster } from "react-hot-toast";
import { cn } from "~/lib/utils";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function DiarioPersonal() {
  const router = useRouter();
  const { data: sessionData, status } = useSession();
  const { data: previousNotes, refetch: refetchNotes } =
    api.selfCare.getNotes.useQuery();
  const [note, setNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showOldNotes, setShowOldNotes] = useState(false);
  const trimmedNote = note.trim();
  const { mutate: createNote } = api.selfCare.createNote.useMutation({
    onSuccess: () => {
      setNote("");
      setIsSaving(false);
      toast.success("Nota guardada con éxito");
      void refetchNotes();
    },
    onError: () => {
      setIsSaving(false);
      toast.error("No pudimos guardar la nota. Intenta nuevamente.");
    },
  });

  if (status == "unauthenticated") return void router.push("/signin");

  if (!sessionData) return;

  return (
    <SelfCareLayout sessionData={sessionData}>
      <span className="ml-3 mt-1 flex w-full items-center justify-start text-lg">
        {showOldNotes ? (
          <button
            type="button"
            onClick={() => setShowOldNotes(false)}
            className="font-medium text-sky-500 underline-offset-2 hover:underline"
          >
            Volver
          </button>
        ) : (
          <>
            Ver&nbsp;
            <button
              type="button"
              onClick={() => {
                void refetchNotes();
                setShowOldNotes(true);
              }}
              className="font-medium text-sky-500 underline-offset-2 hover:underline"
            >
              mis notas
            </button>
          </>
        )}
      </span>
      {showOldNotes && previousNotes ? (
        <motion.div
          initial={{ opacity: 0.5, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex w-full flex-col items-center gap-5 pt-5"
        >
          {previousNotes.length == 0 ? (
            <div className="mt-10 max-w-[250px] text-center text-xl">
              No tienes ninguna nota.{" "}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setShowOldNotes(false);
                }}
                className="text-2xl font-medium text-sky-500 underline-offset-2 hover:underline"
              >
                Crea una nueva
              </button>
            </div>
          ) : (
            <>
              {previousNotes.map((item) => (
                <Note
                  key={item.id}
                  id={item.id}
                  date={item.createdAt}
                  content={item.note}
                />
              ))}
            </>
          )}
        </motion.div>
      ) : (
        <OptionLayout title="Diario personal">
          <div className="flex h-[160px] w-[160px] items-center justify-center rounded-full border-2 border-[#b17c54] bg-white">
            <Image
              width={80}
              height={80}
              alt="Diario personal"
              src={`/self-care/diario.png`}
            />
          </div>{" "}
          <p className="max-w-[290px] text-center text-xl">
            Este es tu lugar seguro, puedes escribir lo que desees.
          </p>
          <label htmlFor="journal-note" className="sr-only">
            Escribe tu nota personal
          </label>
          <textarea
            id="journal-note"
            value={note}
            placeholder="Escribe tu nota aquí..."
            className={cn(
              "h-36 w-full resize-none rounded-lg border-2 border-gray-500 px-2 py-1 outline-none focus:border-gray-700",
              isSaving && "opacity-50"
            )}
            onChange={(e) => {
              e.preventDefault();
              setNote(e.target.value);
            }}
          />
          <button
            aria-disabled={isSaving}
            onClick={(e) => {
              e.preventDefault();
              if (trimmedNote.length == 0 || isSaving) return;
              setIsSaving(true);
              createNote({
                note: trimmedNote,
              });
            }}
            disabled={trimmedNote.length == 0 || isSaving}
            className={cn(
              "no-highlight flex h-10 w-24 items-center justify-center rounded-3xl bg-[#b17c54] px-4 py-2 text-white transition-colors active:bg-[#b17c54]/80",
              (isSaving || trimmedNote.length == 0) &&
                "cursor-not-allowed opacity-50"
            )}
          >
            {!isSaving ? (
              <span className="font-medium">Guardar</span>
            ) : (
              <CircularProgress color="inherit" size={20} />
            )}
          </button>
        </OptionLayout>
      )}
      <Toaster />
    </SelfCareLayout>
  );
}

function Note({
  id,
  date,
  content,
}: {
  id: string;
  date: Date;
  content: string;
}) {
  const noteMaxLength = 70;
  const [showFullNote, setShowFullNote] = useState(
    content.length <= noteMaxLength
  );
  const utils = api.useContext();
  const { mutate: deleteNote } = api.selfCare.deleteNote.useMutation({
    onSuccess: async () => {
      await utils.selfCare.getNotes.invalidate();
      toast.success("Nota eliminada con éxito");
    },
    onError: () => {
      toast.error("No pudimos borrar la nota. Intenta nuevamente.");
    },
  });

  return (
    <div className="flex w-[80%] max-w-md flex-col gap-1 overflow-hidden rounded-lg bg-white p-3">
      <div className="flex w-full items-center justify-between">
        <span>Fecha: {date.toLocaleDateString()}</span>
        <button
          type="button"
          onClick={() => {
            deleteNote({
              id,
            });
          }}
          className="font-medium text-sky-500 underline-offset-2 hover:underline"
        >
          Borrar
        </button>
      </div>
      <p>
        {showFullNote ? (
          <>
            {content}{" "}
            {content.length > noteMaxLength && (
              <button
                type="button"
                onClick={() => setShowFullNote(false)}
                className="font-medium text-sky-500 underline-offset-2 hover:underline"
              >
                Ver menos
              </button>
            )}
          </>
        ) : (
          <>
            {content.substring(0, noteMaxLength).concat("...")}{" "}
            <button
              type="button"
              onClick={() => setShowFullNote(true)}
              className="font-medium text-sky-500 underline-offset-2 hover:underline"
            >
              Ver más
            </button>
          </>
        )}
      </p>
    </div>
  );
}
