import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Header from "./components/Header";
import CertificatesPage from "./components/CertifyAppForms/CertificatesPage";
import ShowUsers from "./components/UserSettingsComponent/ShowUsers";
import AddUsers from "./components/UserSettingsComponent/AddUsers";
import DisableUsers from "./components/UserSettingsComponent/DisableUsers";
import Login from "./components/Login";
import ReportStatus from "./components/ReportComponent/Reports";
import CreateForm from "./components/CreateAndUpdateForms/CreateForm";
import ChangePassword from "./components/ChangePassword";
import DropDownListPage from "./components/DropdownList/DropDownListPage";
import AddVehiclePopup from "./components/DropdownList/AddVehiclePopup";
import AddColorPopup from "./components/DropdownList/AddColorPopup";
import AddAgencyPopup from "./components/DropdownList/AddAgencyPopup";
import AddLocationPopup from "./components/DropdownList/AddLocationPopup";
import "./index.css";
import ShowForms from "./components/FormComponent/ShowForms";
import CreateFormVersion from "./components/CreateAndUpdateForms/CreateFormVersion";
import EnableUsers from "./components/UserSettingsComponent/EnableUsers";
import UpdateUsers from "./components/UserSettingsComponent/UpdateUsers";
import UpdateUsersBysuperadmin from "./components/UserSettingsComponent/UpdateUsersBysuperadmin";
import ShowFormsForPrinter from "./components/FormComponent/SearchModalForPrint";
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
      case "superadmin":
        return (
          <Routes>
            <Route path="/forms" element={<ShowForms/>}/>
            <Route path="/certificates" element={<CertificatesPage />} />
            <Route path="/users" element={<ShowUsers />} />
            <Route path="/add-user" element={<AddUsers />} />
            <Route path="update-user/:userId" element={<UpdateUsersBysuperadmin />} />
            <Route path="/disable-user" element={<DisableUsers />} />
            <Route path="/enable-user" element={<EnableUsers />} />
            <Route path="/change-password" element={<ChangePassword />} /> 
            <Route path="/dropdown-list" element={<DropDownListPage />} />
            <Route path="/add-vehicle" element={<AddVehiclePopup/>} />
            <Route path="/add-color" element={<AddColorPopup/>} />
            <Route path="/add-agency" element={<AddAgencyPopup/>} />
            <Route path="/add-location" element={<AddLocationPopup/>} />
            <Route path="/reports" element={<ReportStatus />} />
            <Route path="*" element={<Navigate to="/users" />} />
          </Routes>
        );
      case "admin":
        return (
          <Routes>
            <Route path="/forms" element={<ShowForms/>}/>
            <Route path="/certificates" element={<CertificatesPage />} />
            <Route path="/users" element={<ShowUsers />} />
            <Route path="update-user/:userId" element={<UpdateUsers />} />
            <Route path="/disable-user" element={<DisableUsers />} />
            <Route path="/reports" element={<ReportStatus />} />
            <Route path="/create-form" element={<CreateForm />} />
            <Route path="/change-password" element={<ChangePassword />} /> 
            <Route path="*" element={<Navigate to="/users" />} />
          </Routes>
        );
      case "user":
        return (
          <Routes>
            <Route path="/forms" element={<ShowForms/>}/>
            <Route path="/create-form" element={<CreateForm />} />
            <Route path="/create-form-version" element={<CreateFormVersion />} />
            <Route path="/change-password" element={<ChangePassword />} /> 
            <Route path="*" element={<Navigate to="/forms" />} />
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
      case "printer":
        return (
          <Routes>
            <Route path="/print-app" element={<ShowFormsForPrinter/>}/>
            <Route path="/change-password" element={<ChangePassword />} /> 
            <Route path="*" element={<Navigate to="/print-app" />} />
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

