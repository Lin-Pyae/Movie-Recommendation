import { useEffect, useState, useContext } from 'react';
import MovieCard from '../components/MovieCard';
import { RandomMoviesContainer } from "../main";
import "../css/main.css"
import {motion} from 'framer-motion';
import { FaArrowLeft } from "react-icons/fa";
import {Link} from 'react-router-dom';

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

  const { recommendedMovies } = useContext(RandomMoviesContainer);

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
    return (
      <div className="w-screen h-screen flex items-center justify-center text-2xl p-12 flex-col gap-8 overflow-hidden">
        <h1 className="text-4xl font-bold text-gradient">Loading</h1>
      </div>
    );
}


  if (movieDetails.length === 0) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center text-center p-12">
        <h1 className="text-4xl font-bold mb-4">No Movie Details Yet</h1>
        <p className="text-xl mb-8">Go back to home and choose some movies to generate recommendations.</p>
        <Link to="/" className="py-2 px-4 bg-[#f8b500] text-white rounded hover:bg-yellow-700 transition-colors">
          <FaArrowLeft className="inline-block mr-2" /> Go Home
        </Link>
      </div>
    );
  }

  return (
      <section className='mx-60 my-10' >
        <motion.div 
          initial={{ x: -1000 }}
          animate={{ x:  0}}
          transition={{ duration: 1, delay: .2}}
          className='fixed top-10 left-20'>
            <Link to='/'>
                <div className='text-xl bg-[#f8b500] text-white py-3 px-4 flex justify-center items-center gap-8'>
                    <FaArrowLeft />Home Page
                </div>
            </Link>
        </motion.div> 
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