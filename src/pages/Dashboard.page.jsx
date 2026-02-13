import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          
          {/* User Info */}
          <div className="flex items-center gap-4 mb-6">
            {currentUser?.photoURL && (
              <img 
                src={currentUser.photoURL} 
                alt="Profile" 
                className="w-16 h-16 rounded-full"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome, {currentUser?.displayName || "User"}!
              </h1>
              <p className="text-gray-600">{currentUser?.email}</p>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Your Flood Reports</h2>
            <p className="text-gray-600 mb-6">
              Upload your flood photos and videos here...
            </p>
            
            {/* Add your upload form, map, etc here */}
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="mt-6 px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;