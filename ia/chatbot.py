import openai
from flask import Flask, request, jsonify

# Reemplaza con tu clave de API
openai.api_key = "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"

app = Flask(__name__)

def dividir_tarea_en_pasos(prompt):
    # Crear una solicitud para dividir la tarea en pasos
    solicitud = [
        {"role": "user", "content": prompt},
        {"role": "assistant", "content": "Divide la tarea en pasos más simples:"}
    ]
    
    # Utilizar la API de OpenAI para obtener una respuesta
    response = openai.Completion.create(
        model="gpt-3.5-turbo",
        messages=solicitud,
        max_tokens=50  # Puedo ajustar este valor para obtener más o menos pasos
    )
    
    # Extraer los pasos sugeridos del resultado
    pasos = [message['content'] for message in response['choices'][0]['message']['messages'] if message['role'] == 'assistant']
    
    return pasos

@app.route('/dividir_tarea', methods=['POST'])
def procesar_tarea():
    data = request.get_json()
    tarea = data.get('tarea')
    
    pasos = dividir_tarea_en_pasos(tarea)
    
    return jsonify(pasos)

if __name__ == '__main__':
    app.run()