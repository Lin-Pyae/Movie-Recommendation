import React, {useEffect} from 'react';
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../css/main.css'

const Landing = () => {

    const API_KEY = '8ecbf28985308ca3b14b540321587f1f';
    const API_URL = 'https://api.themoviedb.org/3';

    useEffect(() => {
        // Define the movie ID you want to fetch

        // Make the API call to fetch the movie by its ID
        const fetchData = async (movieId) => {
            try {
                const response = await axios.get(`${API_URL}/movie/${movieId}`, {
                    params: {
                        api_key: API_KEY
                    }
                });
                const  data = response.data;
                console.log(data);
            } catch (error) {
                console.error('Error fetching movie:', error);
            }
        };

        // Call the fetchData function
        fetchData(266285);
    }, []);
    

    return (
        <div className='w-screen h-screen flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-20 p-12 '>
            <motion.div
                initial={{ opacity: 0, scale: 1.5 }}
                animate={{ opacity: 1 , scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1}}
                className='text-6xl md:text-[80px] lg:text-[100px] uppercase font-extrabold text-left text-gradient max-w-[750px] bebas-neue-regular lg:leading-[90px]'
            >
                <p className='text-[150px] md:text-[200px] lg:text-[250px] lg:leading-[210px]'>Movies</p>
                <p>Recommendation</p>
                <p>System</p>
            </motion.div>
            <div className="buttons flex gap-6">
                <Link to='/movies'>
                    <motion.button
                        initial={{ x: 1000 }}
                        animate={{ x: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5}}  
                        className='py-2 md:py-3 bg-[#f8b500] hover:bg-[#f8b600c9] duration-200 text-white px-4 md:px-6  uppercase text-lg' 
                    >
                        Start
                    </motion.button>
                </Link>
                <Link to='/about'>
                    <motion.button
                        initial={{ x: 1000 }}
                        animate={{ x: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, delay: .5}}   
                        className='py-2 md:py-3 bg-[#f8b500] hover:bg-[#f8b600c9] duration-200 text-white px-4 md:px-6  uppercase text-lg'
                    >
                        About
                    </motion.button>
                </Link>
            </div>
        </div>
    );
};

export default Landing;
