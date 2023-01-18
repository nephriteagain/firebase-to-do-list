import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

import LogsTable from '../components/LogsTable/LogsTable'

import { useGlobalContext } from '../context/useContext'


import './Logs.css'

const Logs = () => {
  let navigate = useNavigate()
  
  const retryRef = useRef()
  const deleteRef = useRef()

  const { isAuth } = useGlobalContext()

    useEffect(()=> {
    if (!isAuth) {
      navigate('/login')
    }
  }, [isAuth])

  return (
    <div className='logs-page'>
      <LogsTable retryRef={retryRef} deleteRef={deleteRef}/>
      <section className='back-to-home'>
        <button onClick={()=> navigate('/')} 
        className='btn-to-home'
        > Back to Home</button>
      </section>
      <div className='popup-retry' ref={retryRef}>task moved back to Journal</div>
      <div className='popup-delete'ref={deleteRef}>task permanently deleted</div>
    </div>
  )
}

export default Logs