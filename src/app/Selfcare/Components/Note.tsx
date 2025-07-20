import { useState } from "react";
import { api } from "~/utils/api";

export default function Note({
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
