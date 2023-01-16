// pages
import Home from './pages/Home';
import Login from './pages/Login';
import Logs from './pages/Logs';

// react-router-dom
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom'


import './App.css';

import { useEffect } from 'react'


import { useGlobalContext } from './context/useContext';
import { auth } from './firebase'

import { signOut } from 'firebase/auth';

function App() {
  
  const {isAuth, setIsAuth, userData, setUserData, setFinishedTask, setToDoList} =  useGlobalContext()
  
  
  
    const signUserOut = () => {
    signOut(auth).then((res)=> {
      localStorage.clear()
      setIsAuth(false)
      setUserData({})
      setFinishedTask([])
      setToDoList([])
    })
  }
  
  // useEffect(() => {
  //   console.log('isAuth =',  isAuth)
  // }, [isAuth, userData])
  
  
  
  
  

  
  
  
  

  return (
    <div className="App">
      { isAuth && <div className='signout'>
      <button onClick={signUserOut}
        className='btn-signout'
      > Log Out</button> 
      </div>
      }
      <Router>
        <Routes>
          <Route exact path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/logs' element={<Logs />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
