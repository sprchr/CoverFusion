import React, { useEffect, useState } from "react";
import axios from "axios";
import saveAs from "file-saver";
import ResumeForm from "./ResumeFrom";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig.js";
import { useNavigate } from "react-router-dom";
const ResumeBuilder = () => {
  const navigate = useNavigate();
  const [resumeForm, setResumeForm] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pdf, setPdf] = useState(true);
  const [editForm, setEditForm] = useState({});
  const handleResumeData = async (data) => {
    setEditForm(data); // Update the edit form state if necessary
    setLoading(true); // Show loading feedback
    setResumeForm(false);
    setResume({});
    try {
      // Send data to the first API (editResume)
      const response = await axios.post(
        `${import.meta.env.VITE_API_CALL}/editResume`,
        data, // Pass the edited form data
        {
          headers: {
            "Content-Type": "application/json", // Explicitly set content type
          },
        }
      );

      // console.log("Response from editResume:", response.data);
      setResume(response.data); // Update the resume state
      const auth = getAuth();
      const userId = auth.currentUser?.uid;
      // Send the response data to the submitForm API
      const firebaseResponse = await axios.post(
        `${import.meta.env.VITE_API_CALL}/submitForm`,
        { ...response.data, userId }, // Include the userId with the data
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response from submitForm:", firebaseResponse.data);

      setLoading(false); // Stop loading feedback
      setResumeForm(false); // Close the form after success
    } catch (error) {
      setLoading(false); // Stop loading feedback even on error
      console.error("Request failed:", error);
      setError("An error occurred. Please check your input and try again.");
    }
  };

  const generatePDF = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_CALL}/generatepdf`,

        { resumeHtml }, // Pass the result or any necessary data
        {
          responseType: "arraybuffer",

          // Ensure the response is in binary format
        },
        {}
      );

      // const uint8Array = new Uint8Array(response.data) // Convert response to Uint8Array
      const uint8Array = new Uint8Array(response.data);
      // const buffer = Buffer.from(response.data)
      const blob = new Blob([uint8Array], { type: "application/pdf" });

      // console.log(uint8Array)
      saveAs(blob, "Resume.pdf"); // Trigger file download

      console.log("PDF generated and downloaded.");
    } catch (error) {
      console.error("Error generating or downloading PDF:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResume({});
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
      const auth = getAuth();
      const userId = auth.currentUser?.uid;
      // Send the response data to the submitForm API
      const firebaseResponse = await axios.post(
        `${import.meta.env.VITE_API_CALL}/submitForm`,

        { ...response.data, userId }, // Include the userId with the data
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // console.log("Response from submitForm:", firebaseResponse.data);

      setLoading(false); // Stop loading feedback
      setPdf(true);
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
      const userDocRef = doc(db, "Users", userId);

      // Fetch the document snapshot
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        // Extract the data from the document
        const resumeData = userDocSnap.data();

        // console.log("Fetched Resume Data:", resumeData);

        // Update the resume state
        setResume(resumeData); // Assuming `setResume` is accessible in this scope
      } else {
        console.log("No such document! Initializing with default values.");
        // Document doesn't exist; you can handle this by keeping the default state
      }
    } catch (error) {
      console.error("Error fetching resume data:", error);
    }
  };

  // Call this function where needed (e.g., in useEffect after user authentication)
  useEffect(() => {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;

    if (userId) {
      fetchResumeData(userId);
    }
  }, []);
  const [resume, setResume] = useState({
    header: {
      name: "",
      title: "",
      email: "",
      phone: "",
      linkedin: "",
      github: "",
      address: "",
    },
    summary: "",
    skills: [],
    education: [],
    experience: [],
    projects: [],
    certifications: [],
    achievements: [],
    hobbies: "",
    languages: [],
    volunteer: "", // Corrected typo
  });
  const resumeHtml = `
      <style>
  .resume-container {
    padding: 24px;
    max-width: 960px;
    margin: 0 auto;
    background-color: white;
    border-radius: 8px;
  }

  .header {
    border-bottom: 2px solid #e5e7eb;
    text-align: center;
    line-height: 1;
  }

  .header h1 {
    font-size: 24px;
    font-weight: 700;
   
  }

  .header p {
    font-size: 18px;
     
  }

  .header .contact-info {
    display: flex;
    gap: 8px;
    justify-content: center;
    flex-wrap: wrap;
  }

  .header .contact-info p {
    font-size: 14px;
  }

  .section {
   line-height: 1;
    border-bottom: 2px solid #e5e7eb;
    
  }

  .section h2 {
    font-size: 18px;
    font-weight: 600;
  }

  .skills-list,
  .certifications-list,
  .achievements-list,
  .languages-list {
    list-style-type: disc;
    list-position: inside;
  }

  .skills-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }

  .experience-list,
  .project-list {
    list-style-type: disc;
    list-position: inside;
    
  }

  .experience-list li,
  .project-list li {
   
  }

  .font-medium {
    font-weight: 500;
  }

  .section ul {
    padding-left: 24px;
  }
    p, li {
    line-height: 1;
    }
    h1,h2,h3, p{
     margin: 2px; /* Reset margin */
    padding: 2px; /* Reset padding */
    }
