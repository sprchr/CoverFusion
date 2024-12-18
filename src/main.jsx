import { StrictMode } from "react";
import { ToastContainer} from 'react-toastify';
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ReactDOM from "react-dom/client";
import UserLogin from "./pages/UserLogin.jsx";
import UserRegister from "./pages/UserRegister.jsx";
import CoverLetter from "./pages/CoverLetter.jsx";
import { AuthProvider } from "./Provider/AuthProvider";
import Search from "./pages/Search.jsx";
import ProtectedRoute from "./Auth/ProtectedRoute.jsx";
import App from "./App.jsx";
import ResumeBuilder from "./pages/ResumeBuilder.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
      <ToastContainer/>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/register" element={<UserRegister />} />
          <Route path="/search" element={<Search />} />
          <Route
            path="/coverletter"
            element={
              <ProtectedRoute>
                <CoverLetter />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resume"
            element={
              <ProtectedRoute>
                <ResumeBuilder />
              </ProtectedRoute>
            }
          />
        </Routes>
          
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
