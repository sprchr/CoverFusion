import React, { useEffect, useState } from "react";
import axios from "axios";
import saveAs from "file-saver";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import PDFGenerator from "./PDFGenerator";

const CoverLetter = () => {
    const navigate = useNavigate();
  const [jobDescription, setJobDescription] = useState("");
  const [resume, setResume] = useState(null);
  const [error, setError] = useState("");
  const [errorResume, setErrorResume] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;

  const handleLogout = () => {
    const auth = getAuth();
    auth
      .signOut()
      .then(() => {
        localStorage.clear()
        navigate("/"); // Redirect to the login page after logout
      })
      .catch((error) => {
        console.error("Logout failed:", error); // Log any errors during logout
      });
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setErrorResume("");
    setLoading(true);
    setCoverLetter("");
    if (!jobDescription && !resume) {
      setError("Please fill in the job description");
    }
    if (!resume) {
      setErrorResume("Please upload the resume");
    }

    try {
      const formData = new FormData();
      formData.append("jobDescription", jobDescription);
      formData.append("resume", resume);

      const response = await axios.post(
        `${import.meta.env.VITE_API_CALL}/generateCoverLetter`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setCoverLetter(response.data);
      localStorage.setItem("coverletter", JSON.stringify(response.data));
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setCoverLetter("");
      console.error("Request failed:", error);
    }
  };
  // console.log(coverLetter)
 const fetchResumeData = async (userId) => {
      // console.log(userId)
      try {
        // Reference to the user's resume document
        const userDocRef = doc(db, "coverletter", userId);
  
        // Fetch the document snapshot
        const userDocSnap = await getDoc(userDocRef);
  
        if (userDocSnap.exists()) {
          // Extract the data from the document
          const coverletter = userDocSnap.data();
          
          // console.log("Fetched Resume Data:", coverLetter);
  
          // Update the resume state
          setCoverLetter(coverletter.firebase); // Assuming `setResume` is accessible in this scope
          localStorage.setItem("coverletter", JSON.stringify(coverletter.firebase));
        } else {
          console.log("No such document! Initializing with default values.");
          // Document doesn't exist; you can handle this by keeping the default state
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
                console.log("User not logged in.");
                  setCoverLetter(JSON.parse(localStorage.getItem("coverletter")))
              }
            });
          
            // Clean up the listener when the component unmounts
            return () => unsubscribe();
      }, []);
  return (
    <div  className="bg-[url('/img1.avif')] bg-cover min-h-screen  bg-bottom  " >
        {user && (<div className="flex justify-end mr-20">
      <button type="button" onClick={handleLogout} className="border-2 p-2 rounded-md hover:scale-110 duration-200 ease-in-out border-black text-blue-700 ml-auto font-semibold mt-10">LOGOUT</button>
      </div>)}
      <p
        onClick={() => {
          navigate("/");
        }}
         className=" hover:cursor-pointer flex justify-center  font-bold text-[56px] text-blue-500 mb-10"
      >
        Cover Fusion
      </p>
      <div className="flex  justify-center ">
        <div className="border-2 mt-10 w-1/2 border-gray-800 h-fit bg-white">
          <p className="text-[50px] text-center font-medium">
            Cover Letter Generator
          </p>
          <form
            encType="mutlipart/form-data"
            onSubmit={handleSubmit}
            className="mx-5  mb-6"
          >
            <div className="mb-4">
              <label
                htmlFor="jobdescription"
                className="block text-sm font-medium mb-1"
              >
                Job Description
              </label>
              <textarea
                type="text"
                id="jd"
                rows="8"
                placeholder="Enter Job description here.."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring focus:ring-blue-200"
              />
            </div>
            {!jobDescription && (
              <div className="text-red-500 text-sm mb-4">
                <p>{error}</p>
              </div>
            )}
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
                onChange={(e) => setResume(e.target.files[0])}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring focus:ring-blue-200"
              />
            </div>
            {!resume && (
              <div className="text-red-500 text-sm mb-4">
                <p>{errorResume}</p>
              </div>
            )}
            <button className="w-full mx-auto bg-blue-600 text-white p-2 rounded-md">
              Generate & Show Cover Letter
            </button>
          </form>
          {loading && (
            <p className="ml-5 my-5 font-medium text-[20px]">
              Cover Letter is being generated...
            </p>
          )}

          {/* resume template */}
          {coverLetter && (
            <div
              className="m-2 mx-5"
              dangerouslySetInnerHTML={{ __html: coverLetter }}
            />
          )}
          {/* template end */}
          {coverLetter && (
            
          <PDFGenerator firebase={JSON.parse(localStorage.getItem("coverletter"))} resumeHtml={JSON.parse(localStorage.getItem("coverletter"))} path={"coverletter"}  navigate={navigate}/>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoverLetter;
