import pandas as pd
import streamlit as st
from sklearn.preprocessing import OneHotEncoder
from sklearn.neighbors import NearestNeighbors
import requests

# Load the movies.csv, links.csv, and ratings.csv files
movies_df = pd.read_csv('movies.csv')
links_df = pd.read_csv('links.csv')
ratings_df = pd.read_csv('ratings.csv')

# Merge the movies and links dataframes on the 'movieId' column
movies_df = pd.merge(movies_df, links_df, on='movieId')

# Count the number of ratings for each movie
movie_ratings_count = ratings_df['movieId'].value_counts()

# Get the top 100 movies with the most ratings
top_rated_movies_df = movies_df[movies_df['movieId'].isin(movie_ratings_count.index[:30])]

# TMDB API base URL for getting movie details
TMDB_API_BASE_URL = "https://api.themoviedb.org/3/movie"

# Your TMDB API key
TMDB_API_KEY = "e658f60cafc89aaf0cda12cb8786293a"

# Function to get the TMDB movie poster path
def get_movie_poster_path(tmdb_id):
    response = requests.get(f"{TMDB_API_BASE_URL}/{tmdb_id}", params={
        "api_key": TMDB_API_KEY
    })
    data = response.json()
    if 'poster_path' in data and data['poster_path']:
        return "https://image.tmdb.org/t/p/w500" + data['poster_path']
    else:
        return None

# Extract all unique genres
genres = set()
for genre_str in movies_df['genres']:
    genres.update(genre_str.split('|'))
genres = sorted(list(genres))

# Create a select box for genres
selected_genre = st.selectbox('Select a genre', ['All'] + genres)

# Filter the movies based on the selected genre
if selected_genre == 'All':
    filtered_movies_df = movies_df
else:
    filtered_movies_df = movies_df[movies_df['genres'].str.contains(selected_genre)]

# Update the list of movie titles
movie_titles = filtered_movies_df['title'].tolist()

# Create a multiselect widget for selecting movies
selected_movies = st.multiselect('Select at least a movie', movie_titles, [])

if len(selected_movies) >= 1:

    # Clear the output area containing the top movies
    top_movies_placeholder = st.empty()

        # Display the selected movies
    st.write('The Movie(s) You Picked:')
    for selected_movie in selected_movies:
        tmdb_id = movies_df.loc[movies_df['title'] == selected_movie, 'tmdbId'].values[0]
        poster_path = get_movie_poster_path(tmdb_id)
        if poster_path:
            st.image(poster_path, width=200)
        st.write(selected_movie)

    # Display the recommend button
    if st.button('Recommend'):
        # Collaborative filtering recommendation system
        # Extracting the genres column
        genres = filtered_movies_df['genres']
        # Creating an instance of the OneHotEncoder
        encoder = OneHotEncoder()
        # Fitting and transforming the genres column
        genres_encoded = encoder.fit_transform(genres.values.reshape(-1, 1))
        # Creating an instance of the NearestNeighbors class
        recommender = NearestNeighbors(metric='cosine')
        # Fitting the encoded genres to the recommender
        recommender.fit(genres_encoded.toarray())
        
        # Get the indices of selected movies
        selected_movie_indices = [filtered_movies_df.index[filtered_movies_df['title'] == movie].tolist()[0] for movie in selected_movies]
        
        # Combine the encoded genres of selected movies
        combined_genres_encoded = genres_encoded[selected_movie_indices].toarray().sum(axis=0)
        
        # Number of recommendations to return
        num_recommendations = 10
        # Getting the recommendations
        _, recommendations = recommender.kneighbors(combined_genres_encoded.reshape(1, -1), n_neighbors=num_recommendations)
        # Extracting the movie titles from the recommendations
        recommended_movie_titles = filtered_movies_df.iloc[recommendations[0]]['title']

        # Filter out selected movies from recommended movie titles
        recommended_movie_titles = [title for title in recommended_movie_titles if title not in selected_movies]

        # Display the recommended movies in rows of three
        st.write('Recommended Movies For You:')
        # Divide the layout into three columns
        columns = st.columns(3)
        count = 0
        for recommended_movie in recommended_movie_titles:
            tmdb_id = movies_df.loc[movies_df['title'] == recommended_movie, 'tmdbId'].values[0]
            poster_path = get_movie_poster_path(tmdb_id)
            if poster_path:
                with columns[count % 3]:
                    st.image(poster_path, width=200)
                    st.write(recommended_movie)
                count += 1
            else:
                with columns[count % 3]:
                    st.write(recommended_movie)
                count += 1

        # Clear the output area containing the top movies
        top_movies_placeholder.empty()
else:
    st.warning('Please select at least 1 movie to get recommendations.')

    # Display the top 100 movies with the most user ratings
    st.write('Top 30 Movies with Most User Ratings:')

    # Divide the layout into 3 columns
    columns = st.columns(3)

    # Counter to keep track of movies displayed
    count = 0

    # Iterate through the top rated movies
    for _, row in top_rated_movies_df.iterrows():
        tmdb_id = row['tmdbId']
        poster_path = get_movie_poster_path(tmdb_id)
        
        # Display the movie poster and title in a separate column
        with columns[count % 3]:
            if poster_path:
                st.image(poster_path, width=200)
            st.write(row['title'])
        
        count += 1