</style>

    
      <div class="resume-container">
        ${
          resume.header
            ? `
          <header class="header">
            <h1>${resume.header.name}</h1>
            <p>${resume.header.title}</p>
            <div class="contact-info">
               ${
                 resume.header.email
                   ? `<p>Email: ${resume.header.email}</p>`
                   : ""
               }  
               ${
                 resume.header.email
                   ? `<p>Phone: | ${resume.header.phone}</p>`
                   : ""
               }  
              <p>
                ${
                  resume.header.linkedin
                    ? ` |  <a href="${resume.header.linkedin}" class="text-blue-500 underline">LinkedIn</a>`
                    : ""
                }
                ${
                  resume.header.github
                    ? ` | <a href="${resume.header.github}" class="text-blue-500 underline">GitHub</a>`
                    : ""
                }
              </p>
             ${
               resume.header.address ? ` | <p>${resume.header.address}</p>` : ""
             }
            </div>
          </header>
        `
            : ""
        }
    
        ${
          resume.summary
            ? `
          <section class="section">
            <h2>Professional Summary</h2>
            <p>${resume.summary}</p>
          </section>
        `
            : ""
        }
    
        ${
          resume.skills && resume.skills.length > 0
            ? `
          <section class="section">
            <h2>Skills</h2>
            <ul class="skills-list">
              ${resume.skills.map((skill) => `<li>${skill}</li>`).join("")}
            </ul>
          </section>
        `
            : ""
        }
    
        ${
          resume.education && resume.education.length > 1
            ? `
          <section class="section">
            <h2>Education</h2>
            ${resume.education
              .map(
                (edu) => `
              <div>
                <h3 class="font-medium">${edu.degree}</h3>
                <p>${edu.institution}</p>
                <p>Graduation Year: ${edu.graduationYear}</p>
                ${edu.gpa ? `<p>GPA: ${edu.gpa}</p>` : ""}
              </div>
            `
              )
              .join("")}
          </section>
        `
            : ""
        }
    
        ${
          resume.experience && resume.experience.length > 1
            ? `
          <section class="section">
            <h2>Work Experience</h2>
            ${resume.experience
              .map(
                (job) => `
              <div>
                <h2 >${job.title}</h2>
                <h3>${job.company} | ${job.duration}</h3>
                <ul class="experience-list">
                  ${job.responsibilities
                    .map((res) => `<li>${res}</li>`)
                    .join("")}
                </ul>
              </div>
            `
              )
              .join("")}
          </section>
        `
            : ""
        }
    
        ${
          resume.projects && resume.projects.length > 1
            ? `
          <section class="section">
            <h2>Projects</h2>
            ${resume.projects
              .map(
                (project) => `
              <div>
                <h3 class="font-medium">${project.title}</h3>
                <p>Technologies: ${project.technologies.join(", ")}</p>
                <p>${project.description}</p>
              </div>
            `
              )
              .join("")}
          </section>
        `
            : ""
        }
    
        ${
          resume.certifications && resume.certifications.length > 0
            ? `
          <section class="section">
            <h2>Certifications</h2>
            <ul class="certifications-list">
              ${resume.certifications
                .map((cert) => `<li>${cert}</li>`)
                .join("")}
            </ul>
          </section>
        `
            : ""
        }
    
        ${
          resume.achievements && resume.achievements.length > 0
            ? `
          <section class="section">
            <h2>Awards and Achievements</h2>
            <ul class="achievements-list">
              ${resume.achievements.map((ach) => `<li>${ach}</li>`).join("")}
            </ul>
          </section>
        `
            : ""
        }
    
        ${
          resume.hobbies
            ? `
          <section class="section">
            <h2>Hobbies</h2>
            <p>${resume.hobbies}</p>
          </section>
        `
            : ""
        }
    
        ${
          resume.languages && resume.languages.length > 0
            ? `
          <section class="section">
            <h2>Languages</h2>
            <ul class="languages-list">
              ${resume.languages.map((lang) => `<li>${lang}</li>`).join("")}
            </ul>
          </section>
        `
            : ""
        }
    
        ${
          resume.volunteer
            ? `
          <section class="section">
            <h2>Volunteer Work</h2>
            <p>${resume.volunteer}</p>
          </section>
        `
            : ""
        }
      </div>
    `;

  return (
     <div style={{
    backgroundImage: "url('https://i.ibb.co/BZ8xCc0/bgthree.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center"
  }}>
    <p  onClick={()=>{navigate('/')}} className=" hover:cursor-pointer flex justify-center mt-28 font-bold text-[56px] text-blue-500 mb-10">Cover Fusion</p>
    <div className="flex justify-center w-screen">
      <div className="border-2 mt-5 w-[800px] border-gray-800 bg-white">
        <p className="text-[50px] text-center font-medium">Resume Builder</p>
        <form
          encType="mutlipart/form-data"
          onSubmit={handleSubmit}
          className="mx-5  mb-5"
        >
          <div className="mb-4">
            <label htmlFor="resume" className="block text-sm font-medium mb-1">
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
            Rebuild your resume
          </button>
          <button
            className="w-fit flex mt-5 mx-auto bg-blue-600 text-white p-2 rounded-md"
            type="button"
            onClick={() => {
              setLoading(false);
              setResumeForm(true);
            }}
          >
            Edit your resume
          </button>
        </form>
        {loading && (
          <p className="ml-5 my-5 font-medium text-[20px]">
            Resume is being generated...
          </p>
        )}

        {/* resume template */}
        {resume &&
          (resumeForm ? (
            <ResumeForm onSubmitResume={handleResumeData} />
          ) : (
            <>
              <div
                className="m-2 mx-5"
                dangerouslySetInnerHTML={{ __html: resumeHtml }}
              />
            </>
          ))}

        {/* template end */}
        {pdf && (
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

export default ResumeBuilder;
