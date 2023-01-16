import { useEffect, useRef, useState } from 'react'
import JournalTable from '../components/JournalTable/JournalTable'
import { useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../context/useContext'

import { updateDoc, doc, arrayUnion, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import {v4} from 'uuid'

import './Home.css'

const Home = () => {
  let navigate = useNavigate()

  const {isAuth, userData, setUserData, toDoList, setToDoList}  = useGlobalContext()



  const inputRef = useRef()

  useEffect(()=> {
    if (isAuth === false) {
      navigate('/login')
    }
  }, [isAuth])
 
  const createToDoList = async (e) => {
    e.preventDefault()
    if (isAuth) {
      const docRef = doc(db, 'users', userData.uid)

      const date = new Date(Date.now())
      const newPost ={id: v4(), description: inputRef.current.value , isCompleted: false, date}
      await updateDoc(docRef, {
        posts: arrayUnion(newPost)
      } ).then(() =>  {
        getDoc(docRef).then((res) => {
            const data = res.data()
            setToDoList(data.posts.sort((a, b) => Number(b.date.seconds - Number(a.date.seconds))))
            setUserData(data)
            
            inputRef.current.value = ''
        })
      })
    }
  }



  return (

    <div className='home'>
      <section className='create-task'>
        <form 
          onSubmit={(e) => {createToDoList(e);}} 
          className='form'>
          <input 
            type='text' 
            placeholder=' create new task...' 
            required 
            ref={inputRef}
            className='input'  
          />
          <button 
            type='submit'
            className='btn-submit'  
          > Create</button>
        </form>
      </section>
      <JournalTable toDoList={toDoList} setToDoList={setToDoList}/>
      <section className='log-btn-section'>
        <button 
          onClick={() => navigate('/logs')}
          className='btn-logs'
        > Go to Logs</button>
      </section>
    </div>

  )
}

export default Home