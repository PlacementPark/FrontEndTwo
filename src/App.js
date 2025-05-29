import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavBar from "./Components/Main/NavBar";
import Login from "./Components/Main/Login";
import ProtectedRoute from "./Components/Main/ProtectedRoute";
import ProfileDashboard from "./Components/Profile/ProfileDashboard";
import AddCandidate from "./Components/Profile/AddCandidate";
import CandidateGrid from "./Components/Profile/CandidateGrid";
import EditCandidate from "./Components/Profile/EditCandidate";
import SearchProfile from "./Components/Profile/SearchProfile";
import AssignCandidate from "./Components/Profile/AssignCandidate";
import AssignCandidateGrid from "./Components/Profile/AssignCandidateGrid";
import PotentialLeads from "./Components/Profile/PotentailLeads";
import CompanyDashboard from "./Components/Company/CompanyDashboard";
import CompanyGrid from "./Components/Company/CompanyGrid";
import AddCompany from "./Components/Company/AddCompany";
import EditEmpanelled from "./Components/Company/EditEmpanelled";
import AddRole from "./Components/Company/AddRole";
import EditRole from "./Components/Company/EditRole";
import AccountDashboard from "./Components/Account/AccountDashboard";
import AddAccount from "./Components/Account/AddAccount";
import EditEmployee from "./Components/Account/EditEmployee";
import AccountGrid from "./Components/Account/AccountGrid";
import Bulkupload from "./Components/Main/BulkUpload";
import ChangePassword from "./Components/Main/ChangePassword";
import AddExtras from "./Components/Main/AddExtra";

function App() {
  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </>
  );
}

function Layout() {
  
  const location = useLocation();
  return (
    <>
      {location.pathname !== "/login" && (
        <ProtectedRoute>
          <NavBar  />
        </ProtectedRoute>
      )}
      <Routes>
        <Route path="/login" element={<Login/>}/>
        {/* Navigation Bar Routes */}
        <Route path="/live" element={<EditRole/>}/>
        <Route path="/" element={<ProfileDashboard/>}/>
        <Route path="/companydashboard" element={<CompanyDashboard />}/>
        <Route path="/accountdashboard" element={<AccountDashboard />}/>
        <Route path="/bulkupload" element={<Bulkupload />} />
        <Route path="/changepassword" element={<ChangePassword />} />
        <Route path="/addextras" element={<AddExtras />} />
        {/* Candidate Routes */}
        <Route path="/addcandidate" element={<AddCandidate/>}/>
        <Route path="/candidategrid" element={<CandidateGrid />}/>
        <Route path="/editcandidate/:id" element={<EditCandidate />}/>
        <Route path="/searchprofile" element={<SearchProfile />} />
        <Route path="/assigncandidate" element={<AssignCandidate />}/>
        <Route path="/assigncandidategrid" element={<AssignCandidateGrid/>}/>
        <Route path="/potentialleads" element={<PotentialLeads />}/>
        {/* Company Routes */}
        <Route path="/companygrid" element={<CompanyGrid />} />
        <Route path="/addcompany" element={<AddCompany />} />
        <Route path="/editempanelled/:id" element={<EditEmpanelled/>} />
        <Route path="/addrole/:id" element={<AddRole />} />
        <Route path="/editrole/:companyId/:id" element={<EditRole />} />
        {/* Account Routes */}
        <Route path="/addaccount" element={<AddAccount />} />
        <Route path="/accountgrid" element={<AccountGrid />} />
        <Route path="/editemployee/:id" element={<EditEmployee />} />
      </Routes>
    </>
  );
}

export default App;
