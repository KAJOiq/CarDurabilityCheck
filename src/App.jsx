import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Form from "./components/Form";
import Header from "./components/Header";
import ViewData from "./components/ViewData";
import CertificatesPage from "./components/CertificatesPage";

import './index.css';

const App = () => {
  const [userName, setUserName] = useState("اسم المستخدم"); // Temporarily set a default username
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Temporarily set the user as logged in
  const [formType, setFormType] = useState("inquiry"); // Default form type

  useEffect(() => {
    // Function to fetch the username from the API
    const fetchUserName = async () => {
      try {
        const response = await fetch("https://api.example.com/username"); // Replace with your API endpoint
        const data = await response.json();
        setUserName(data.userName); // Adjust according to the structure of your API response
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    };

    fetchUserName();
  }, []);

  const handleLogin = (userName) => {
    setUserName(userName);
    setIsLoggedIn(true);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
        {isLoggedIn ? (
          <>
            <Header userName={userName} setFormType={setFormType} />
            <main className="w-full max-w-4xl p-4">
              <Routes>
                <Route path="/entry" element={<Form formType="entry" setFormType={setFormType} />} />
                <Route path="/inquiry" element={<Form formType="inquiry" setFormType={setFormType} />} />
                <Route path="/view-data" element={<ViewData />} />
                <Route path="/certificates" element={<CertificatesPage />} />
              </Routes>
            </main>
          </>
        ) : (
          <Login onLogin={handleLogin} />
        )}
      </div>
    </Router>
  );
};

export default App;