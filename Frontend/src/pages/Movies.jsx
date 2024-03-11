import React, { useContext, useEffect } from "react";
import axios from "axios"
import { RandomMoviesContainer } from "../main";

const Movies = () => {

    const {movies, setMovies} = useContext(RandomMoviesContainer)

    const API_KEY = '8ecbf28985308ca3b14b540321587f1f';
    const API_URL = 'https://api.themoviedb.org/3';
  
  
    const getMovies = async() => {
      try {
        const response = await axios.get(`${API_URL}/movie/popular`, {
          params: {
            api_key: API_KEY,
            language: 'en-US',
            page: Math.floor(Math.random() * 100) + 1,
          },
        });
        
        const randomMovies = response.data.results
          .sort(() => Math.random() - 0.5)
          .slice(0, 10);
  
          setMovies(randomMovies);
          console.log(movies);
  
      } catch (error) {
        console.error('Error fetching random movies:', error);
      }
    }
  
    useEffect(() => {
      getMovies();
    }, [])
  
  return (
    <>
      <div className="w-full flex items-center justify-center text-2xl p-12 flex-col gap-12 overflow-hidden">
        <h1 className="text-5xl font-bold text-gradient">Movies</h1>
            {
                movies.length === 0 ? (
                    <p>There is no items</p>
                ) :
                (
                    <div className="flex flex-wrap justify-center items-start gap-5">
                    {movies.map(movie => (
                      <div key={movie.id} className="max-w-[200px] h-[400px] bg-gray-100 rounded-lg overflow-hidden shadow-md mb-5" onClick={() => console.log(movie.id)}>
                        <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} className="w-full h-[230px] object-cover" />
                        <div className="p-4">
                          <h2 className="text-lg font-semibold mb-2">{movie.title}</h2>
                          <p className="text-gray-700 text-sm">{movie.overview}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )
            }
      </div>
    </>
  )
}

export default Movies