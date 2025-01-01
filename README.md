## **React Frontend Project Documentation**

### **CoverFusion**

#### **1. Project Description**

Wikisource is a React.js-based web application designed to harness AI technology for enhancing professional documents. The platform offers users the ability to:

- **Generate customized cover letters** by analyzing existing resumes and job descriptions.
- **Upgrade and enhance resumes**, tailoring them to meet industry standards and align with specific career goals.

#### **2. Technologies**

- **React.js**: Frontend framework for building user interfaces.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **React Router DOM**: For managing client-side routing.
- **Firebase**: For backend services and authentication.
- **VS Code**: Development environment.
- **NPM Packages**: Various packages to enhance functionality.

#### **3. Setup and Installation**

**Installation Steps:**

1. Clone the repository:

   ```bash
   git clone https://github.com/sprchr/WikiSource.git
   ```

2. Navigate to the project directory:

   ```bash
   cd project-repo
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

#### **4. Project Structure**

The project follows a well-defined folder structure for scalability and maintainability:

```
root/
|-- firebase/            # Firebase configuration files
|   |-- firebaseconfig.js
|-- public/              # Public assets and index.html
|-- src/                 # Application source files
|   |-- assets/          # Images, fonts, and other static files
|   |-- auth/            # Authentication-related components
|   |   |-- login.jsx
|   |   |-- protectedRoutes.jsx
|   |-- pages/           # Page-level components
|   |   |-- coverletter.jsx
|   |   |-- resumebuilder.jsx
|   |   |-- resumeform.jsx
|   |   |-- search.jsx
|   |   |-- userlogin.jsx
|   |   |-- userregistration.jsx
|   |-- provider/        # Context and provider components
|   |   |-- authprovider.jsx
|   |-- app.jsx          # Root component
|   |-- main.jsx         # Entry point
|-- index.html           # Main HTML file
|-- index.css            # Global styles
|-- eslint.config.js     # ESLint configuration
|-- postcss.config.js    # PostCSS configuration
|-- tailwind.config.js   # Tailwind CSS configuration
|-- vite.config.js       # Vite configuration
|-- package.json         # Project metadata and dependencies
```

#### **5. Components**

##### **1. CoverLetter Component**

The CoverLetter component is a React-based feature that generates tailored cover letters using job descriptions and resumes. It allows users to view the generated cover letter in the browser and download it as a PDF.

**Key Features:**

- **Job Description Input**: Users can input the job description in a text area.
- **Resume Upload**: Users can upload their resume file for processing.
- **Cover Letter Generation**: Sends the job description and resume to a backend API for cover letter generation.
- **PDF Download**: Allows users to download the generated cover letter as a PDF file using `generatePDF`.
- **Dynamic Rendering**: Displays the generated cover letter using `dangerouslySetInnerHTML` and conditionally renders buttons and loading messages.

##### **2. ResumeBuilder Component**

The ResumeBuilder component enables users to upload a resume, edit it, view the generated resume in HTML format, and download it as a PDF.

**Key Features:**

- **State Management**: Uses `useState` to manage form visibility, file uploads, loading state, and errors.
- **File Upload**: Users can upload a resume file, which is processed to build a new resume.
- **Resume Editing**: After building the resume, users can edit it through a form, sending the updated data to the backend.
- **Firebase Integration**: Submits resume data to Firebase, linking it to the authenticated user.
- **Generate PDF**: Allows users to download the generated resume as a PDF.
- **Form Submission**: API calls to generate and save the resume.
- **Error Handling**: Displays an error message when needed.

##### **3. ResumeForm Component**

The ResumeForm component contains a form integrated with Firebase to fetch existing resume data for a user, with sections like "Header," "Professional Summary," "Skills," "Education," "Experience," "Projects," "Certifications," "Achievements," "Hobbies," "Languages," and "Volunteer."

**Key Features:**

- **Fetching User Data from Firebase**: The `fetchResumeData` function retrieves resume data using the `userId` from Firebase.
- **Dynamic Form**: Users can add/remove entries in sections like "Education" and "Experience," and enter comma-separated values for fields like skills.
- **Form Submission**: Submits the resume data to the parent component for further processing.

##### **4. App Component**

The `App` component handles user authentication state and navigates between different pages based on the user's login status.

**Key Features:**

- **Tracks Authentication State**: Uses Firebase's `onAuthStateChanged` method to check the user's authentication status.
- **Navigation**: Displays buttons that navigate to either the "CoverLetter" or "Resume Builder" components based on authentication status.
- **UI Structure**: Styled using Tailwind CSS with hover effects and animations.

#### 5. **State Management**

The application uses an `AuthContext` to manage the authentication state.

**Key Points:**

1. **AuthContext**: Provides the authentication state to the entire app.
2. **AuthProvider Component**: Manages the `isAuthenticated` state and subscribes to Firebase's `onAuthStateChanged`.
3. **useAuth Hook**: A custom hook that provides access to the authentication state throughout the app.

#### **6. Authentication**

##### **UserLogin Component**

The `UserLogin` component handles user login using Google or email/password.

**Key Features:**

- **Google Login**: Uses Firebase Authentication's `signInWithPopup` with a Google provider for logging in.
- **Email/Password Login**: Uses `signInWithEmailAndPassword` to authenticate users with email and password.
- **Navigation**: Redirects users to the home page on successful login or to the registration page if not registered.

##### **UserRegister Component**

The `UserRegister` component handles user registration via email and password using Firebase Authentication.

**Key Features:**

- **Email/Password Registration**: Uses `createUserWithEmailAndPassword` to register users.
- **Error and Success Handling**: Displays messages based on the registration result.

#### **7. Routing and Protected Routes**

- **StrictMode**: The app is wrapped in `StrictMode` to detect potential issues during development.
- **Routing**: `BrowserRouter` and `Routes` are used to manage routes.
  - **Protected Routes**: The `ProtectedRoute` component ensures that only authenticated users can access certain routes like `/coverletter` and `/resume`.

#### **8. Deployment on Vercel**

**Steps to Deploy:**

1. **Create a Vercel Account**:

   - Go to [Vercel](https://vercel.com) and sign up.

2. **Install Vercel CLI (Optional)**:

   - Install the Vercel CLI for easier deployment using the command:
     ```bash
     npm install -g vercel
     ```

3. **Build the React App**:

   - Run the following command to prepare your app for deployment:
     ```bash
     npm run build
     ```

4. **Deploy with Vercel**:

   - If using the CLI, run:
     ```bash
     vercel
     ```
   - Follow the prompts to deploy the app.

5. **Automatic Deployment**:
   - You can also connect your GitHub repository to Vercel, enabling automatic deployments on push.
