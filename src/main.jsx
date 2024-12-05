import { StrictMode } from "react";

import "./index.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import ReactDOM from "react-dom/client";
import UserLogin from "./pages/UserLogin.jsx";
import UserRegister from "./pages/UserRegister.jsx";
import CoverLetter from "./pages/CoverLetter.jsx";
import { AuthProvider } from "./Provider/AuthProvider";
import Search from "./pages/Search.jsx";
import ProtectedRoute from "./Auth/ProtectedRoute.jsx";
import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
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
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
