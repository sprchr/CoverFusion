import React, { useEffect, useState } from "react";
import { getAuth} from "firebase/auth";
import {  doc, getDoc} from 'firebase/firestore';
import { db } from "../../firebase/firebaseConfig.js"; 
const ResumeForm = ({ onSubmitResume }) => {
  const fetchResumeData = async (userId) => {
    console.log(userId)
    try {
      // Reference to the user's resume document
      const userDocRef = doc(db, "Users", userId);
  
      // Fetch the document snapshot
      const userDocSnap = await getDoc(userDocRef);
  
      if (userDocSnap.exists()) {
        // Extract the data from the document
        const resumeData = userDocSnap.data();
  
        console.log("Fetched Resume Data:", resumeData);
  
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
    summary:
      "",
    skills: [],
    education: [
      {
        degree: "",
        institution: "",
        graduationYear: "",
        gpa:"",
      },
    ],
    experience: [
      {
        title: "",
        company: "",
        duration: "",
        responsibilities: [
        ],
      },
    ],
    projects: [
      {
        title: "",
        technologies: [],
        description: "",
      },
    ],
    certifications: [
    ],
    achievements: [],
    hobbies: "",
    languages: [],
    volunter: "",
  });

  // Update form values dynamically
  const handleChange = (field, value, section, index, subField) => {
    if (section) {
      if (index !== undefined) {
        const updatedSection = [...resume[section]];
        if (subField) {
          updatedSection[index][subField] = value; // Handle subField updates
        } else {
          updatedSection[index] = { ...updatedSection[index], [field]: value }; // Update specific field within an array
        }
        setResume({ ...resume, [section]: updatedSection });
      } else {
        const updatedSection = { ...resume[section], [field]: value };
        setResume({ ...resume, [section]: updatedSection });
      }
    } else {
      setResume({ ...resume, [field]: value }); // Update top-level fields
    }
  };
  
  const addEntry = (section) => {
    let newEntry;

    if (section === "education") {
      newEntry = { degree: "", institution: "", graduationYear: "", gpa: "" };
    } else if (section === "experience") {
      newEntry = {
        title: "",
        company: "",
        duration: "",
        responsibilities: [],
      };
    } else if (section === "projects") {
      newEntry = { title: "", technologies: [], description: "" };
    }

    // Update the state for the respective section by adding a new entry
    setResume({ ...resume, [section]: [...resume[section], newEntry] });
  };
  const removeEntry = (section, index) => {
    // Filter out the entry to be removed based on the index
    const updatedSection = resume[section].filter((_, idx) => idx !== index);

    // Update the state for the respective section by removing the entry
    setResume({ ...resume, [section]: updatedSection });
  };
  const handleSubmit = () => {
    console.log("Form Submitted:", resume);
    
    // Call the parent's callback function with the resume data
    if (onSubmitResume) {
      onSubmitResume(resume);
    }
  };
  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow">
      <header className="border-b-2 pb-4 text-center mb-6">
        <h1 className="text-2xl font-bold">Resume Builder</h1>
        <p className="text-lg">Fill out your information below and click on field to edit</p>
      </header>

      {/* Header Section */}
      <section className="mb-2 border-b-2">
        <div className="flex flex-col items-center ">
          <div className="text-[24px] font-bold">
            <input
              type="text"
              placeholder="Your Name"
              className="px-2 text-center focus:outline-blue-500  "
              value={resume.header.name}
              onChange={(e) =>
                handleChange("name", e.target.value, "header")
              }
              style={{ width: resume.header.name ? `${resume.header.name.length + 2}ch` : 'auto' }}

            />
          </div>
          <div className="text-[18px]">
            <input
              type="text"
              placeholder="Your Title"
              className=" c text-center focus:outline-blue-500 mb-2"
              value={resume.header.title}
              onChange={(e) => handleChange("title", e.target.value, "header")}
              style={{ width: resume.header.title ? `${resume.header.title.length + 1}ch` : 'auto' }}
            />
            <span className="absolute opacity-0">{resume.header.title}</span>
          </div>
          <div className="flex justify-center flex-wrap text-18 mb-2">
            {["email", "phone", "linkedin", "github", "address"].map(
              (field) => (
                <div key={field} className="relative mb-2">
                  <input
                    type="text"
                    placeholder={field}
                    className=" text-center focus:outline-blue-500"
                    value={resume.header[field]}
                    onChange={(e) =>
                      handleChange(field, e.target.value, "header")
                    }
                    style={{
                      width: `${
                        Math.max(
                          resume.header[field]?.length || 0,
                          field.length
                        ) + 2
                      }ch`, // Dynamic width based on content
                    }}
                  />
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Professional Summary */}
      <section className="mb-2 border-b-2">
        <h2 className="text-[18px] font-bold mb-2">Professional Summary</h2>
        <textarea
          placeholder="Summary"
          className="w-full focus:outline-blue-500 "
          value={resume.summary}
          onChange={(e) => handleChange("summary", e.target.value)}
          rows={Math.max(1, resume.summary.split("\n").length)}
        />
      </section>

      {/* Skills Section */}
      <section className="mb-2 border-b-2">
        <h2 className="text-xl font-semibold mb-2">Skills</h2>
        <textarea
          placeholder="Enter skills separated by commas"
          className="w-full focus:outline-blue-500 "
          value={resume.skills.join(", ")}
          onChange={(e) => handleChange("skills", e.target.value.split(", "))}

        />
      </section>

      {/* Education Section */}
      <section className="mb-2 border-b-2">
        <div className="flex gap-10 items-center">
          <h2 className="text-[18px]  font-bold mb-2">Education</h2>
          <button
            className="font-bold text-black text-[25px] mt-[-14px]"
            onClick={() => addEntry("education")}
          >
            +
          </button>
        </div>
        {resume.education.map((edu, idx) => (
          <div key={idx} className="mb-4">
            <input
              type="text"
              placeholder="Degree"
              className="focus:outline-blue-500"
              value={edu.degree}
              onChange={(e) =>
                handleChange(idx, e.target.value, "education", idx, "degree")
              }
              style={{
                width: `${Math.max(edu.degree?.length, 10) + 2}ch`,
              }}
            />{" "}
            <br></br>
            <input
              type="text"
              placeholder="Institution"
              className="focus:outline-blue-500"
              value={edu.institution}
              onChange={(e) =>
                handleChange(
                  idx,
                  e.target.value,
                  "education",
                  idx,
                  "institution"
                )
              }
              style={{
                width: `${Math.max(edu.institution?.length, 10) + 2}ch`, 
              }}
            />
            <br></br>
            <input
              type="month"
              className="focus:outline-blue-500"
              value={edu.graduationYear ? `${edu.graduationYear}-01` : ""}
              onChange={(e) => {
                const year = new Date(e.target.value).getFullYear();
                handleChange(idx, year, "education", idx, "graduationYear");
              }}
            />
            <br></br>
            <input
              type="text"
              className="focus:outline-blue-500"
              value={edu.gpa}
              onChange={(e) =>
                handleChange(
                  idx,
                  e.target.value,
                  "education",
                  idx,
                  "gpa"
                )
              }
              style={{
                width: `${Math.max(edu.gpa?.length, 10) + 2}ch`, // Dynamic width based on content
              }}
            />
            <button
              className="font-bold text-black ml-44 text-[16px]"
              onClick={() => removeEntry("education", idx)} // Pass idx to removeEntry
            >
              Delete
            </button>
          </div>
        ))}
      </section>


      {/*experience*/}
      <section className="mb-2 border-b-2">
        <div className="flex gap-10 items-center">
          <h2 className="text-[18px]  font-bold mb-2">Experience</h2>
          <button
            className="font-bold text-black text-[25px] mt-[-14px]"
            onClick={() => addEntry("experience")}
          >
            +
          </button>
        </div>
        {resume.experience.map((exp, idx) => (
          <div key={idx} className="mb-4">
            <input
              type="text"
              placeholder="Role"
              className="focus:outline-blue-500"
              value={exp.title}
              onChange={(e) =>
                handleChange(idx, e.target.value, "experience", idx, "title")
              }
              style={{
                width: `${Math.max(exp.title?.length, 10) + 2}ch`, // Dynamic width based on content
              }}
            />{" "}
            <br></br>
            <input
              type="text"
              placeholder="Company Name"
              className="focus:outline-blue-500"
              value={exp.company}
              onChange={(e) =>
                handleChange(idx, e.target.value, "experience", idx, "company")
              }
              style={{
                width:exp.company ?  `  ${Math.max(exp.company, 10) + 2}ch`:`` , // Dynamic width based on content
              }}
            />
            <br></br>
            <textarea
          placeholder="enter Responsibilites seperated by comma"
          className="w-full focus:outline-blue-500 "
          value={exp.responsibilities.join(",")}
          onChange={(e) =>
            handleChange("responsibilities", e.target.value.split(", "), "experience", idx) 
          }
         /><br></br>
            <input
              type="text"
              placeholder="Month Year - Month Year"
              className="focus:outline-blue-500"
              value={exp.duration}
              onChange={(e) =>
                handleChange("duration", e.target.value, "experience", idx)
              }
              style={{
                width:exp.duration ?  `${Math.max(exp.duration, 10) + 2}ch `:``, // Dynamic width based on content
              }}
            />
            <button
              className="font-bold text-black ml-44 text-[16px]"
              onClick={() => removeEntry("experience", idx)} // Pass idx to removeEntry
            >
              Delete
            </button>
          </div>
        ))}
      </section>
     
      {/* Add similar sections for experience, projects, certifications, achievements, etc. */}
 

   {/*projects*/}
   <section className="mb-2 border-b-2">
        <div className="flex gap-10 items-center">
          <h2 className="text-[18px]  font-bold mb-2">Projects</h2>
          <button
            className="font-bold text-black text-[25px] mt-[-14px]"
            onClick={() => addEntry("projects")}
          >
            +
          </button>
        </div>
        {resume.projects.map((pra, idx) => (
          <div key={idx} className="mb-4">
            <input
              type="text"
              placeholder="Project Title"
              className="focus:outline-blue-500"
              value={pra.title}
              onChange={(e) =>
                handleChange(idx, e.target.value, "projects", idx, "title")
              }
              style={{
                width: `${Math.max(pra.title?.length, 10) + 2}ch`, // Dynamic width based on content
              }}
            />{" "}
            <br></br>
            <textarea
          placeholder="Technologies"
          className="w-full focus:outline-blue-500 "
          value={pra.technologies}
          onChange={(e) => handleChange("technologies", e.target.value,"projects",idx)}
          
         /><br></br>
            <textarea
              type="text"
              placeholder="Description"
              className="focus:outline-blue-500 w-full"
              value={pra.description}
              onChange={(e) =>
                handleChange(
                  idx,
                  e.target.value,
                  "projects",
                  idx,
                  "description"
                )
              }
              
            />
            <br></br>
            
            <button
              className="font-bold text-black  text-[16px]"
              onClick={() => removeEntry("projects", idx)} // Pass idx to removeEntry
            >
              Delete
            </button>
          </div>
        ))}
      </section>
      {/*certification*/}
      <section className="mb-2 border-b-2">
        <div className="flex gap-10 items-center">
          <h2 className="text-[18px]  font-bold mb-2">Certifications</h2>
        </div>
          <div  className="mb-4">
            <textarea
          placeholder="Enter certification separated by commas"
          className="w-full focus:outline-blue-500 "
          value={resume.certifications.join(", ")}
          onChange={(e) => handleChange("certifications", e.target.value.split(", "))}
          rows={Math.max(1, resume.summary.split("\n").length)}
        />
            
          </div>
     
      </section>
      {/*achievements*/}
      <section className="mb-2 border-b-2">
        <div className="flex gap-10 items-center">
          <h2 className="text-[18px]  font-bold mb-2">Achievements</h2>
        </div>
          <div  className="mb-4">
            <textarea
          placeholder="Enter certification separated by commas"
          className="w-full focus:outline-blue-500 "
          value={resume.achievements.join(", ")}
          onChange={(e) => handleChange("achievements", e.target.value.split(", "))}
          rows={Math.max(1, resume.summary.split("\n").length)}
        />
            
          </div>
     
      </section>
       {/*hobbies*/} 
       <section className="mb-2 border-b-2">
        <div className="flex gap-10 items-center">
          <h2 className="text-[18px]  font-bold mb-2">hobbies</h2>
        </div>
          <div  className="mb-4">
            <textarea
          placeholder="Enter certification separated by commas"
          className="w-full focus:outline-blue-500 "
          value={resume.hobbies}
          onChange={(e) => handleChange("hobbies", e.target.value.split(", "))}
          rows={Math.max(1, resume.summary.split("\n").length)}
        />         
          </div>
     
      </section> 
     {/*languages*/}
     <section className="mb-2 border-b-2">
        <div className="flex gap-10 items-center">
          <h2 className="text-[18px]  font-bold mb-2">Languages</h2>
        </div>
          <div  className="mb-4">
            <textarea
          placeholder="English:fluet,Telugu:Fluent..."
          className="w-full focus:outline-blue-500 "
          value={resume.languages.join(", ")}
          onChange={(e) => handleChange("languages", e.target.value.split(", "))}
          rows={Math.max(1, resume.summary.split("\n").length)}
        />
          </div>
     
      </section>
     {/*volunteer*/}
     <section className="mb-2 border-b-2">
        <div className="flex gap-10 items-center">
          <h2 className="text-[18px]  font-bold mb-2">Volunter</h2>
        </div>
          <div  className="mb-4">
            <textarea
          placeholder="Enter Volunter separated by commas"
          className="w-full focus:outline-blue-500 "
          value={resume.volunteer}
          onChange={(e) => handleChange("volunter", e.target.value.split(", "))}
          rows={Math.max(1, resume.summary.split("\n").length)}
        />         
          </div>
     
      </section> 
      <button
        className="px-6 py-2 bg-green-500 text-white rounded mt-6"
        onClick={() => handleSubmit()}
      >
        Submit
      </button>
    </div>
  );
};

export default ResumeForm;
