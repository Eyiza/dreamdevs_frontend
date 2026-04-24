import { useState } from 'react'
import './App.css'
import { RouterProvider } from 'react-router'
import router from './routes/router'
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from 'react-toastify';

function App() {

  return (
    <>
      <ToastContainer/>
      <RouterProvider router={router} />
    </>
  )
}

export default App
