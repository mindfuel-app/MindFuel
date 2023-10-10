import openai
import os
from dotenv import load_dotenv
import re
from flask import Flask, request, jsonify

load_dotenv()

openai.api_type = "azure"
openai.api_base = "https://mindfuel.openai.azure.com/"
openai.api_version = "2023-07-01-preview"
openai.api_key = os.getenv("OPENAI_API_KEY")

app = Flask(__name__)

@app.route("/home", methods=["GET"])
def home():
    return jsonify({"message": "Hello, World!"})

@app.route('/dividir_tarea', methods=["POST"])
def procesar_tarea():
    tarea = request.get_json()
    
    def dividir_tarea_en_pasos(prompt):
        solicitud = [
            {"role": "user", "content": prompt},
            {"role": "assistant", "content": "Divide la tarea en 4 pasos más simples y cortos, sin explayarte tanto:"}
        ]

        response = openai.ChatCompletion.create(
            engine="mindfuel",
            messages=solicitud,
            temperature=0.7,
            max_tokens=200,
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
        return pasos

    tarea_texto = tarea.get('tareas', '')
    
    if len(tarea_texto) < 3:
        return jsonify({"error": "La tarea es demasiado corta"}), 400
    else:
        respuesta = dividir_tarea_en_pasos(tarea_texto)
        return jsonify(respuesta)

if __name__ == "__main__":
    app.run()
