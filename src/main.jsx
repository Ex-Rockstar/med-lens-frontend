import React from 'react'
import ReactDOM from 'react-dom/client'
import Scan from './pages/Scan.jsx'
import './index.css'
import { createBrowserRouter,createRoutesFromElements,Route,RouterProvider } from 'react-router-dom'
import Layout from './Layout.jsx'
import PatientForm from './pages/PatientForm.jsx'
import Chatbot from './components/Chatbot.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout/>}>
      {/* <Route path='/' element={<Home/>}/> */}
      <Route path='/patient' element={<PatientForm/>}/>
      <Route path='scan' element={<Scan/>}/>
      <Route path='contact' element={<Chatbot/>}/>
    </Route>  )
)
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
