import { useState, useEffect } from 'react'


import {AiOutlineDelete} from 'react-icons/ai'
import {BiUndo} from 'react-icons/bi'

import { useGlobalContext } from '../../context/useContext'

import {doc, updateDoc, arrayRemove, getDoc, arrayUnion} from 'firebase/firestore'
import { db, auth } from '../../firebase'


const LogsTable = () => {




  const { userData, setUserData,  finishedTask, setFinishedTask, setToDoList } = useGlobalContext()

  const retryTask = async ( id) => {
    const docRef = doc(db, 'users', userData.uid)
    const taskToRetry = finishedTask.find((item) => {
      return item.id === id
    })

    await updateDoc(docRef, {
      completedTask: arrayRemove(taskToRetry),
      posts: arrayUnion(taskToRetry)
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
        })
      })
  }

  const permanentlyRemoveTask = async ( id) => {
    const docRef = doc(db, 'users', userData.uid)
    const taskToPermanentlyDelete = finishedTask.find((item) => {
      return item.id === id
    })

    await updateDoc(docRef, {
      completedTask: arrayRemove(taskToPermanentlyDelete)
    }).then(() => {
          getDoc(docRef).then((res) => {
            const data = res.data()
            setUserData(data)
            setFinishedTask(
              data.completedTask.sort((a,b) => b.date.seconds - a.date.seconds)
              )
        })
      })
  }



  return (
    <div className= 'logs'>
      <table className='table-logs'>
        <thead className='logs-thead'>
          <tr className='tr-head-log'>
            <th className='desc-col-log'>Description</th>
            <th className='date-col-log'>Date</th>
            <th className='stat-col-log'>Status</th>
            <th className='action-col-log'>Action</th>
          </tr>
        </thead>
        <tbody className='logs-tbody'>
          { finishedTask.length > 0 && finishedTask.map((item, index) => {
        const {isCompleted,  description, date, id} = item
        const intDate = Number(date.seconds) * 1000
        const newDate = new Date(intDate).toLocaleDateString('en-GB',{ day: '2-digit', month: '2-digit', year: 'numeric'}).replace(/\//g, '/')
        const dateGood = newDate.toString()
        const status = isCompleted? 'Completed' : 'Deleted'
            return (
              <tr key={index} className='tr-body-log'>
                <td className='desc-col-log'> {description}</td>
                <td className='date-col-log'> {dateGood}</td>
                <td className='stat-col-log'> {status}</td>
                <td className='action-col-log'> 

                    <button className='btn-retry'
                      onClick={() => {
                        retryTask(id)
                      }}
                    >
                      <BiUndo />
                    </button>
                    <button className='btn-delete'
                      onClick={() => {
                        permanentlyRemoveTask(id)
                      }}
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
  )
}

export default LogsTable