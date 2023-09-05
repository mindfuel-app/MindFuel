from flask import Flask, request,jsonify
import pandas as pd
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from flask_cors import CORS
import mysql.connector as sql
import os
from dotenv import load_dotenv

app = Flask(__name__)
cors = CORS(app)
load_dotenv()

@app.route("/")
def home():
    return "hello world"

@app.route("/recomendar", methods = ['GET','POST'])

def recomendar():

    #conexión al .env
    db_host = os.getenv("DB_HOST")
    db_user = os.getenv("DB_USER")
    db_password = os.getenv("DB_PASSWORD")
    db_database = os.getenv("DB_DATABASE")

    #conexion a la base de datos
    conn = sql.connect(host=db_host,
                   user=db_user,
                   password=db_password,
                   db=db_database,
                    )
    
    cursor = conn.cursor()

    #query: falta sacar los datos necesarios para la recomendación
    cursor.execute("SELECT * FROM User")
    result = cursor.fetchall()
    rows_list = []
    for row in result:
        rows_list.append(row)
    cursor.close()

    for row in rows_list:
        print(row)

    #borrar una vez hecha la conexion con la base de datos
    tareas = pd.read_csv("./input/tareas.csv")
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
    data = request.form
    title = data.get('tareas', '')
    print(title)
    if len(title) > 5:
        results = search(title)
        tarea_id = results.iloc[0]["Id"]
        recomendacion = find_similar_tarea(tarea_id)
    recomendacion_data = recomendacion.to_dict(orient='records')
    return jsonify(recomendacion_data)
    

if __name__ == "__main__":
    app.run()