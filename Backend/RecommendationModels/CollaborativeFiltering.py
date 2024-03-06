import numpy as np
import pandas as pd
import seaborn as sns
from matplotlib import pyplot as plt
import scipy


movies_df = pd.read_csv('movies.csv', usecols=['movieId', 'title'], dtype = {'movieId':'int32', 'title':'str'})
rating_df = pd.read_csv('ratings.csv', usecols = ['userId', 'movieId', 'rating'],dtype={'userId': 'int32', 'movieId': 'int32', 'rating': 'float32'})
movies_df.head()


rating_df.head()


df = pd.merge(rating_df,movies_df,on='movieId')
df.head()


# Subset parameter defines in which columns to look for missing values.
combine_movie_rating = df.dropna(axis=0, subset=['title'])
movie_ratingCount = (combine_movie_rating.groupby(by=['title'])['rating'].count().reset_index().rename(columns={'rating':'totalRatingCount'}))[['title','totalRatingCount']]
movie_ratingCount.head()


# We here do left join based on title column in combine_movie_rating (as left dataframe) and title column in movie_ratingCount (as right dataframe)
rating_with_totalRatingCount = combine_movie_rating.merge(movie_ratingCount, left_on = 'title', right_on='title', how= 'left')
rating_with_totalRatingCount.head()


rating_with_totalRatingCount.sample(5)


# Describing the totalRatingCount column statistically
pd.set_option('display.float_format', lambda x: '%.3f' %x)
print(movie_ratingCount['totalRatingCount'].describe())



#movie_ratingCount.hist(column = 'totalRatingCount', bins =50, figsize=(20,5))
fig, ax = plt.subplots(figsize=(17,8))
plt.axvline(x=50,ymax=0.95, c='red', label = 'Threshold (50)');
sns.histplot(ax=ax, data = movie_ratingCount['totalRatingCount'], log_scale=True);
plt.legend(fontsize=25);


popularity_threshold = 50
rating_popular_movie = rating_with_totalRatingCount.query('totalRatingCount >= @popularity_threshold')
rating_popular_movie.head()


# Sampling the results of the query
rating_popular_movie.sample(5)


# Dimensions of my data
rating_popular_movie.shape


movie_features_df=rating_popular_movie.pivot_table(index='title',columns='userId',values='rating').fillna(0)
movie_features_df.head()


from scipy.sparse import csr_matrix # To convert pivot table to array matrix
movie_features_df_matrix = csr_matrix(movie_features_df.values)


# Remember this is not K - Nearest Neighbors classifier or regressor. It's NearestNeighbors
from sklearn.neighbors import NearestNeighbors
# Generally, we use KNN to find similar vectors based on euclidean distance, but here we use the distance metric as cosine score
model_knn = NearestNeighbors(metric = 'cosine', algorithm = 'brute')
model_knn.fit(movie_features_df_matrix)


movie_features_df.shape


# movie_features_df.shape[0] samples a vector
query_index = np.random.choice(movie_features_df.shape[0])
print(query_index)
# Getting euclidean distance based on cosine metric and indices of respective neighbors which are nearest
distances, indices = model_knn.kneighbors(movie_features_df.iloc[query_index,:].values.reshape(1,-1), n_neighbors=6)


# .flatten() returns a copy of the array collapsed into one dimension (row major).
for i in range(0, len(distances.flatten())):
    if i == 0:
        print('Recommendations for {0}:\n'.format(movie_features_df.index[query_index]))
    else:
        print('{0}: {1}, with distance of {2}:'.format(i, movie_features_df.index[indices.flatten()[i]], distances.flatten()[i]))