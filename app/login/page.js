"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import styles from '../components/main.module.css'

const Login = () => {

  const [userDetails, setUserDetails] = useState({
    username: '',
    password: ''
  })

  const router = useRouter()

  const onChangeDetails = (e) => {
    setUserDetails((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const onClickSubmit = async (e) => {
    e.preventDefault()
    const options = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userDetails)
    }
    const response = await fetch('/api/login', options)
    const data = await response.json()
    if (response.ok) {
      Cookies.set('userToken', data.jwtToken)
      toast.success('Login successful')
      router.push('/')
    } else {
      toast.error(data.message, { theme: 'colored', hideProgressBar: false })
    }

    setUserDetails({
      username: '',
      password: ''
    });
  }

  return (
    <div className="w-full h-screen p-16 flex justify-center items-center">
      <form className="flex flex-col border border-gray-400 p-8 rounded-lg bg-gray-200" onSubmit={onClickSubmit}>
        <label htmlFor="username">Username</label>
        <input id="username" name="username" type="text" className="mb-4" value={userDetails.username} onChange={onChangeDetails} />
        <label htmlFor="password">Password</label>
        <input className='mb-4' id="password" name="password" type="password" value={userDetails.password} onChange={onChangeDetails} />
        <button type="submit" className={styles.generateButton}>Login</button>
      </form>
    </div>
  )


};

export default Login;
