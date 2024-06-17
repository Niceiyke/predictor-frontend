import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import Homepage from './pages/Homepage'
import Navbar from './components/Navbar'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegistrationPage'
import { AuthProvider } from './context/AuthContext'
import FixturePage from './pages/FixturePage'
import PredictionPage from './pages/PredictionPage'



const router=createBrowserRouter([
  {
    path: '/',
    element:<Homepage/>
  },
  {
    path:'/fixtures',
    element:<FixturePage/>
  },
  {
    path:'/predictions',
    element:<PredictionPage/>
  },
  {
    path:'/login',
    element:<LoginPage/>
  },
  {
    path:'/register',
    element:<RegisterPage/>
  },
  {
    path:'/fixtures/league/:leagueId',
    element:<FixturePage/>
  },
  {
    path:'/predictions/league/:leagueId',
    element:<PredictionPage/>
  },
  
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
    <Navbar/>
    <RouterProvider router={router}/>
    </AuthProvider>
  </React.StrictMode>,
)
