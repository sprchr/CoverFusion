import React, { useState } from 'react';
import axios from 'axios';
import saveAs from 'file-saver';
const ResumeBuilder = () => {
    
    const [resume, setResume] = useState(null);
    const [error, setError] = useState('');
    const [result,setResult] = useState('')
    const [loading ,setLoading] = useState(false)
    
const generatePDF = async () => {
    try {
        const response = await axios.post(
          'http://localhost:3000/api/generatepdf',
          { result }, // Pass the result or any necessary data
          {
            responseType: 'arraybuffer', 
            timeout: 20000 ,
            // Ensure the response is in binary format
          },
          { } 
        );
         
        // const uint8Array = new Uint8Array(response.data) // Convert response to Uint8Array
        const uint8Array = new Uint8Array(response.data);
        // const buffer = Buffer.from(response.data)
        const blob = new Blob([uint8Array], { type: 'application/pdf' });
        
        // console.log(uint8Array)
        saveAs(blob, 'Resume.pdf'); // Trigger file download
        
        console.log('PDF generated and downloaded.');
      } catch (error) {
        console.error('Error generating or downloading PDF:', error);
      }
};

  
    
  
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true)
        setResult('')

        if (!resume) {
            setError('Please upload the resume');
            
        }

        try {
            const formData = new FormData();
           
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
                'http://localhost:3000/api/resumeBuild',
                formData,
                {
                  headers: {
                    'Content-Type': 'multipart/form-data',
                },
                timeout: 20000,
                  
                }
              );
              console.log(response.data)
              
              setResult(response.data)
              setLoading(false)
            
        } catch (error) {
            console.error('Request failed:', error);
            setError('An error occurred. Please check your input and try again.');
        }
    };

    return (
        <div className="flex justify-center w-screen">
            <div className="border-2 mt-10 w-[800px] border-gray-800 bg-white">
                <p className="text-[50px] text-center font-medium">Resume Builder</p>
                <form encType='mutlipart/form-data' onSubmit={handleSubmit} className="mx-5  mb-5">
                    
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
                            <p>{error}</p>
                        </div>
                    )}
                    <button className="w-full mx-auto bg-blue-600 text-white p-2 rounded-md">Rebuild your resume</button>
                </form>
             {loading &&  <p className='ml-5 my-5 font-medium text-[20px]'>Resume is being generated...</p>  }
            
             
             {/* resume template */}
                       {result && <div className='m-2 mx-5' dangerouslySetInnerHTML={{ __html: result }} />}
             {/* template end */}
               {result &&  <button className="px-2 flex mx-auto mb-5 bg-gray-600 text-white p-1 rounded-md" onClick={()=>generatePDF()}>Download Pdf</button>}     
            
            </div>
        </div>
    );
};

export default ResumeBuilder;
