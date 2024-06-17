import React from 'react'
import Sidebar from '../components/Sidebar'
import PredictionList from '../components/Matches/PredictionList'
import Adbar from '../components/Adbar'

const PredictionPage:React.FC=()=> {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className='flex'>
      <Sidebar url='/predictions/league/'/>
      <PredictionList/>
      <Adbar/>
      </div>
      
    </div>
  )
}

export default PredictionPage

