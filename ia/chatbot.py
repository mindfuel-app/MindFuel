import openai
from flask import Flask, request, jsonify
import os
from dotenv import load_dotenv
from flask_cors import CORS, cross_origin
import re
load_dotenv()

openai.api_type = "azure"
openai.api_base = "https://mindfuel.openai.azure.com/"
openai.api_version = "2023-07-01-preview"
openai.api_key = os.getenv("OPENAI_API_KEY")

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"], supports_credentials=True)
@app.route("/")
@cross_origin(origin='*')

@app.route("/home")
def home():
    return jsonify({"message":"Hello, World!"})
    

@app.route('/dividir_tarea', methods=['POST'])
def procesar_tarea():
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
    
    data = request.get_json()  # Obtener datos como JSON
    tarea = data.get('tareas', '')
    print(tarea)
    if len(tarea) < 3:
        return ()
    else:
        respuesta = dividir_tarea_en_pasos(tarea)
        print(respuesta)
        return jsonify(respuesta)

if __name__ == '__main__':
    app.run()
