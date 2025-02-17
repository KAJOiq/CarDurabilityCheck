import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Form from "./components/Form";
import Header from "./components/Header";
import ViewData from "./components/ViewData";
import CertificatesPage from "./components/CertificatesPage";
import ShowUsers from "./components/ShowUsers";
import AddUsers from "./components/AddUsers";
import DeleteUsers from "./components/DeleteUsers";
import Login from "./components/Login";
import ReportStatus from "./components/Reports";
import CreateForm from "./components/CreateForm";
import ChangePassword from "./components/ChangePassword";
import DropDownListPage from "./components/DropDownListPage";
import "./index.css";

const App = () => {
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "");
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("accessToken"));
  const role = localStorage.getItem("role");

  const handleLogin = (userName) => {
    setUserName(userName);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    setIsLoggedIn(false);
  };

  const renderRoutes = () => {
    switch (role) {
      case "admin":
        return (
          <Routes>
            <Route path="/entry" element={<Form formType="entry" />} />
            <Route path="/view-data" element={<ViewData />} />
            <Route path="/certificates" element={<CertificatesPage />} />
            <Route path="/users" element={<ShowUsers />} />
            <Route path="/add-user" element={<AddUsers />} />
            <Route path="/delete-user" element={<DeleteUsers />} />
            <Route path="/reports" element={<ReportStatus />} />
            <Route path="/create-form" element={<CreateForm />} />
            <Route path="/change-password" element={<ChangePassword />} /> 
            <Route path="/dropdown-list" element={<DropDownListPage />} />
            <Route path="*" element={<Navigate to="/users" />} />
          </Routes>
        );
      case "user":
        return (
          <Routes>
            <Route path="/entry" element={<Form formType="entry" />} />
            <Route path="/create-form" element={<CreateForm />} />
            <Route path="/change-password" element={<ChangePassword />} /> 
            <Route path="*" element={<Navigate to="/entry" />} />
          </Routes>
        );
      case "reporter":
        return (
          <Routes>
            <Route path="/reports" element={<ReportStatus />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="*" element={<Navigate to="/reports" />} />
          </Routes>
        );
      case "checker":
        return (
          <Routes>
            <Route path="/certificates" element={<CertificatesPage />} />
            <Route path="/change-password" element={<ChangePassword />} /> 
            <Route path="*" element={<Navigate to="/certificates" />} />
          </Routes>
        );
      default:
        return (
          <Routes>
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        );
    }
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col items-center">
        {isLoggedIn ? (
          <>
            <Header userName={userName} role={role} onLogout={handleLogout} />
            <main className="w-full max-w-7xl p-4">{renderRoutes()}</main>
          </>
        ) : (
          <Login onLogin={handleLogin} />
        )}
      </div>
    </Router>
  );
};

export default App;

