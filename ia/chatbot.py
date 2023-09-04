import openai

openai.api_key = "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"

while True:
    
    prompt = input("\n Dividir en 5 pasos simple la acción de: ")
    
    if prompt == "salir":
        break
    
    completion = openai.Completion.create(model="text-davinci-edit-001",
                                          messages=[{"role":"user", "content": prompt}])
    print(completion)