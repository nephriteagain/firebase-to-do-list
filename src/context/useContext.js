import { useState, useContext, createContext } from 'react';
import {db, auth, provider} from '../firebase'
import { signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore'

const GlobalContext = createContext();


export const GlobalProvider = ({ children }) => {

  const [ isAuth, setIsAuth ] = useState(localStorage.getItem('isAuth') || false)
  const [ userData, setUserData ] = useState({})
  const [ toDoList, setToDoList ]  = useState([])
  const [ finishedTask, setFinishedTask ] = useState([])

      const signInWithGoogle = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                localStorage.setItem("isAuth", true)
                
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
                  })
          
                
                } else {
                  getDoc(userDoc).then((res) => {
                    setIsAuth(true)
                    const data = res.data()
                    setUserData(data)
                    setToDoList(data.posts)
                    setFinishedTask(data.completedTask)
                  })
                }
            })
    }






  return (
    <GlobalContext.Provider 
      value={{ isAuth, setIsAuth, signInWithGoogle, userData, setUserData, toDoList, setToDoList, finishedTask, setFinishedTask }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  return  useContext(GlobalContext);
};