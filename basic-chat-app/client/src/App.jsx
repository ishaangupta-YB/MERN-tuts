import { useState } from 'react' 
import './App.css'
import Form from './modules/Dashboard/Form/Form'

import { Routes, Route, Navigate } from 'react-router-dom';

function App() {

  return (
    <div className='bg-[#edf3fc] h-screen flex justify-center items-center'>
      <Form /> 
    </div>
  )
}

export default App
