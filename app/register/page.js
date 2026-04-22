"use client"

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const formFields = [
  {
    id: 'fullName',
    label: 'Full Name',
    type: 'text',
  },
  {
    id: 'email',
    label: 'Email',
    type: 'email',
  },
  {
    id: 'mobileNumber',
    label: 'Mobile Number',
    type: 'tel',
  },
  {
    id: 'password',
    label: 'Password',
    type: 'password',
  }

];

const RegistrationPage = () => {
  const router = useRouter()
  const [userDetails, setUserDetails] = useState({
    fullName: '',
    mobileNumber: '',
    email: '',
    gender: 'male',
    password: '',
  });

  const onChangeDetails = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const onSubmitUserDetails = async (e) => {
    e.preventDefault();
    try {

      const options = {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userDetails)
      }

      const response = await fetch('/api/register', options)
      const data = await response.json()

      if (response.ok) {
        toast.success('Account created successfully')
        router.push('/login')
      } else {
        toast.error(data.message,{theme:'colored',hideProgressBar:false})
      }

    } catch (error) {
      toast.error('Internal system error',{theme:'colored'})
    }

    setUserDetails({
      fullName: '',
      mobileNumber: '',
      email: '',
      password: '',
    })
  };

  return (
    <div className='flex items-center justify-center h-screen'>
      <form className='bg-gray-200 p-4 w-fit mx-auto flex flex-col items-center gap-4 shadow rounded-md' onSubmit={onSubmitUserDetails}>
        <h2 className='text-xl text-blue-900'>Register your account</h2>
        <ul className='flex flex-col gap-2'>
          {formFields.map(item => (
            <li key={item.id}>
              <input type={item.type} name={item.id} reqUired placeholder={item.label} value={userDetails[item.id]} onChange={onChangeDetails} />
            </li>
          ))}
        </ul>
        <button type='submit' className='w-full bg-orange-600 text-white'>Register</button>
        <div>
          <Link href={"/login"} className="text-blue-500 hover:underline">
            Already have an account? Login
          </Link>
        </div>
      </form>

    </div>
  );
};

export default RegistrationPage;
