import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />               {/* Login Page */}
        <Route path="/signup" element={<Signup />} />       {/* Signup Page */}
        <Route path="/dashboard" element={<Dashboard />} /> {/* User Dashboard */}
        <Route path="/admin" element={<Admin />} />         {/* Admin Dashboard */}
      </Routes>
    </Router>
  </React.StrictMode>
);
