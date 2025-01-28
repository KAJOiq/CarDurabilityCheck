import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Form from "./components/Form";
import Header from "./components/Header";
import ViewData from "./components/ViewData";
import CertificatesPage from "./components/CertificatesPage";
import FetchUsers from "./components/FetchUsers";
import Login from "./components/Login"; 
import ProjectStatus from "./components/ProjectStatus"
import './index.css';

const App = () => {
  const [userName, setUserName] = useState(""); // Store logged-in username
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state
  const [formType, setFormType] = useState("inquiry"); // Default form type

  const handleLogin = (userName) => {
    setUserName(userName);
    setIsLoggedIn(true); // Set logged-in state to true after login
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col items-center">
        {isLoggedIn ? (
          <>
            <Header userName={userName} setFormType={setFormType} />
            <main className="w-full max-w-7xl p-4">
              <Routes>
                <Route path="/entry" element={<Form formType="entry" setFormType={setFormType} />} />
                <Route path="/inquiry" element={<Form formType="inquiry" setFormType={setFormType} />} />
                <Route path="/view-data" element={<ViewData />} />
                <Route path="/certificates" element={<CertificatesPage />} />
                <Route path="/users" element={<FetchUsers />} />
                <Route path="/" element={<ProjectStatus/>} />
              </Routes>
            </main>
          </>
        ) : (
          <Login onLogin={handleLogin} /> // Pass handleLogin function to Login component
        )}
      </div>
    </Router>
  );
};

export default App;
