import React from 'react'
import MatchList from '../components/Matches/MatchList'
import Sidebar from '../components/Sidebar'
import Adbar from '../components/Adbar'

const FixturePage:React.FC=()=> {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className='flex'>
      <Sidebar url='/fixtures/league/'/>
      <MatchList/>
      <Adbar/>
      </div>
      
    </div>
  )
}

export default FixturePage

