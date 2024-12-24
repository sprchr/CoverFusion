import React, { useState } from "react";
import { auth, provider } from "../../firebase/firebaseConfig";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { PDFLogic } from "./PDFLogic";
const UserLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginWithGoogle = async ( ) => {
    try {
      await signInWithPopup(auth, provider);

      toast.success("Login successful!", {
        position: "top-right",
        autoClose: 2000,
      });

      // Redirect to the page the user was on, or to the homepage as a fallback
     
      const pendingTask = localStorage.getItem("pendingPDFGeneration");
      if (pendingTask) {
        const redirectPath = location.state?.from || "/";
        navigate(redirectPath);
        const { resumeHtml,firebase, path } = JSON.parse(pendingTask);
  
        // Clear the task from local storage
        await PDFLogic(resumeHtml,firebase, navigate, path);
        localStorage.removeItem("pendingPDFGeneration");
  
        // Resume the PDF generation process
       
    }
  } catch (error) {
      console.error("Error during login:", error);
      return null;
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login successful!", {
        position: "top-right",
        autoClose: 2000,
      });

      // console.log("Login successful!");
      const redirectPath = location.state?.from || "/";
      navigate(redirectPath);
      setEmail("");
      setPassword("");
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className="flex gap-6 flex-col justify-center  h-screen items-center bg-[url('/img1.avif')] bg-cover bg-bottom ">
      <p
        onClick={() => {
          navigate("/");
        }}
        className=" hover:cursor-pointer mt-5 flex justify-center font-bold text-blue-500 text-[32px]"
      >
        Cover Fusion
      </p>
      <button
        onClick={() => loginWithGoogle()}
        className="border-2 p-2 w-60 rounded-md font-medium text-black"
      >
        Continue with Google
      </button>
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

      <button  className="w-auto bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600" onClick={() => navigate("/register")}>Register</button>
    </div>
  );
};

export default UserLogin;
