import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AlertCircle, Menu, X, Chrome, Apple } from "lucide-react";
import { Button } from "./UI.component";

// 🔥 IMPORT FIREBASE STUFF
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, appleProvider } from "../firebase";
import { useAuth } from "../contexts/AuthContext";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false); // Loading state
  const [loginError, setLoginError] = useState(""); // Error state
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // 🔥 GET CURRENT USER FROM CONTEXT
  const { currentUser } = useAuth();

  const handleSectionClick = (sectionId) => {
    setIsOpen(false);
    if (location.pathname === "/") {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate("/", { state: { scrollTo: sectionId } });
    }
  };

  const handleTryOnWeb = () => {
    setIsOpen(false);
    
    // 🔥 IF ALREADY LOGGED IN, GO STRAIGHT TO DASHBOARD
    if (currentUser) {
      navigate("/dashboard");
    } else {
      setShowLoginPopup(true);
    }
  };

  // 🔥 GOOGLE LOGIN FUNCTION
  const handleGoogleLogin = async () => {
    setLoginLoading(true);
    setLoginError("");
    
    try {
      // Open Google popup and sign in
      const result = await signInWithPopup(auth, googleProvider);
      
      // User object with email, name, photo, etc.
      const user = result.user;
      
      console.log("✅ Logged in:", user.displayName, user.email);
      
      // Close popup
      setShowLoginPopup(false);
      
      // Navigate to dashboard
      navigate("/dashboard");
      
    } catch (error) {
      console.error("❌ Login error:", error);
      
      // Show user-friendly error
      if (error.code === "auth/popup-closed-by-user") {
        setLoginError("Login cancelled");
      } else if (error.code === "auth/popup-blocked") {
        setLoginError("Please allow popups for this site");
      } else {
        setLoginError("Login failed. Please try again.");
      }
    } finally {
      setLoginLoading(false);
    }
  };

  // 🔥 APPLE LOGIN FUNCTION
  const handleAppleLogin = async () => {
    setLoginLoading(true);
    setLoginError("");
    
    try {
      const result = await signInWithPopup(auth, appleProvider);
      const user = result.user;
      
      console.log("✅ Logged in with Apple:", user.email);
      
      setShowLoginPopup(false);
      navigate("/dashboard");
      
    } catch (error) {
      console.error("❌ Apple login error:", error);
      
      if (error.code === "auth/popup-closed-by-user") {
        setLoginError("Login cancelled");
      } else {
        setLoginError("Apple login failed. Try Google instead.");
      }
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-11 h-11 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                SnapFlood
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <button
                onClick={() => handleSectionClick("mission")}
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
              >
                Mission
              </button>

              <button
                onClick={() => handleSectionClick("features")}
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
              >
                Features
              </button>

              <button
                onClick={() => handleSectionClick("how-it-works")}
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
              >
                How It Works
              </button>

              <Link
                to="/help-center"
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
              >
                Help Center
              </Link>

              <Button 
                variant="primary" 
                className="px-5 py-2"
                onClick={handleTryOnWeb}
              >
                {/* 🔥 SHOW DIFFERENT TEXT IF LOGGED IN */}
                {currentUser ? "Go to Dashboard" : "Try on web"}
              </Button>
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div className="md:hidden py-4 border-t">
              <div className="flex flex-col gap-4">

                <button
                  onClick={() => handleSectionClick("mission")}
                  className="text-left text-gray-700 hover:text-primary-600 font-medium transition-colors"
                >
                  Mission
                </button>

                <button
                  onClick={() => handleSectionClick("features")}
                  className="text-left text-gray-700 hover:text-primary-600 font-medium transition-colors"
                >
                  Features
                </button>

                <button
                  onClick={() => handleSectionClick("how-it-works")}
                  className="text-left text-gray-700 hover:text-primary-600 font-medium transition-colors"
                >
                  How It Works
                </button>

                <Link
                  to="/help-center"
                  onClick={() => setIsOpen(false)}
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                >
                  Help Center
                </Link>

                <Button 
                  variant="primary" 
                  className="px-5 py-2"
                  onClick={handleTryOnWeb}
                >
                  {currentUser ? "Go to Dashboard" : "Try on web"}
                </Button>

              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Login Popup */}
      {showLoginPopup && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300"
            onClick={() => setShowLoginPopup(false)}
          ></div>

          {/* Popup Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div 
              className="bg-gradient-to-br from-primary-50 via-white to-blue-50 rounded-2xl shadow-2xl w-full max-w-md pointer-events-auto transform transition-all duration-300 ease-out animate-slide-up relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Wave Pattern Background */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <svg className="absolute -bottom-10 left-[-5%] w-[115%] h-48 animate-wave-slow" viewBox="0 0 1440 320" preserveAspectRatio="none">
                  <path fill="rgba(59, 130, 246, 0.15)" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,170.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                </svg>
                
                <svg className="absolute -bottom-9 left-[-5%] w-[115%] h-48 animate-wave-medium" viewBox="0 0 1440 320" preserveAspectRatio="none">
                  <path fill="rgba(14, 165, 233, 0.12)" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                </svg>

                <div className="absolute top-12 left-16 w-2 h-2 bg-blue-400/20 rounded-full animate-float-slow"></div>
                <div className="absolute top-20 right-24 w-1.5 h-1.5 bg-cyan-400/25 rounded-full animate-float-medium"></div>
                <div className="absolute bottom-32 left-20 w-3 h-3 bg-sky-300/15 rounded-full animate-float-fast"></div>
                <div className="absolute bottom-40 right-16 w-2 h-2 bg-blue-300/20 rounded-full animate-float-slow"></div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setShowLoginPopup(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-100/80 transition-colors z-10"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>

              {/* Content */}
              <div className="relative px-8 py-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-3 text-center">
                  Snap the Flood!
                </h2>
                <p className="text-sm text-gray-700 leading-relaxed mb-6 text-center">
                  Capture/upload a photo or video of the flood, including a visible landmark, people or objects for context. Then, add details about the rainfall and flood conditions, along with any relevant remarks.
                </p>

                {/* 🔥 ERROR MESSAGE */}
                {loginError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600 text-center">{loginError}</p>
                  </div>
                )}

                {/* Login Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleGoogleLogin}
                    disabled={loginLoading}
                    className="w-full flex items-center justify-center gap-2.5 bg-white/90 backdrop-blur-sm hover:bg-white border border-blue-200 hover:border-blue-300 text-gray-800 font-medium px-5 py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Chrome className="w-4 h-4 text-blue-600" />
                    {loginLoading ? "Logging in..." : "Login with Google"}
                  </button>

                  <button
                    onClick={handleAppleLogin}
                    disabled={loginLoading}
                    className="w-full flex items-center justify-center gap-2.5 bg-gray-800/90 backdrop-blur-sm hover:bg-gray-900 text-white font-medium px-5 py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Apple className="w-4 h-4" />
                    {loginLoading ? "Logging in..." : "Login with Apple"}
                  </button>
                </div>

                <p className="text-center text-xs text-gray-600 mt-5">
                  By continuing, you agree to our{" "}
                  <Link to="/privacy-policy" className="text-blue-600 hover:text-blue-700 font-medium">
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes wave-slow {
          0%, 100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(-25px);
          }
        }

        @keyframes wave-medium {
          0%, 100% {
            transform: translateX(-15px);
          }
          50% {
            transform: translateX(0);
          }
        }

        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.4;
          }
        }

        @keyframes float-medium {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.25;
          }
          50% {
            transform: translateY(-15px) translateX(-8px);
            opacity: 0.5;
          }
        }

        @keyframes float-fast {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.15;
          }
          50% {
            transform: translateY(-25px) translateX(15px);
            opacity: 0.35;
          }
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }

        .animate-wave-slow {
          animation: wave-slow 6s ease-in-out infinite;
        }

        .animate-wave-medium {
          animation: wave-medium 4s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: float-slow 5s ease-in-out infinite;
        }

        .animate-float-medium {
          animation: float-medium 4s ease-in-out infinite;
        }

        .animate-float-fast {
          animation: float-fast 3.5s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}

export default Navbar;