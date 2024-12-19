import React, { useState } from 'react';
import { auth, provider } from '../../firebase/firebaseConfig'
import {  toast } from 'react-toastify';
import {  useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
const UserLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider)
      toast.success('Login successful!', { position: "top-right", autoClose: 2000 }); 
      navigate('/')
      return result.user;
    } catch (error) {
      console.error("Error during login:", error);
      return null;
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // console.log("Login successful!");
      navigate('/')
      setEmail("");
      setPassword("");
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className='flex gap-6 flex-col justify-center  h-screen items-center '>
      <p  onClick={()=>{navigate('/')}} className=" hover:cursor-pointer mt-5 flex justify-center font-bold text-blue-500 text-[32px]">Cover Fusion</p>
         <button onClick={()=>loginWithGoogle()} className="border-2 p-2 w-60 rounded-md font-medium text-black">Continue with Google</button>
         <h4>OR</h4>
         <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Continue with mail
        </h2>

        {/* Email Input */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded "
          />
        </div>

        {/* Password Input */}
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded "
          />
        </div>

      
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Login
        </button>
      </form>

      <button onClick={() => navigate("/register")}>Register</button>
    </div>
  )
}

 


export default UserLogin
