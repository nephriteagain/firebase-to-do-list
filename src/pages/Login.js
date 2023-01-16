import './Login.css'
import { useEffect } from 'react'

import {useGlobalContext} from '../context/useContext'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  let navigate = useNavigate()

  const { signInWithGoogle, isAuth } = useGlobalContext()

  const signIn =  async () => {
     await signInWithGoogle()
  }

  useEffect(()=> {
    if (isAuth) {
      navigate('/')
    }
  }, [isAuth])

  return (
    <div className='loginPage'>
        <p>Sign In With Google to Continue</p>
        <button     
            className='login-with-google-btn'
            onClick={signIn}
        >
            Sign in with Google
        </button>
    </div>
  )
}

export default Login