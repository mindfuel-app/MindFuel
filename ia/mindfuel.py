from fastapi import FastAPI, HTTPException
import pandas as pd
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://mindfuel.vercel.app", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"]
)

@app.get("/")
def home():
    return "Bienvenido a la aplicación de recomendación de tareas."

@app.post("/recomendar")
async def recomendar(title_: dict):
    # Validar la entrada
    title = title_.get('title', '')
    if len(title) < 5:
        raise HTTPException(status_code=400, detail="El título debe tener al menos 5 caracteres.")

    # Leer los datos de tareas y puntuaciones
    tareas = pd.read_csv('./input/tareas.csv')
    ratings = pd.read_csv('./input/puntuacion.csv')

    # Preprocesar los datos
    tareas["clean_title"] = tareas["Tareas"].apply(lambda x: re.sub("[^a-zA-Z0-9 ]", "", x))

    # Vectorizar y calcular similitud
    vectorizer = TfidfVectorizer(ngram_range=(1, 2))
    tfidf = vectorizer.fit_transform(tareas["clean_title"])

    def search(title):
        title = re.sub("[^a-zA-Z0-9 ]", "", title)
        query_vec = vectorizer.transform([title])
        similarity = cosine_similarity(query_vec, tfidf).flatten()
        indices = np.argpartition(similarity, -5)[-5:]
        results = tareas.iloc[indices]
        return results

    def find_similar_tarea(tarea_id):
        similar_users = ratings[(ratings["tarea_id"] == tarea_id) & (ratings["rating"] > 4)]["user_id"].unique()
        similar_user_recs = ratings[(ratings["user_id"].isin(similar_users)) & (ratings["rating"] > 4)]["tarea_id"]
        similar_user_recs = similar_user_recs.value_counts() / len(similar_users)
        similar_user_recs = similar_user_recs[similar_user_recs > .10]
        all_users = ratings[(ratings["tarea_id"].isin(similar_user_recs.index)) & (ratings["rating"] > 4)]
        all_user_recs = all_users["tarea_id"].value_counts() / len(all_users["user_id"].unique())

        rec_percentages = pd.concat([similar_user_recs, all_user_recs], axis=1)
        rec_percentages.columns = ["similar", "all"]

        rec_percentages["score"] = rec_percentages["similar"] / rec_percentages["all"]

        rec_percentages = rec_percentages.sort_values("score", ascending=False)
        rec_percentages = rec_percentages.head(5).merge(tareas, left_index=True, right_on="Id")[["Tareas", "Area"]]
        return rec_percentages

    # Obtener la recomendación
    results = search(title)
    tarea_id = results.iloc[0]["Id"]
    recomendacion = find_similar_tarea(tarea_id)

    return recomendacion.to_dict(orient='records')

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=10000)