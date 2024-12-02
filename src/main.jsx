import { StrictMode } from 'react'

import './index.css'
import App from './App.jsx'
import { BrowserRouter,Route,Routes } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import UserLogin from './pages/UserLogin.jsx';
import UserRegister from './pages/UserRegister.jsx';


ReactDOM.createRoot(document.getElementById('root')).render(
    <StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App/>} />
          <Route path="/login" element={<UserLogin/>} />
          <Route path="/register" element={<UserRegister/>} />
        </Routes>
      </BrowserRouter>
    </StrictMode>

);

