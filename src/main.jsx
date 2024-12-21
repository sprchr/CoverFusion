import { StrictMode } from "react";
import { ToastContainer } from "react-toastify";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ReactDOM from "react-dom/client";
import UserLogin from "./pages/UserLogin.jsx";
import UserRegister from "./pages/UserRegister.jsx";
import CoverLetter from "./pages/CoverLetter.jsx";
// import { AuthProvider } from "./Provider/AuthProvider";
import Search from "./pages/Search.jsx";
// import ProtectedRoute from "./Auth/ProtectedRoute.jsx";
import App from "./App.jsx";
import ResumeBuilder from "./pages/ResumeBuilder.jsx";
import ResumeDraft from "./pages/ResumeDraft.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/register" element={<UserRegister />} />
        <Route path="/search" element={<Search />} />
        <Route path="/coverletter" element={<CoverLetter />} />
        <Route path="/resume" element={<ResumeBuilder />} />
        <Route path="/resumedraft" element={<ResumeDraft />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
