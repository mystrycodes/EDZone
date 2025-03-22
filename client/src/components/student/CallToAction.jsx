import React from 'react'
import { assets } from '../../assets/assets'

const CallToAction = () => {
  return (
    <div className='flex flex-col items-center gap-4 pt-10 pb-24 px-8 md:px-0'>
      <h1 className='text-xl md:text-4xl text-gray-800 font-semibold'>Unlock Infinite Learning: Explore Knowledge, Anytime, Anywhere</h1>
      <p className='text-gray-500 sm:text-sm'>Empower yourself with limitless learning opportunities. Whether you’re at home, on the go, or in the classroom, access the knowledge you need, when you need it. Dive into interactive lessons,<br /> expert insights, and cutting-edge resources designed to elevate your skills and understanding. The world of learning is now at your fingertips—start your journey today!</p>
      <div className='flex items-center font-medium gap-6 mt-4'>
        <button className='px-10 py-3 rounded-md text-white bg-blue-600'>Get started</button>
        <button className='flex items-center gap-2'>Learn more <img src={assets.arrow_icon} alt="arrow icon" /></button>
      </div>
    </div>
  )
}

export default CallToAction
