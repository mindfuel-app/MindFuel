import openai
from flask import Flask, request, jsonify
import os
from dotenv import load_dotenv
load_dotenv()

openai.api_type = "azure"
openai.api_base = "https://mindfuel.openai.azure.com/"
openai.api_version = "2023-07-01-preview"
openai.api_key = os.getenv("OPENAI_API_KEY")

app = Flask(__name__)

def dividir_tarea_en_pasos(prompt):
    solicitud = [
        {"role": "user", "content": prompt},
        {"role": "assistant", "content": "Divide la tarea en 3 pasos más simples y cortos, sin explayarte tanto:"}
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
    return respuesta

@app.route('/dividir_tarea', methods=['POST'])
def procesar_tarea():
    data = request.get_json()
    tarea = data.get('tarea')

    respuesta = dividir_tarea_en_pasos(tarea)

    return jsonify({"respuesta": respuesta})

if __name__ == '__main__':
    app.run()
