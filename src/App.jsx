// src/App.jsx
import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext';

import Navbar from './components/Navbar.component'
import Home from "./pages/Home.page";
import PrivacyPolicy from "./pages/PrivacyPolicy.page";
import HelpCenter from "./pages/HelpCenter.page";
import Dashboard from './pages/Dashboard.page';
import Footer from './components/Footer.component'

import ProtectedRoute from './components/ProtectedRoute.component';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/help-center" element={<HelpCenter />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          /> */}
          <Route path="*" element={<h1>404 - Page Not Found</h1>} />
        </Routes>

        <Footer />
      </Router>
    </AuthProvider>
  )
}

export default App