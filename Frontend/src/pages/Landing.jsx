import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';

const Landing = () => {

    return (
        <div className='w-screen h-screen flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-6 p-12'>
            <motion.h1
                initial={{ opacity: 0, scale: 1.5 }}
                animate={{ opacity: 1 , scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1}}
                className='text-4xl lg:text-5xl xl:text-[57px] uppercase font-extrabold text-left text-gradient max-w-[750px]'
            >
                <span className='text-8xl lg:text-9xl xl:text-[150px]'>Movies</span> Recommendation <br />System
            </motion.h1>
            <div className="buttons flex gap-6">
                <motion.button
                    initial={{ x: 1000 }}
                    animate={{ x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 2.2}}  
                    className='py-2 md:py-3 bg-[#f8b500] text-white px-4 md:px-6  uppercase text-lg' 
                >
                    Start
                </motion.button>
                <motion.button
                    initial={{ x: 1000 }}
                    animate={{ x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 2.2, delay: .5}}   
                    className='py-2 md:py-3 bg-[#f8b500] text-white px-4 md:px-6  uppercase text-lg'
                >
                    <Link to='/about'>About</Link>
                </motion.button>
            </div>
        </div>
    );
};

export default Landing;
