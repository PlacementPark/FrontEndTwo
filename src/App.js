import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// MUI imports
import { ThemeProvider, createTheme, CssBaseline, responsiveFontSizes } from "@mui/material";

// Google Fonts via @fontsource
import "@fontsource/poppins"; 
import "@fontsource/poppins/600.css"; 
import "@fontsource/poppins/700.css"; 
import "@fontsource/inter"; 
import "@fontsource/inter/500.css"; 

// Components
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
import UnderDevelopment from "./Components/Main/UnderDevelopment";
import InstitueDashboard from "./Components/Institiue/InstitueDashboard";
import AdminDashboard from "./Components/Admin/AdminDashboard";
import DailyGrid from "./Components/Admin/DailyGrid";
import MonthlyGrid from "./Components/Admin/MonthlyGrid";
import PieChart from "./Components/Admin/PieChart";
import BusinessGrid from "./Components/Admin/BusinessGrid";
import PortalUpdates from "./Components/Admin/PortalUpdates";
import CompanyContributionP1 from "./Components/Admin/CompanyContributionP1";
import AddInstitiue from "./Components/Institiue/AddInstitiue";
import SearchCompany from "./Components/Company/SearchCompany";
import SearchAccount from "./Components/Account/SearchAccount";

// Create MUI theme with fonts + responsive typography
let theme = createTheme({
  typography: {
    fontFamily: ["Inter", "Poppins", "sans-serif"].join(","),
    h1: { fontFamily: "Poppins, sans-serif" },
    h2: { fontFamily: "Poppins, sans-serif" },
    h3: { fontFamily: "Poppins, sans-serif" },
    h4: { fontFamily: "Poppins, sans-serif" },
    h5: { fontFamily: "Poppins, sans-serif" },
    h6: { fontFamily: "Poppins, sans-serif" },
    body1: { fontFamily: "Inter, sans-serif" },
    body2: { fontFamily: "Inter, sans-serif" },
  },
  palette: {
    mode: "light",
    primary: { main: "rgb(0, 204, 255)" },
    secondary: { main: "#f48fb1" },
  },
});

// Make typography scale across devices
theme = responsiveFontSizes(theme);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastContainer />
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </ThemeProvider>
  );
}

function Layout() {
  const location = useLocation();

  return (
     <>
        {location.pathname !== "/login" && (
           <ProtectedRoute>
              <NavBar />
           </ProtectedRoute>
        )}
        <Routes>
           <Route path="/login" element={<Login />} />
           {/* Navigation Bar Routes */}
           <Route path="/live" element={<EditRole />} />
           <Route path="/" element={<ProfileDashboard />} />
           <Route path="/companydashboard" element={<CompanyDashboard />} />
           <Route path="/accountdashboard" element={<AccountDashboard />} />
           <Route path="/bulkupload" element={<Bulkupload />} />
           <Route path="/changepassword" element={<ChangePassword />} />
           <Route path="/addextras" element={<AddExtras />} />
           <Route path="/underdevelopment" element={<UnderDevelopment />} />

           {/* Candidate Routes */}
           <Route path="/addcandidate" element={<AddCandidate />} />
           <Route path="/candidategrid" element={<CandidateGrid />} />
           <Route path="/editcandidate/:id" element={<EditCandidate />} />
           <Route path="/searchprofile" element={<SearchProfile />} />
           <Route path="/assigncandidate" element={<AssignCandidate />} />
           <Route
              path="/assigncandidategrid"
              element={<AssignCandidateGrid />}
           />
           <Route path="/potentialleads" element={<PotentialLeads />} />

           {/* Company Routes */}
           <Route path="/companygrid" element={<CompanyGrid />} />
           <Route path="/searchcompany" element={<SearchCompany />} />
           <Route path="/addcompany" element={<AddCompany />} />
           <Route path="/editempanelled/:id" element={<EditEmpanelled />} />
           <Route path="/addrole/:id" element={<AddRole />} />
           <Route path="/editrole/:companyId/:id" element={<EditRole />} />

           {/* Institue Routes */}
           <Route path="/institutedashboard" element={<InstitueDashboard />} />
           <Route path="/addinstitute" element={<AddInstitiue />} />

           {/* Account Routes */}
           <Route path="/addaccount" element={<AddAccount />} />
           <Route path="/searchaccount" element={<SearchAccount />} />
           <Route path="/accountgrid" element={<AccountGrid />} />
           <Route path="/editemployee/:id" element={<EditEmployee />} />

           {/* AdminDashboard Routes */}
           <Route path="/admindashboard" element={<AdminDashboard />} />
           <Route path="/dailygrid" element={<DailyGrid />} />
           <Route path="/monthlygrid" element={<MonthlyGrid />} />
           <Route path="/piechart" element={<PieChart />} />
           <Route path="/businessgrid" element={<BusinessGrid />} />
           <Route path="/portalupdates" element={<PortalUpdates />} />
           <Route path="/contributionp1" element={<CompanyContributionP1 />} />
        </Routes>
     </>
  );
}

export default App;
