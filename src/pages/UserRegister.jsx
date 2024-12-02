import { createUserWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react'
import { auth } from '../../firebase/firebaseConfig';
import {  useNavigate } from "react-router-dom";
const UserRegister = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");
      setSuccess("");
      
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        setSuccess("Registration successful! You can now log in.");
        setEmail("");
        setPassword("");
      } catch (err) {
        setError(err.message);
      }
    };
    return (
      <div className='flex gap-6 flex-col justify-center  h-screen items-center '>
          
           <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg p-6 w-full max-w-md"
        >
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Register
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
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring focus:ring-blue-200"
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
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring focus:ring-blue-200"
            />
          </div>
  
          {/* Error Message */}
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
  
          {/* Success Message */}
          {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
  
          {/* Submit Button */}
          
          <button
            type="submit" mb-5
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Register
          </button> 
          
        </form>
        <button
          onClick={()=> navigate("/login")}
          className="w-54 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
         Login
        </button>
      </div>
    )
  }
  


export default UserRegister
