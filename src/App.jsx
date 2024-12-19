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
    <div
        style={{
    backgroundImage: "url('https://i.ibb.co/BZ8xCc0/bgthree.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center"
  }}>
      <p className=" hover:cursor-pointer flex justify-center mt-28 font-bold text-[56px] text-blue-500 mb-10">Cover Fusion</p>
    <div className='flex justify-center items-center '>
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
        </div>
    </div>
    </div>
  )
}

export default App
