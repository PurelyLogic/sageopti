import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "@/pages/LandingPage";
import Dashboard from "@/pages/Dashboard";
import AuditPage from "@/pages/AuditPage";
import ReportPage from "@/pages/ReportPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/audit" element={<AuditPage />} />
          <Route path="/report/:id" element={<ReportPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;