import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  AlertCircle,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  ImagePlay,
  Bell,
  ChevronDown,
  AlertTriangle,
  Info,
  Zap,
  HelpCircle,
  ListChecks,
} from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../contexts/AuthContext";

function Navbar2() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showKnowMore, setShowKnowMore] = useState(false);
  const [mobileKnowMoreOpen, setMobileKnowMoreOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();

  const knowMoreRef = useRef(null);

  // Close Know More dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (knowMoreRef.current && !knowMoreRef.current.contains(e.target)) {
        setShowKnowMore(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navLinks = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      label: "My Contributions",
      path: "/contributions",
      icon: <ImagePlay className="w-4 h-4" />,
    },
  ];

  const knowMoreItems = [
    {
      label: "Mission",
      sectionId: "mission",
      icon: <Info className="w-4 h-4 text-primary-500" />,
    },
    {
      label: "Features",
      sectionId: "features",
      icon: <Zap className="w-4 h-4 text-primary-500" />,
    },
    {
      label: "How It Works",
      sectionId: "how-it-works",
      icon: <ListChecks className="w-4 h-4 text-primary-500" />,
    },
    {
      label: "Help Center",
      path: "/help-center",
      icon: <HelpCircle className="w-4 h-4 text-primary-500" />,
    },
  ];

  const isActive = (path) => location.pathname === path;

  const handleKnowMoreClick = (item) => {
    setShowKnowMore(false);
    setMobileKnowMoreOpen(false);
    setIsOpen(false);
    if (item.path) {
      navigate(item.path);
    } else if (item.sectionId) {
      if (location.pathname === "/") {
        const el = document.getElementById(item.sectionId);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate("/", { state: { scrollTo: item.sectionId } });
      }
    }
  };

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await signOut(auth);
      setShowLogoutPopup(false);
      navigate("/");
    } catch (error) {
      console.error("❌ Logout error:", error);
    } finally {
      setLogoutLoading(false);
    }
  };

  const photoURL = currentUser?.photoURL || null;
  const displayName = currentUser?.displayName || "User";
  const email = currentUser?.email || "";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-50 border-b border-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">

            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-3">
              <div className="w-11 h-11 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-md">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">SnapFlood</span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                    isActive(link.path)
                      ? "bg-primary-50 text-primary-700"
                      : "text-gray-600 hover:text-primary-600 hover:bg-gray-50"
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}

              {/* Know More Dropdown */}
              <div className="relative" ref={knowMoreRef}>
                <button
                  onClick={() => setShowKnowMore(!showKnowMore)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                    showKnowMore
                      ? "bg-primary-50 text-primary-700"
                      : "text-gray-600 hover:text-primary-600 hover:bg-gray-50"
                  }`}
                >
                  Know More
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      showKnowMore ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showKnowMore && (
                  <div className="absolute left-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-20 animate-dropdown">
                    <div className="p-1.5 flex flex-col gap-0.5">
                      {knowMoreItems.map((item) => (
                        <button
                          key={item.label}
                          onClick={() => handleKnowMoreClick(item)}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors text-left w-full"
                        >
                          {item.icon}
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Right — Bell + Avatar (photo only) */}
            <div className="hidden md:flex items-center gap-3">

              {/* Notification Bell */}
              <button className="relative p-2 rounded-lg text-gray-500 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
              </button>

              {/* Avatar — photo only, no name */}
              <div className="relative">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-1 p-1 rounded-xl border border-gray-200 hover:border-primary-300 bg-white hover:bg-primary-50/40 transition-all duration-200 shadow-sm"
                >
                  {photoURL ? (
                    <img
                      src={photoURL}
                      alt={displayName}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-700 flex items-center justify-center text-white text-xs font-bold">
                      {initials}
                    </div>
                  )}
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-gray-400 mr-0.5 transition-transform duration-200 ${
                      showUserDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showUserDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowUserDropdown(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-20 animate-dropdown">
                      {/* User Info Header */}
                      <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-br from-primary-50 to-blue-50 border-b border-gray-100">
                        {photoURL ? (
                          <img
                            src={photoURL}
                            alt={displayName}
                            referrerPolicy="no-referrer"
                            className="w-9 h-9 rounded-lg object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-400 to-primary-700 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                            {initials}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">
                            {displayName}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{email}</p>
                        </div>
                      </div>

                      {/* Logout only — no Profile option */}
                      <div className="p-1.5">
                        <button
                          onClick={() => {
                            setShowUserDropdown(false);
                            setShowLogoutPopup(true);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div className="md:hidden py-4 border-t border-gray-100">

              {/* Mobile User Info */}
              <div className="flex items-center gap-3 px-1 pb-4 mb-2 border-b border-gray-100">
                {photoURL ? (
                  <img
                    src={photoURL}
                    alt={displayName}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-700 flex items-center justify-center text-white text-sm font-bold">
                    {initials}
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-gray-800">{displayName}</p>
                  <p className="text-xs text-gray-500 truncate max-w-[200px]">{email}</p>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive(link.path)
                        ? "bg-primary-50 text-primary-700"
                        : "text-gray-700 hover:bg-gray-50 hover:text-primary-600"
                    }`}
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                ))}

                {/* Know More — mobile expandable */}
                <div>
                  <button
                    onClick={() => setMobileKnowMoreOpen(!mobileKnowMoreOpen)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors"
                  >
                    <span>Know More</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        mobileKnowMoreOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {mobileKnowMoreOpen && (
                    <div className="mt-1 ml-3 flex flex-col gap-0.5">
                      {knowMoreItems.map((item) => (
                        <button
                          key={item.label}
                          onClick={() => handleKnowMoreClick(item)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-primary-50 hover:text-primary-700 transition-colors text-left w-full"
                        >
                          {item.icon}
                          {item.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Mobile Logout */}
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setShowLogoutPopup(true);
                  }}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors mt-1"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* ── Logout Confirmation Popup ── */}
      {showLogoutPopup && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={() => !logoutLoading && setShowLogoutPopup(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm pointer-events-auto animate-slide-up overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-1.5 w-full bg-gradient-to-r from-red-400 via-red-500 to-orange-400" />
              <div className="px-7 py-7">
                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
                    <AlertTriangle className="w-7 h-7 text-red-500" />
                  </div>
                </div>
                <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
                  Logging out?
                </h2>
                <p className="text-sm text-gray-500 text-center mb-7 leading-relaxed">
                  You'll be signed out of your SnapFlood account. Any unsaved flood
                  reports will be lost.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowLogoutPopup(false)}
                    disabled={logoutLoading}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLogout}
                    disabled={logoutLoading}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium text-sm transition-colors shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {logoutLoading ? (
                      <>
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Logging out…
                      </>
                    ) : (
                      <>
                        <LogOut className="w-4 h-4" />
                        Yes, Logout
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(16px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes dropdown {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-slide-up { animation: slide-up 0.25s cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-dropdown { animation: dropdown 0.2s  cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </>
  );
}

export default Navbar2;