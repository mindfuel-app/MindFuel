interface DivisionTareaResponse {
  respuesta: string[];
}

export async function obtenerListaDePasos(tarea: string): Promise<string[]> {
  try {
    const response = await fetch("http://127.0.0.1:5000/dividir_tarea", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tareas: tarea }),
    });

    if (response.ok) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const data: DivisionTareaResponse = await response.json();
      return data.respuesta;
    } else {
      throw new Error("Error al procesar la solicitud.");
    }
  } catch (error) {
    console.error(error);
    throw new Error("Error de red o del servidor.");
  }
}
