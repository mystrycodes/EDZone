import React from 'react'
import { assets } from '../../assets/assets'
import SearchBar from './SearchBar'

const Hero = () => {
  return (
    <div className='flex flex-col items-center justify-center w-full md:pt-38 pt-20 px-7 md:px-0 space-y-7 text-center bg-gradient-to-b from-cyan-100/70'>
      <h1 className='md:text-home-heading-large text-home-heading-small relative font-bold text-gray-800 max-w-3xl mx-auto'>
        Welcome to EDZone: <span className='text-blue-600'>
          AI-Powered Learning for a Smart Future!</span><img src={assets.sketch} alt="sketch"
            className='md:block hidden absolute -bottom-7 right-0' /></h1>
      <p className='md:block hidden text-gray-500 max-w-2xl max-auto'>
        Harness the power of AI to personalize your learning experience, streamline course management, and unlock new opportunities. With EDZone, education adapts to you—empowering your success through intelligent insights and innovation. 🚀📚</p>
      <p className='md:hidden text-gray-500 max-w-sm mx-auto'>
        Unlock smarter education with AI-driven insights, seamless course management, and a learning experience that adapts to your needs. 🚀📚"</p>
      <SearchBar/>
    </div>
  )
}

export default Hero
