// pages
import Home from './pages/Home';
import Login from './pages/Login';
import Logs from './pages/Logs';

// react-router-dom
import { Routes, Route, BrowserRouter as Router, Navigate } from 'react-router-dom'


import './App.css';


import { useGlobalContext } from './context/useContext';
import { auth } from './firebase'

import { signOut } from 'firebase/auth';

function App() {
  
  const {isAuth, setIsAuth, userData, setUserData, setFinishedTask, setToDoList, newUser, setNewUser} =  useGlobalContext()
  
  
  
    const signUserOut = () => {
    signOut(auth).then((res)=> {
      localStorage.clear()
      setIsAuth(false)
      setUserData({})
      setFinishedTask([])
      setToDoList([])
      setNewUser(false)
    })
  }
  
  // useEffect(() => {
  //   console.log('isAuth =',  isAuth)
  // }, [isAuth, userData])
  
  
  
  

  
  
  
  

  return (
    <div className="App">
      { isAuth && <div className='header'>
      <div className='welcome'>
        <i className='welcome-p'>Welcome{newUser? ',' : ' Back!'}</i>
        <h1 className='display-name'>{userData.displayName}</h1>
      </div>

      <img  className='profile-img' src={userData.photoURL} referrerPolicy='no-referrer' />
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
          <Route path='*' element={<Navigate to={`${isAuth? '/' : '/login'}`} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
