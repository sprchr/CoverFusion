import React, { useEffect, useState } from 'react'
import {useNavigate } from 'react-router-dom'
import { auth, logout } from "../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

const App = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      console.log(currentUser)
    })
    return () => unsubscribe();
  }, []);

  const navigate = useNavigate();
  return (
    <div className='flex justify-center items-center h-screen'>
      <div className="flex flex-col justify-center  items-center gap-16 border-2 border-gray-200 shadow-2xl shadow-blue-950 p-32">
       <div className="flex text-[20px] md:text-[30px]  gap-16">
       <button className="border-2 md:px-6 px-2 p-1 rounded-md bg-blue-500 font-medium hover:scale-110 ease-in duration-500" onClick={()=>{
        !user ? navigate('/login') : navigate('/coverletter')
       }
        }>CoverLetter</button>
       <button className="border-2 md:px-6 px-2 p-1 rounded-md bg-blue-500 font-medium hover:scale-110 ease-in duration-500" onClick={()=>{
        !user ? navigate('/login') : navigate('/resume')
       }}>Resume Builder</button>
       </div>
        <p className='font-bold text-[30px] md:text-[60px]'>WikiSource</p>
        </div>
    </div>
  )
}

export default App
