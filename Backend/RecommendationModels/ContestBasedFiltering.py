import pandas as pd

movies = pd.read_csv('movies.csv')
ratings = pd.read_csv('ratings.csv')

# Removing duplicate rows
movies.drop_duplicates(inplace=True)
ratings.drop_duplicates(inplace=True)

# Removing missing values
movies.dropna(inplace=True)
ratings.dropna(inplace=True)


from sklearn.preprocessing import OneHotEncoder

# Extracting the genres column
genres = movies['genres']

# Creating an instance of the OneHotEncoder
encoder = OneHotEncoder()

# Fitting and transforming the genres column
genres_encoded = encoder.fit_transform(genres.values.reshape(-1, 1))


from sklearn.neighbors import NearestNeighbors

# Creating an instance of the NearestNeighbors class
recommender = NearestNeighbors(metric='cosine')

# Fitting the encoded genres to the recommender
recommender.fit(genres_encoded.toarray())


# Index of the movie the user picked
movie_index = 0

# Number of recommendations to return
num_recommendations = 10

# Getting the recommendations
_, recommendations = recommender.kneighbors(genres_encoded[movie_index].toarray(), n_neighbors=num_recommendations)

# Extracting the movie titles from the recommendations
recommended_movie_titles = movies.iloc[recommendations[0]]['title']
print(recommended_movie_titles)