import React, { useState } from 'react';
import axios from 'axios';
import jsPDF from "jspdf";

const CoverLetter = () => {
    const [jobDescription, setJobDescription] = useState('');
    const [resume, setResume] = useState(null);
    const [error, setError] = useState('');
    const [errorResume, setErrorResume] = useState('');
    const [coverLetter, setCoverLetter] = useState('');
    const [letterError,setLetterError] = useState('')
    
    const generatePDF = async() => {
        const doc = new jsPDF();
        doc.setFontSize(12);
        
        const data = coverLetter
          .replace(/<br\s*\/?>/gi, '\n') // Replace <br> with \n
          .replace(/<\/?p>/gi, '');      // Remove <p> tags
        
        const marginLeft = 15;
        const marginRight = 15;
        const pageWidth = doc.internal.pageSize.width;
        const maxWidth = pageWidth - marginLeft - marginRight; // Calculate max width
        
        // Split text into lines based on maxWidth
        const lines = doc.splitTextToSize(data, maxWidth);
        
        // Add text to PDF
        doc.text(lines, marginLeft, 15); // Automatically handles line breaks
        doc.save("cover_letter.pdf");
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setErrorResume('');
        

        if (!jobDescription && !resume) {
            setError('Please fill in the job description');
           
        }
        if (!resume) {
            setErrorResume('Please upload the resume');
            
        }

        try {
            const formData = new FormData();
            formData.append('jobDescription', jobDescription);
            formData.append('resume',resume)
            // console.log('Inspecting FormData:');
            // for (const [key, value] of formData.entries()) {
            //     if (value instanceof File) {
            //       console.log(`${key}:`);
            //       console.log('  Name:', value.name);
            //       console.log('  Type:', value.type);
            //       console.log('  Size:', value.size, 'bytes');
            //     } else {
            //       console.log(`${key}: ${value}`);
            //     }
            //   }
            const response = await axios.post(
                'https://wiki-source-backend.vercel.app/api/generateCoverLetter',
                formData,
                {
                  headers: {
                    'Content-Type': 'multipart/form-data',
                  },
                  
                }
              );
        
          setCoverLetter(response.data)
         console.log(response.data)
            
        } catch (error) {
            console.error('Request failed:', error);
            setLetterError('An error occurred. Please check your input and try again.');
        }
    };

    return (
        <div className="flex bg-gray-200 h-screen justify-center ">
            <div className="border-2 mt-10 w-1/2 border-gray-800 h-fit bg-white">
                <p className="text-[50px] text-center font-medium">Cover Letter Generator</p>
                <form encType='mutlipart/form-data' onSubmit={handleSubmit} className="mx-5  mb-10">
                    <div className="mb-4">
                        <label htmlFor="jobdescription" className="block text-sm font-medium mb-1">
                            Job Description
                        </label>
                        <textarea
                            type="text"
                            id="jd"
                            rows='8'
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
                        <label htmlFor="resume" className="block text-sm font-medium mb-1">
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
                    <button className="w-full mx-auto bg-blue-600 text-white p-2 rounded-md">Generate & Show Cover Letter</button>
                </form>
                       
                {coverLetter ? (
                    <div className="p-5   border-black mt-6 mx-auto bg-gray-100 rounded-lg w-full">
                   <div className="flex gap-10 items-center mb-10">
                   <h3 className="text-xl font-bold ">Generated Cover Letter</h3>
                    <button className='p-2 border-2 bg-blue-600  w-44 font-medium rounded-md text-center text-[16px]' onClick={generatePDF}>Download PDF</button>
                  
                   </div>
                    
                   <p  id="cover-letter" className="text-[16px]   bg-[#fff] m-auto   max-w-[190mm] p-5" dangerouslySetInnerHTML={{ __html: coverLetter }}>
                   </p>
                   
               </div>
                ) :  <div className="text-red-500 mx-auto flex justify-center text-sm mb-4">
                <p>{letterError}</p>
            </div>  }
            
            </div>
        </div>
    );
};

export default CoverLetter;
