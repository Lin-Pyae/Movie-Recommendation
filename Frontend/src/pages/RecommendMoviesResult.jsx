import { useEffect, useState } from 'react';
import MovieCard from '../components/MovieCard';

const getMovieDetails = (movieId) => {

    const API_KEY = '8ecbf28985308ca3b14b540321587f1f';

    return fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    });
};

const RecommendMoviesResult = () => {

    const [recommendedMovies, setRecommendedMovies] = useState([]);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      fetch('https://backend-url.com/recommendations')
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(movieIds => {
          return Promise.all(movieIds.map(getMovieDetails));
        })
        .then(movies => {
          setRecommendedMovies(movies);
        })
        .catch(error => {
          setError(error.toString());
        });
    }, []);
  
    if (error) {
      return <div>Error: {error}</div>;
    }

    const allRecommendData = recommendedMovies.map((obj, i) => {
        return <MovieCard movie={obj} key={i} />       
    });

    return (
        <section>
            <h1 className=" text-center text-5xl mt-4 font-bold leading-normal">Our Recommendations For You</h1>
            {allRecommendData}
        </section>

  )
}

export default RecommendMoviesResult