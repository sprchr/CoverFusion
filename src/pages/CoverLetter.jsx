import React, { useState } from "react";
import axios from "axios";
import saveAs from "file-saver";
import { useNavigate } from "react-router-dom";
const CoverLetter = () => {
    const navigate = useNavigate();
  const [jobDescription, setJobDescription] = useState("");
  const [resume, setResume] = useState(null);
  const [error, setError] = useState("");
  const [errorResume, setErrorResume] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);

  const generatePDF = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_CALL}/generatepdf`,
        { coverLetter }, // Pass the result or any necessary data
        {
          responseType: "arraybuffer", // Ensure the response is in binary format
        }
      );

      // const uint8Array = new Uint8Array(response.data) // Convert response to Uint8Array
      const uint8Array = new Uint8Array(response.data);
      // console.log(uint8Array)
      const blob = new Blob([uint8Array], { type: "application/pdf" });

      // console.log(uint8Array)
      saveAs(blob, "coverletter.pdf"); // Trigger file download

      console.log("PDF generated and downloaded.");
    } catch (error) {
      console.error("Error generating or downloading PDF:", error);
    }
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
      console.log(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setCoverLetter("");
      console.error("Request failed:", error);
    }
  };
  // console.log(coverLetter)

  return (
 <div
        style={{
    backgroundImage: "url('https://i.ibb.co/jHv6pxq/bgthree.png')",
    backgroundSize: "cover",
    backgroundPosition: "center"
  }}>
      <p
        onClick={() => {
          navigate("/");
        }}
         className=" hover:cursor-pointer flex justify-center mt-28 font-bold text-[56px] text-blue-500 mb-10"
      >
        Cover Fusion
      </p>
      <div className="flex  h-screen justify-center ">
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
            <button
              className="px-2 flex mx-auto mb-5 bg-gray-600 text-white p-1 rounded-md"
              onClick={() => generatePDF()}
            >
              Download Pdf
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoverLetter;
