import React from 'react'
import AuthForm from '../components/AuthForm'
import { registerControls } from '../config';

const Register = () => {

  return (
    <AuthForm formControls={registerControls} />
  )
}

export default Register