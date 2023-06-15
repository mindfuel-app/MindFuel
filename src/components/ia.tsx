/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useState, SyntheticEvent } from "react";

interface Recommendation {
  Tareas: string;
  // Add other properties if available
}

export default function Recommend() {
  const [recomendacion, setRecomendacion] = useState<Recommendation[]>([]);
  const [warning, setWarning] = useState<string>("");

  const handleSubmit = async (event: SyntheticEvent): Promise<void> => {
    event.preventDefault();
    const target = event.target as typeof event.target & {
      tareas: { value: string };
    };

    console.log(target.tareas.value);
    try {
      const formData = new FormData();
      formData.append("tareas", target.tareas.value);

      const response: Response = await fetch(
        "http://127.0.0.1:5000/recomendar",
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const data: Recommendation[] | { warning: string } = await response.json();
        console.log(data);
        if ("warning" in data) {
          setWarning(data.warning);
          setRecomendacion([]);
        } else {
          setWarning("");
          setRecomendacion(data);
        }
      } else {
        console.log("Error:", response.status);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="recomendar">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="tareas"
          placeholder={warning ? `Error: ${warning}` : "Tarea"}
          required
        />
        <button type="submit" className="btn btn-primary btn-block btn-large">
          Recomendar
        </button>
      </form>
      <ul>
        {recomendacion.length > 0 ? (
          recomendacion.map((item: Recommendation, index: number) => (
            <li key={index}>{item.Tareas}</li>
          ))
        ) : null}
      </ul>
    </div>
  );
}
