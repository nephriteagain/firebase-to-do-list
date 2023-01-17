import { useState, useContext, createContext } from 'react';
import {db, auth, provider} from '../firebase'
import { signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore'

const GlobalContext = createContext();


export const GlobalProvider = ({ children }) => {

  const parseFromLocalStorage = (item)  => {
    return JSON.parse(localStorage.getItem(item))
  }



  const [ isAuth, setIsAuth ] = useState(localStorage.getItem('isAuth') || false)
  const [ userData, setUserData ] = useState(
    parseFromLocalStorage('userData') ||{})
  const [ toDoList, setToDoList ]  = useState(
    parseFromLocalStorage('toDoList') || [])
  const [ finishedTask, setFinishedTask ] = useState(
   parseFromLocalStorage('finishedTask') || [])
   
  const [ newUser, setNewUser ] = useState(false)



      const signInWithGoogle = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                localStorage.setItem('isAuth', true)
                
                const userDoc = doc(db, 'users', auth.currentUser.uid)
                // check if new user
                const createdAt =   Number(result.user.metadata.createdAt)
                const lastLoginAt = Number(result.user.metadata.lastLoginAt)

                const { displayName, email, photoURL, uid } = result.user
                const data = { displayName, email, photoURL, uid , posts: [], completedTask: []}
                if (lastLoginAt - createdAt < 100) {
                  setDoc(userDoc, data).then(() => {
                    setIsAuth(true)
                    setUserData(data)
                    setToDoList(data.posts)
                    setFinishedTask(data.completedTask)
                    setNewUser(true)
                  })
          
                
                } else {
                  getDoc(userDoc).then((res) => {
                    setIsAuth(true)
                    const data = res.data()
                    setUserData(data)
                    setToDoList(data.posts)
                    setFinishedTask(data.completedTask)

                    // saving to localStorage
                    localStorage.setItem('userData', JSON.stringify(data))
                    localStorage.setItem('toDoList', JSON.stringify(data.posts))
                    localStorage.setItem('finishedTask', JSON.stringify(data.completedTask))
                  })
                }
            })
    }






  return (
    <GlobalContext.Provider 
      value={{ isAuth, setIsAuth, signInWithGoogle, userData, setUserData, toDoList, setToDoList, finishedTask, setFinishedTask, newUser, setNewUser }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  return  useContext(GlobalContext);
};