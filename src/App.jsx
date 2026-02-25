// src/App.jsx
import './App.css'
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from './contexts/AuthContext';

import Navbar from './components/Navbar.component'
import Navbar2 from './components/Navbar2.component'
import Home from "./pages/Home.page";
import PrivacyPolicy from "./pages/PrivacyPolicy.page";
import HelpCenter from "./pages/HelpCenter.page";
import Dashboard from './pages/Dashboard.page';
import Contributions from './pages/Contributions.page';
import Footer from './components/Footer.component'
import ProtectedRoute from './components/ProtectedRoute.component';

/**
 * Picks which navbar to render:
 * - Always show the public Navbar on the home "/" route
 * - Show Navbar2 (logged-in nav) on all other routes when authenticated
 * - Show public Navbar everywhere else when not authenticated
 */
function NavbarSwitch() {
  const { currentUser } = useAuth();
  const location = useLocation();

  const isHomePage = location.pathname === "/";

  if (isHomePage || !currentUser) {
    return <Navbar />;
  }

  return <Navbar2 />;
}

function AppLayout() {
  return (
    <>
      <NavbarSwitch />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/help-center" element={<HelpCenter />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/contributions" element={<Contributions />} />
        {/* <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
              <Contributions />
            </ProtectedRoute>
          }
        /> */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>

      <Footer />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppLayout />
      </Router>
    </AuthProvider>
  );
}

export default App;