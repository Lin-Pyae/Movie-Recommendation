import { useEffect, useState, useContext } from 'react';
import MovieCard from '../components/MovieCard';
// import { RandomMoviesContainer } from "../main";
import "../css/main.css"

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

// const RecommendMoviesResult = () => {

//     const { recommendedMovies, setRecommendedMovies } = useContext(RandomMoviesContainer);
//     const [error, setError] = useState(null);
  
//     useEffect(() => {
//       fetch('http://127.0.0.1:5000/your/api/endpoint')
//           .then(response => {
//               if (!response.ok) {
//                   throw new Error(`HTTP error! status: ${response.status}`);
//               }
//               return response.json();
//           })
//           .then(data => {
//               const movieIds = data.recommendations;
//               console.log(movieIds);
//               return Promise.all(movieIds.map(getMovieDetails));
//           })
//           .then(movies => {
//               setRecommendedMovies(movies);
//           })
//           .catch(error => {
//               setError(error.toString());
//           });
//   }, []);
  
  

//     useEffect(() => {
//       //movie IDs for testing
//       const movieIds = [862, 8844, 15602];

//       Promise.all(movieIds.map(getMovieDetails))
//         .then(movies => {
//           setRecommendedMovies(movies);
//         })
//         .catch(error => {
//           setError(error.toString());
//         });
//     }, []);
  
//     if (error) {
//       return <div>Error: {error}</div>;
//     }

//     return (
//       <section className=' mx-60 my-10'>
//         <h1 className="text-center text-5xl mt-4 font-bold leading-normal my-10 bebas-neue-regular">Our Recommendations For You</h1>
//         <div className='flex flex-wrap justify-cente gap-20'>
//           {recommendedMovies.map((movie) => (
//             <MovieCard movie={movie} key={movie.id} />
//           ))}
//         </div>
//     </section>
//     )
// }

// export default RecommendMoviesResult

const RecommendMoviesResult = ({ recommendedMovies }) => {
  const [movieDetails, setMovieDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      // Fetch details for each recommended movie
      Promise.all(recommendedMovies.map(movieId => getMovieDetails(movieId)))
          .then(details => {
              setMovieDetails(details.filter(detail => detail !== null)); // Filter out null values
              setLoading(false);
          })
          .catch(error => console.error(error));
  }, [recommendedMovies]);

  if (loading) {
      return <div>Loading...</div>;
  }

  return (
      <section className='mx-60 my-10' >
          <h1 className="text-center text-5xl mt-4 font-bold leading-normal my-10 bebas-neue-regular">Our Recommendations For You</h1>
          <div className='flex flex-wrap justify-cente gap-20'>
              {movieDetails.map((movie) => (
                  <MovieCard movie={movie} key={movie.id} />
              ))}
          </div>
      </section>
  );
}

export default RecommendMoviesResult;