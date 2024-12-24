import React, { useEffect, useState } from "react";
import axios from "axios";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig.js";
import PDFGenerator from "./PDFGenerator.jsx";

const ResumeDraft = () => {
  const navigate = useNavigate()
  const [pdf, setPdf] = useState(false);
  const [editForm, setEditForm] = useState(true);
  const [errors, setErrors] = useState({});
  const [loading,setLoading] = useState(false)
  const auth = getAuth();
  const user = auth.currentUser;

  const handleLogout = () => {
    const auth = getAuth();
    auth
      .signOut()
      .then(() => {
        localStorage.clear
        navigate("/"); // Redirect to the login page after logout
      })
      .catch((error) => {
        console.error("Logout failed:", error); // Log any errors during logout
      });
  };

 


  const handleSubmit = async (e) => {
     
     
      // Get the userId from Firebase Authentication (or from wherever you store it)
     // Assuming user is authenticated
     setLoading(true)
     setEditForm(false)
    e.preventDefault()
      try {
          // Create a reference to the Firestore document for the user
          const response = await axios.post(
              `${import.meta.env.VITE_API_CALL}/editresume`,
              resume,
              {
                headers:{
                  "Content-Type": "application/json",
                }
              }
          )
          
          
          setResume(response.data); // Optionally update the resume state with new data
         
          setPdf(true);  // Trigger any necessary state change (e.g., for showing a PDF preview)
          
          // console.log(resume)
          console.log(resumeHtml);
          setLoading(false)
      } catch (error) {
          console.error("Request failed:", error);
      }
  };
  

  const fetchResumeData = async (userId) => {
    // console.log(userId)
    try {
      // Reference to the user's resume document
      const userDocRef = doc(db, "resumedraft", userId);

      // Fetch the document snapshot
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        // Extract the data from the document
        const resumeData = userDocSnap.data();

        // console.log("Fetched Resume Data:", resumeData);

        // Update the resume state
        setResume(resumeData.firebase); // Assuming `setResume` is accessible in this scope
        console.log(resumeData);
        
        setPdf(true)
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
        }
      });
    
      // Clean up the listener when the component unmounts
      return () => unsubscribe();
    }, []);
  // // Call this function where needed (e.g., in useEffect after user authentication)
  
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
    education: [
      {
        degree: "",
        institution: "",
        graduationYear: "",
        gpa: "",
      },
    ],
    experience: [
      {
        title: "",
        company: "",
        responsibilities: [],
        duration: "",
      },
    ],
    // projects: [
    //   {
    //     title: "",
    //     description: "",
    //     technologies: [],
    //   },
    // ],
    certifications: [],
    achievements: [],
    hobbies: "",
    languages: [],
    volunteer: "",
  });

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
    const updatedErrors = { ...errors };
    if (updatedErrors[field]) delete updatedErrors[field];
    setErrors(updatedErrors);
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
    } 
    // else if (section === "projects") {
    //   newEntry = { title: "", technologies: [], description: "" };
    // }

    // Update the state for the respective section by adding a new entry
    setResume({ ...resume, [section]: [...resume[section], newEntry] });
  };
  const removeEntry = (section, index) => {
    // Filter out the entry to be removed based on the index
    const updatedSection = resume[section].filter((_, idx) => idx !== index);

    // Update the state for the respective section by removing the entry
    setResume({ ...resume, [section]: updatedSection });
  };
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
        .edit-form {
  font-weight: 600; /* equivalent to 'font-semibold' */
  font-size: 18px; /* equivalent to 'text-[18px]' */
  border: 2px solid; /* equivalent to 'border-2' */
  border-radius: 8px; /* equivalent to 'rounded-md' */
  padding: 8px 16px; /* equivalent to 'p-2' */
  display: flex; /* equivalent to 'flex' */
  margin: 0 auto; /* equivalent to 'mx-auto' */
      margin-top : 20px;
      .edit-form:hover {
  transform: scale(1.05);
}
}
    </style>
  
          <div class="resume-container">
          
            ${
              resume.header
                ? `
              <header class="header">
                <h1>${resume.header?.name}</h1>
                <p>${resume.header?.title}</p>
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
                   resume.header.address
                     ? ` | <p>${resume.header.address}</p>`
                     : ""
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
              resume.education && resume.education.length > 0
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
              resume.experience && resume.experience.length > 0
                ? `
              <section class="section">
                <h2>Project Experience</h2>
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
                  ${resume.achievements
                    .map((ach) => `<li>${ach}</li>`)
                    .join("")}
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

      {editForm ? (
        <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow">
       
          <header className="border-b-2 pb-4 text-center mb-6">
            <h1 className="text-2xl font-bold">Resume Draft</h1>
            <p className="text-lg">
              Fill out your information below and click on field to edit
            </p>
          </header>

          {/* Header Section */}
          <section className="mb-2 border-b-2">
            <div className="flex flex-col items-center ">
              <div className="text-[24px] font-bold">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="px-2 text-center focus:outline-blue-500  "
                  value={resume.header?.name}
                  onChange={(e) =>
                    handleChange("name", e.target.value, "header")
                  }
                  style={{
                    width: resume.header?.name
                      ? `${resume.header?.name.length + 2}ch`
                      : "auto",
                  }}
                />
                
              </div>
              <div className="text-[18px]">
                <input
                  type="text"
                  placeholder="Your Title"
                  className=" c text-center focus:outline-blue-500 mb-2"
                  value={resume.header?.title}
                  onChange={(e) =>
                    handleChange("title", e.target.value, "header")
                  }
                  style={{
                    width: resume.header?.title
                      ? `${resume.header?.title.length + 1}ch`
                      : "auto",
                  }}
                />
                <span className="absolute opacity-0">
                  {resume.header?.title}
                </span>
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
              onChange={(e) =>
                handleChange("skills", e.target.value.split(", "))
              }
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
                    handleChange(
                      idx,
                      e.target.value,
                      "education",
                      idx,
                      "degree"
                    )
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
                    handleChange(idx, e.target.value, "education", idx, "gpa")
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
              <h2 className="text-[18px]  font-bold mb-2">Project Experience</h2>
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
                    handleChange(
                      idx,
                      e.target.value,
                      "experience",
                      idx,
                      "title"
                    )
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
                    handleChange(
                      idx,
                      e.target.value,
                      "experience",
                      idx,
                      "company"
                    )
                  }
                  style={{
                    width: exp.company
                      ? `  ${Math.max(exp.company, 10) + 2}ch`
                      : ``, // Dynamic width based on content
                  }}
                />
                <br></br>
                <textarea
                  placeholder="enter Responsibilites seperated by comma"
                  className="w-full focus:outline-blue-500 "
                  value={exp.responsibilities.join(",")}
                  onChange={(e) =>
                    handleChange(
                      "responsibilities",
                      e.target.value.split(", "),
                      "experience",
                      idx
                    )
                  }
                />
                <br></br>
                <input
                  type="text"
                  placeholder="Month Year - Month Year"
                  className="focus:outline-blue-500"
                  value={exp.duration}
                  onChange={(e) =>
                    handleChange("duration", e.target.value, "experience", idx)
                  }
                  style={{
                    width: exp.duration
                      ? `${Math.max(exp.duration, 10) + 2}ch `
                      : ``, // Dynamic width based on content
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
          {/* <section className="mb-2 border-b-2">
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
                  onChange={(e) =>
                    handleChange(
                      "technologies",
                      e.target.value,
                      "projects",
                      idx
                    )
                  }
                />
                <br></br>
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
          </section> */}
          {/*certification*/}
          <section className="mb-2 border-b-2">
            <div className="flex gap-10 items-center">
              <h2 className="text-[18px]  font-bold mb-2">Certifications</h2>
            </div>
            <div className="mb-4">
              <textarea
                placeholder="Enter certification separated by commas"
                className="w-full focus:outline-blue-500 "
                value={resume.certifications.join(", ")}
                onChange={(e) =>
                  handleChange("certifications", e.target.value.split(", "))
                }
                rows={Math.max(1, resume.summary.split("\n").length)}
              />
            </div>
          </section>
          {/*achievements*/}
          <section className="mb-2 border-b-2">
            <div className="flex gap-10 items-center">
              <h2 className="text-[18px]  font-bold mb-2">Achievements</h2>
            </div>
            <div className="mb-4">
              <textarea
                placeholder="Enter certification separated by commas"
                className="w-full focus:outline-blue-500 "
                value={resume.achievements.join(", ")}
                onChange={(e) =>
                  handleChange("achievements", e.target.value.split(", "))
                }
                rows={Math.max(1, resume.summary.split("\n").length)}
              />
            </div>
          </section>
          {/*hobbies*/}
          <section className="mb-2 border-b-2">
            <div className="flex gap-10 items-center">
              <h2 className="text-[18px]  font-bold mb-2">hobbies</h2>
            </div>
            <div className="mb-4">
              <textarea
                placeholder="Enter certification separated by commas"
                className="w-full focus:outline-blue-500 "
                value={resume.hobbies}
                onChange={(e) =>
                  handleChange("hobbies", e.target.value.split(", "))
                }
                rows={Math.max(1, resume.summary.split("\n").length)}
              />
            </div>
          </section>
          {/*languages*/}
          <section className="mb-2 border-b-2">
            <div className="flex gap-10 items-center">
              <h2 className="text-[18px]  font-bold mb-2">Languages</h2>
            </div>
            <div className="mb-4">
              <textarea
                placeholder="English:fluet,Telugu:Fluent..."
                className="w-full focus:outline-blue-500 "
                value={resume.languages.join(", ")}
                onChange={(e) =>
                  handleChange("languages", e.target.value.split(", "))
                }
                rows={Math.max(1, resume.summary.split("\n").length)}
              />
            </div>
          </section>
          {/*volunteer*/}
          <section className="mb-2 border-b-2">
            <div className="flex gap-10 items-center">
              <h2 className="text-[18px]  font-bold mb-2">Volunter</h2>
            </div>
            <div className="mb-4">
              <textarea
                placeholder="Enter Volunter separated by commas"
                className="w-full focus:outline-blue-500 "
                value={resume.volunteer}
                onChange={(e) =>
                  handleChange("volunteer", e.target.value.split(", "))
                }
                
              />
            </div>
          </section>
          <button type="submit"
            className="px-6 py-2 bg-green-500 text-white rounded mt-6"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      ) : (
        <>
          {/* {loading && (
            <p className="ml-5 my-5 text-black font-medium text-[20px]">
              Resume is being generated...
            </p>
          )} */}

          {resume &&
           (
              <>
             
                <button class="edit-form" onClick={() => {

                  setEditForm(true)
                  {user ? 
                  fetchResumeData() :
                  setResume({
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
                    education: [
                      {
                        degree: "",
                        institution: "",
                        graduationYear: "",
                        gpa: "",
                      },
                    ],
                    experience: [
                      {
                        title: "",
                        company: "",
                        responsibilities: [],
                        duration: "",
                      },
                    ],
                    // projects: [
                    //   {
                    //     title: "",
                    //     description: "",
                    //     technologies: [],
                    //   },
                    // ],
                    certifications: [],
                    achievements: [],
                    hobbies: "",
                    languages: [],
                    volunteer: "",
                  })
                  }
                }}
                  >
                  Draft Resume
                </button>
                {loading && <p className="text-center font-bold text-[20px] mt-5">Please wait resume is being loaded...</p>}
                <div
                  className="m-2 mx-5"
                  dangerouslySetInnerHTML={{ __html: resumeHtml }}
                />
              </>
            )}

          {pdf && (
      <PDFGenerator  resumeHtml={resumeHtml} firebase={resume} path={"resumedraft"}  navigate={navigate}/>
          )}
        </>
      )}
    </div>
  );
};

export default ResumeDraft;


// ${
//   resume.projects && resume.projects.length > 0
//     ? `
//   <section class="section">
//     <h2>Projects</h2>
//     ${resume.projects
//       .map(
//         (project) => `
//       <div>
//         <h3 class="font-medium">${project.title}</h3>
//         <p>Technologies: ${project.technologies.join(", ")}</p>
//         <p>${project.description}</p>
//       </div>
//     `
//       )
//       .join("")}
//   </section>
// `
//     : ""
// }