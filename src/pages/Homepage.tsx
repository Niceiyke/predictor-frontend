import React, { useEffect } from 'react'
import { axiosInstance } from '../../config/https'

const Homepage:React.FC=()=> {
  useEffect(()=>{
const home =async ()=>{
  const res =await axiosInstance.get('/fixtures')
  res.data
  console.log(home)
} 
home()

  },[])
  return (
    <div className="min-h-screen bg-gray-100">
     
     <h1 className='text-2xl font-extrabold text-center'>WELCOM TO TOKEN PREDICT</h1>

      
    </div>
  )
}

export default Homepage

