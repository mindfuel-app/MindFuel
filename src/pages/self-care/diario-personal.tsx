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
    api.selfCare.getNotes.useQuery({
      user_id: sessionData?.user.id ?? "",
    });
  const [note, setNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showOldNotes, setShowOldNotes] = useState(false);
  const { mutate: createNote } = api.selfCare.createNote.useMutation();

  if (status == "unauthenticated") return void router.push("/signin");

  if (!sessionData) return;

  return (
    <SelfCareLayout sessionData={sessionData}>
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
      {showOldNotes && previousNotes ? (
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
          <textarea
            value={note}
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
              setIsSaving(true);
              setTimeout(() => {
                createNote({
                  note,
                  user_id: sessionData.user.id,
                });
                setNote("");
                setIsSaving(false);
                toast.success("Nota guardada con éxito");
              }, 600);
            }}
            className={cn(
              "no-highlight flex h-10 w-24 items-center justify-center rounded-3xl bg-[#b17c54] px-4 py-2 text-white transition-colors active:bg-[#b17c54]/80",
              isSaving && "opacity-50"
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
  refetchNotes,
}: {
  id: string;
  date: Date;
  content: string;
  refetchNotes: void;
}) {
  const noteMaxLength = 70;
  const [showFullNote, setShowFullNote] = useState(
    content.length <= noteMaxLength
  );
  const { mutate: deleteNote } = api.selfCare.deleteNote.useMutation();

  return (
    <div className="flex w-[80%] max-w-md flex-col gap-1 overflow-hidden rounded-lg bg-white p-3">
      <div className="flex w-full items-center justify-between">
        <span>Fecha: {date.toLocaleDateString()}</span>
        <span
          onClick={() => {
            deleteNote({
              id,
            });
            refetchNotes;
          }}
          className="text-sky-500 active:underline"
        >
          Borrar
        </span>
      </div>
      <p>
        {showFullNote ? (
          <>
            {content}{" "}
            {content.length > noteMaxLength && (
              <span
                onClick={() => setShowFullNote(false)}
                className="text-sky-500 active:underline"
              >
                Ver menos
              </span>
            )}
          </>
        ) : (
          <>
            {content.substring(0, noteMaxLength).concat("...")}{" "}
            <span
              onClick={() => setShowFullNote(true)}
              className="text-sky-500 active:underline"
            >
              Ver mas
            </span>
          </>
        )}
      </p>
    </div>
  );
}
