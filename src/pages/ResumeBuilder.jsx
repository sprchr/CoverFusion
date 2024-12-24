import React, { useEffect, useState } from "react";
import axios from "axios";
import saveAs from "file-saver";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import PDFGenerator from "./PDFGenerator";



const ResumeBuilder = () => {
  const navigate = useNavigate();
  const [resumeForm, setResumeForm] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pdf, setPdf] = useState(false);
  const [resume, setResume] = useState("");
  const auth = getAuth();
  const user = auth.currentUser;

  const handleLogout = () => {
    const auth = getAuth();
    auth
      .signOut()
      .then(() => {
        // console.log("clearing");
        
        localStorage.clear()
        navigate("/"); 
      })
      .catch((error) => {
        console.error("Logout failed:", error); // Log any errors during logout
      });
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setResume("");
    const formData = new FormData();
    formData.append("resume", file);
    // console.log(formData)
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_CALL}/resumeBuild`,

        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // console.log(response.data)

      setResume(response.data);
      localStorage.setItem("resume", JSON.stringify(response.data));
     setLoading(false)
    } catch (error) {
      setLoading(false);
      console.error("Request failed:", error);
      setError("An error occurred. Please check your input and try again.");
    }
  };

  
    const fetchResumeData = async (userId) => {
      // console.log(userId)
      try {
        // Reference to the user's resume document
        const userDocRef = doc(db, "resume", userId);
  
        // Fetch the document snapshot
        const userDocSnap = await getDoc(userDocRef);
  
        if (userDocSnap.exists()) {
          // Extract the data from the document
          const resumeData = userDocSnap.data();
          
          // console.log("Fetched Resume Data:", resumeData);
  
          // Update the resume state
          setResume(resumeData.firebase);
           // Assuming `setResume` is accessible in this scope
          localStorage.setItem("resume", JSON.stringify(resumeData.firebase));
          setPdf(true)
        } else {
          console.log("No such document! Initializing with default values.");
          
        }
      } catch (error) {
        console.error("Error fetching resume data:", error);
      }
    };
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
          // console.log("User logged in:", currentUser.uid);
          fetchResumeData(currentUser.uid); // Fetch resume data when the user is logged in
        } else {
          setResume(JSON.parse(localStorage.getItem("resume")))
          console.log("User not logged in.");
        }
      });
    
      // Clean up the listener when the component unmounts
      return () => unsubscribe();
      }, []);
  return (
    <div className="bg-[url('/img1.avif')] bg-cover min-h-screen  bg-bottom  ">
      {user && (
        <div className="flex justify-end mr-20">
          <button
            type="button"
            onClick={handleLogout}
            className="border-2 p-2 rounded-md hover:scale-110 duration-200 ease-in-out border-black text-blue-700 ml-auto font-semibold mt-10"
          >
            LOGOUT
          </button>
        </div>
      )}
      <p
        onClick={() => {
          navigate("/");
        }}
        className=" hover:cursor-pointer flex justify-center pt-18 h-fit font-bold text-[56px] text-blue-500 mb-10"
      >
        Cover Fusion
      </p>
      <div className="flex justify-center  w-screen">
        <div className="border-2 mt-5 w-[800px]  border-gray-800 bg-white">
          <p className="text-[50px] text-center font-medium">Resume Summary</p>
          <form
            encType="mutlipart/form-data"
            onSubmit={handleSubmit}
            className="mx-5  mb-5"
          >
            <div className="mb-4">
              <label
                htmlFor="resume"
                className="block text-sm font-medium mb-1"
              >
                Upload Resume
              </label>
              <input
                type="file"
                id="resume"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring focus:ring-blue-200"
              />
            </div>
            {!resume && (
              <div className="text-red-500 text-sm mb-4">
                <p>{error}</p>
              </div>
            )}
            <button className="w-full mx-auto bg-blue-600 text-white p-2 rounded-md">
            Resume Summary
            </button>
           
          </form>
          {loading && (
            <p className="ml-5 my-5 font-medium text-[20px]">
              Resume is being summarized...
            </p>
          )}

          {resume &&
           (
              <>
                <div
                  className="m-2 mx-5"
                  dangerouslySetInnerHTML={{ __html: resume }}
                />
              </>
            )}

          {resume && (
           
            <PDFGenerator  resumeHtml={JSON.parse(localStorage.getItem("resume"))} firebase={JSON.parse(localStorage.getItem("resume"))} path={"resume"}  navigate={navigate}/>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
