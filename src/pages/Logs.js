import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import LogsTable from '../components/LogsTable/LogsTable'

import { useGlobalContext } from '../context/useContext'

import './Logs.css'

const Logs = () => {
  let navigate = useNavigate()

  const { isAuth } = useGlobalContext()

    useEffect(()=> {
    if (!isAuth) {
      navigate('/login')
    }
  }, [isAuth])

  return (
    <div className='logs-page'>
      <LogsTable />
      <section className='back-to-home'>
        <button onClick={()=> navigate('/')} 
        className='btn-to-home'
        > Back to Home</button>
      </section>
    </div>
  )
}

export default Logs