import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Form from "./components/Form";
import Header from "./components/Header";
import ViewData from "./components/ViewData";
import CertificatesPage from "./components/CertificatesPage";
import FetchUsers from "./components/FetchUsers";
import Login from "./components/Login";
import ReportStatus from "./components/Reports";
import SearchModal from "./components/SearchModalForPrint";
import CreateForm from "./components/CreateForm";
import './index.css';

const App = () => {
  const [userName, setUserName] = useState(""); 
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [formType, setFormType] = useState("entry"); 
  

  const handleLogin = (userName) => {
    setUserName(userName);
    setIsLoggedIn(true);
  };

  const handleSearch = (searchTerm) => {
    console.log("Searching for:", searchTerm);
    setIsSearchOpen(true);
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
                <Route path="/view-data" element={<ViewData />} />
                <Route path="/certificates" element={<CertificatesPage />} />
                <Route path="/users" element={<FetchUsers />} />
                <Route path="/reports" element={<ReportStatus />} />
                <Route path="/create-form" element={<CreateForm />} />
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
