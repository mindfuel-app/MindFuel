from fastapi import FastAPI, HTTPException
import pandas as pd
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import csv
import mysql.connector as sql
import os
from dotenv import load_dotenv

app = FastAPI()
load_dotenv()

@app.get("/")
def home():
    return "Hello, World"

@app.post("/recomendar")
async def recomendar(title: str):
    conn = sql.connect(
        host=os.getenv("DB_HOST"),
        user=os.getenv("DB_USERNAME"),
        passwd=os.getenv("DB_PASSWORD"),
        db=os.getenv("DB_NAME")
    )

    cursor = conn.cursor()

    cursor.execute("SELECT name, description, estimated_time, id  FROM task")
    result = cursor.fetchall()
    cursor.close()

    # Guardar los resultados en un archivo CSV
    with open('tareas.csv', 'w', newline='', encoding='utf-8') as csvfile:
        fieldnames = ['Tareas', 'Descripcion', 'Duracion', 'Id']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        for row in result:
            writer.writerow({'Tareas': row[0], 'Descripcion': row[1], 'Duracion': row[2], 'Id': row[3]})

    tareas = pd.read_csv('tareas.csv')
    ratings = pd.read_csv("./input/puntuacion.csv")

    def clean_title(title):
        return re.sub("[^a-zA-Z0-9 ]", "", title)

    tareas["clean_title"] = tareas["Tareas"].apply(clean_title)

    vectorizer = TfidfVectorizer(ngram_range=(1, 2))

    tfidf = vectorizer.fit_transform(tareas["clean_title"])

    def search(title):
        title = clean_title(title)
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
        rec_percentages = rec_percentages.head(10).merge(tareas, left_index=True, right_on="Id")[["Tareas", "Area"]]
        return rec_percentages

    # Mostrar la tabla de tareas
    if len(title) > 5:
        results = search(title)
        tarea_id = results.iloc[0]["Id"]
        recomendacion = find_similar_tarea(tarea_id)
    else:
        recomendacion = pd.DataFrame()
        warning = "Ingrese por lo menos 5 caracteres."
        raise HTTPException(status_code=400, detail=warning)

    return recomendacion.to_dict(orient='records')

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=10000)