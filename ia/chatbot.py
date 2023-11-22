import openai
import os
from dotenv import load_dotenv
import re
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

openai.api_key=os.environ.get("OPENAI_API_KEY")

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://mindfuel.vercel.app","http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET","POST","OPTIONS"],
    allow_headers=["*"]
)

@app.get("/home")
async def home():
    return {"message": "Hello, World!"}

@app.post('/dividir_tarea')
async def procesar_tarea(tarea: dict):
    def dividir_tarea_en_pasos(prompt):
        solicitud = [
            {"role": "user", "content": prompt},
            {"role": "assistant", "content": "Divide la tarea en 4 pasos más simples y cortos, en una oracion, sin explayarte demasiado."}
        ]

        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=solicitud,
            temperature=0.7,
            max_tokens=150,
            top_p=0.95,
            frequency_penalty=0,
            presence_penalty=0,
            stop=None
        )

        respuesta = response['choices'][0]['message']['content']
        respuesta = respuesta.replace('\n', '')
        pasos = re.split(r'\d+\.\s*', respuesta)
        # Filtra los elementos vacíos en la lista de pasos
        pasos = list(filter(None, pasos))
        print(pasos)
        return pasos

    tarea_texto = tarea.get('tareas', '')
    
    if len(tarea_texto) < 3:
        raise HTTPException(status_code=400, detail="La tarea es demasiado corta")
    else:
        respuesta = dividir_tarea_en_pasos(tarea_texto)
        return respuesta

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=10000)