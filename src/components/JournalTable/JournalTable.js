
import './JournalTable.css'
import { useGlobalContext } from '../../context/useContext'

import {doc, updateDoc, arrayRemove, getDoc, arrayUnion} from 'firebase/firestore'
import { db, auth } from '../../firebase'

import { useRef } from 'react'

import {BsCheck2Square} from 'react-icons/bs'
import {AiOutlineDelete} from 'react-icons/ai'

const JournalTable = ({toDoList, setToDoList}) => {

  const { userData, setUserData, setFinishedTask } = useGlobalContext()

  const completeRef = useRef()
  const discardRef = useRef()

  const showPopupComplete= () => {
  completeRef.current.classList.add('popup-show')
  setTimeout(() => {
  completeRef.current.classList.remove('popup-show')
  }, 2000)
}

  const showPopupDiscard= () => {
  discardRef.current.classList.add('popup-show')
  setTimeout(() => {
  discardRef.current.classList.remove('popup-show')
  }, 2000)
}


  const deleteTask = async (id) => {
    const docRef = doc(db, 'users', userData.uid)
    const taskToDelete = toDoList.find((item) => {
      return item.id === id
    })
    await updateDoc(docRef, {
      posts: arrayRemove(taskToDelete)
    })
      .then(()=> {
        getDoc(docRef).then((res) => {
            const data = res.data()
            setUserData(data)
        })
    })

    await updateDoc(docRef, {
        completedTask: arrayUnion({...taskToDelete, date: new Date(Date.now())})
      }).then(() => {
          getDoc(docRef).then((res) => {
            const data = res.data()
            setUserData(data)
            setFinishedTask(
              data.completedTask.sort((a,b) => b.date.seconds - a.date.seconds)
              )
            setToDoList(
              data.posts.sort((a,b) => b.date.seconds - a.date.seconds)
            )

            showPopupDiscard()
        })
      })
  }

const taskCompleted = async (id) => {
  const docRef = doc(db, 'users', auth.currentUser.uid)
  const taskComplete = toDoList.find((item) => {
      return item.id === id
    })

  await updateDoc(docRef, {
      posts: arrayRemove(taskComplete)
    }).then(() => {
          getDoc(docRef).then((res) => {
            const data = res.data()
            setUserData(data)
        })
      })

    await updateDoc(docRef, {
        completedTask: arrayUnion({...taskComplete, isCompleted: true, date: new Date(Date.now())})
      }).then(() => {
          getDoc(docRef).then((res) => {
            const data = res.data()
            setUserData(data)
            setFinishedTask(
              data.completedTask.sort((a,b) => b.date.seconds - a.date.seconds)
              )
            setToDoList(
              data.posts.sort((a,b) => b.date.seconds - a.date.seconds)
            )

            showPopupComplete()
        })
      })    
}



  return (
    <>
    <div className='scrollit'>
      <table className='posts'>
        <thead className='posts-thead'>
          <tr className='posts-head-row'>
            <th className='desc-col'>Description</th>
            <th className='date-col'>Date</th>
            <th className='action-col'>Action</th>
          </tr>
        </thead>
        <tbody className='posts-tbody'>
          { toDoList.length > 0 && toDoList.map((item, index) => {
        const {isCompleted, id, description, date} = item
        const intDate = Number(date.seconds) * 1000
        const newDate = new Date(intDate).toLocaleString('en-GB',{ day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'}).replace(/\//g, '/')

        const dateGood = newDate.toString()
        const status = isCompleted? 'Completed' : 'Active'
            return (
              <tr key={index} className='posts-body-row'>
                <td className='desc-col' >{description}</td>
                <td className='date-col'>{dateGood}</td>
                <td className='action-col'>
                  <button onClick={() => {
                    taskCompleted(id)
                  }}
                    className='btn-complete'
                    data-complete='mark this task as complete'
                  >
                    <BsCheck2Square />
                  </button>
                  <button onClick={() => {
                    deleteTask(id)
                  }}
                    className='btn-discard'
                    data-discard='discard this task'
                  > 
                    <AiOutlineDelete />
                  </button>
                  
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
      <div className='popup-complete' ref={completeRef}>task completed, moved to logs</div>
      <div className='popup-discard'ref={discardRef}>task discarded, moved to logs</div>
    </>
  )
}

export default JournalTable