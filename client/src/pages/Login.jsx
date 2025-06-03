import React from 'react'
import {loginControls} from '../config';
import AuthForm from '../components/AuthForm';

const Login = () => {
  return (

      <AuthForm formControls={loginControls}/>

  )
}

export default Login