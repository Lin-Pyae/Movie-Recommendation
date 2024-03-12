import React from 'react'
import {motion} from 'framer-motion'

const About = () => {
  return (
    <div className='w-screen h-screen flex items-center justify-center'>
        <motion.div 
            initial={{ y: -1000 }}
            animate={{ y:  0}}
            transition={{ duration: 1}}  
            className='w-full h-auto md:w-[500px] md:h-[500px] bg-white'
        >
            <h1 className='text-center p-5 text-2xl font-semibold text-[#f8b500]'>About Us</h1>
        </motion.div>
    </div>
  )
}

export default About