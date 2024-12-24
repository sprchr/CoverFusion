import React, { useEffect, useState } from 'react'
import {useNavigate } from 'react-router-dom'
import { auth, logout } from "../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

const App = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      //  console.log(currentUser)
    })
    return () => unsubscribe();
  }, []);
  // https://d3ibl6bxs79jg9.cloudfront.net/wp-content/uploads/2021/09/1.5.png
  // https://www.wozber.com/public/images/magazine/how-to-write-a-cover-letter/article-image.svg
  // https://image.slidesdocs.com/responsive-images/docs/poster-featuring-the-blue-system-page-border-background-word-template_6306e8401c__1131_1600.jpg
  const navigate = useNavigate();
  return (
    
    <div  className="bg-[url('/img1.avif')] bg-cover bg-bottom  h-screen ">
      <p className=" hover:cursor-pointer flex justify-center pt-28 font-bold text-[56px] text-blue-400 mb-10">Cover Fusion</p>
    <div className='flex justify-center items-center '>
      <div className="flex flex-col justify-center  items-center gap-16 border-2 border-gray-200 shadow-2xl shadow-blue-950 p-32">
       <div className="flex text-[20px] md:text-[30px]  gap-16">
       <button className="border-2 md:px-6 px-2 p-1 rounded-md bg-blue-500 font-medium hover:scale-110 ease-in duration-500" onClick={()=>{
         navigate('/coverletter')
       }
        }>CoverLetter</button>
       <button className="border-2 md:px-6 px-2 p-1 rounded-md bg-blue-500 font-medium hover:scale-110 ease-in duration-500" onClick={()=>{
    navigate('/resume')
       }}>Resume Summary</button>
       <button className="border-2 md:px-6 px-2 p-1 rounded-md bg-blue-500 font-medium hover:scale-110 ease-in duration-500" onClick={()=>{
    navigate('/resumedraft')
       }}>Resume Draft</button>
       </div>
        </div>
    </div>
    </div>
  )
}

export default App
