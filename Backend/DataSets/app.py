import os
from flask import Flask, request, jsonify
import pandas as pd
from sklearn.preprocessing import OneHotEncoder
from sklearn.neighbors import NearestNeighbors
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

recommendations = []

# Load the data
movies = pd.read_csv('movies.csv')
ratings = pd.read_csv('ratings.csv')
links = pd.read_csv('links.csv')  # Load the links data

# Remove duplicates and missing values
movies.drop_duplicates(inplace=True)
ratings.drop_duplicates(inplace=True)
links.drop_duplicates(inplace=True)
movies.dropna(inplace=True)
ratings.dropna(inplace=True)
links.dropna(inplace=True)

# Extract genres
genres = movies['genres']

# Encode genres
encoder = OneHotEncoder()
genres_encoded = encoder.fit_transform(genres.values.reshape(-1, 1))

# Initialize recommender
recommender = NearestNeighbors(metric='cosine')
recommender.fit(genres_encoded.toarray())

@app.route('/')
def home():
    return 'Hello, this is the homepage!'

@app.route('/randomOptions', methods=['GET'])
def get_random_options():
    data_quan = int(request.args.get('quan', 10))
    random_data = pd.merge(movies, links, on='movieId').sample(n=data_quan)
    result_list = [{"id": tmdb_id, "title": title} for tmdb_id, title in zip(random_data['tmdbId'], random_data['title'])]
    return jsonify({"result": result_list})


@app.route('/recommendations', methods=['GET', 'POST'])
def get_recommendations():
    if request.method == 'POST':
        # Handle POST request to receive chosen movies data
        data = request.get_json()
        chosen_movies = data
        tmdb_ids = [movie['movie_id'] for movie in chosen_movies]

        movie_ids = links[links['tmdbId'].isin(tmdb_ids)]['movieId'].tolist()

        recommendations = []
        for movie_id in movie_ids:
            movie_index = movies.index[movies['movieId'] == movie_id][0]
            _, recs = recommender.kneighbors(genres_encoded[movie_index].toarray(), n_neighbors=10)
            recommendations.extend(recs[0])

        recommended_tmdb_ids = links[links['movieId'].isin(recommendations)]['tmdbId'].tolist()

        # Store the recommendations in the global variable
        recommendations = recommended_tmdb_ids

        return jsonify({'recommendations': recommended_tmdb_ids})

    # elif request.method == 'GET':
    #     # Handle GET request to return recommended TMDB IDs
    #     recommended_tmdb_ids = [862, 8844, 15602]  # Placeholder for actual recommended TMDB IDs
    #     return jsonify({'recommendations': recommendations})

    else:
        # If any other method is used, return a 405 Method Not Allowed status
        return jsonify({'error': 'Method not allowed'}), 405

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port)