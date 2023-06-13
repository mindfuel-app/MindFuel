/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Layout from "~/components/layout";
import React, { useState, type SyntheticEvent } from "react";

export default function Recommend({ children }: { children: React.ReactNode }) {
  const [recomendacion, setRecomendacion] = useState<any[]>([]);

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    const target = event.target as typeof event.target & {
      tareas: { value: string };
    };

    console.log(target.tareas.value);
    try {
      const formData = new FormData();
      formData.append("tareas", target.tareas.value);

      const response = await fetch("http://127.0.0.1:5000/recomendar", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        setRecomendacion(data);
      } else {
        console.log("Error:", response.status);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      <div>Tareas</div>
      <div className="recomendar">
        <form onSubmit={handleSubmit}>
          <input type="text" name="tareas" placeholder="Tarea" required />
          <button type="submit" className="btn btn-primary btn-block btn-large">
            Recomendar
          </button>
        </form>
        <ul>
          {recomendacion.map((item, index) => (
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            <li key={index}>{item.Tareas}</li>
          ))}
        </ul>
      </div>
    </Layout>
  );
}
