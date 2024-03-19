import React from 'react'

const Navbar = () => {
  return (
    <nav className='flex justify-around bg-green-700 text-white py-2'>
        <div className="logo">
            <span className='font-bold text-xl mx-8'>TODO App</span>
        </div>
      <ul className="flex gap-6 mx-9">
        <li className='cursor-pointer hover:font-bold transition-all'>Home</li>
        <li className='cursor-pointer hover:font-bold transition-all'>Logout</li>
      </ul>
    </nav>
  )
}

export default Navbar