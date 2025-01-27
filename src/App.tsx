import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import SocialPostCards from './components/SocialCards';
import Login from './components/LoginSupabase';
import { FaBars, FaTimes } from 'react-icons/fa';
import DashboardPage from './components/Dashboardv2'; // Adjust the import path
import AdminPanel from './components/AdminPanel'; // Aggiungi questa importazione
import { useAuth } from './contexts/AuthContext'; // Aggiungi questo import
import { ThemeProvider } from './contexts/ThemeContext';
import { ThemeToggle } from './components/ThemeToggle';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    // Check localStorage for logged-in state
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const { user } = useAuth(); // Aggiungi questo hook

  // Handle successful login
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
  };

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    if (isLoggedIn) {
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-background font-poppins relative">
          {/* Menu fisso con informazioni utente */}
          {isLoggedIn && (
            <div className="sticky top-0 z-40 bg-card text-card-foreground p-4 flex items-center">
              <button onClick={toggleSidebar} className="text-lg font-bold">
                {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </button>
              
              {/* Aggiungi le informazioni dell'utente */}
              <div className="ml-4 flex items-center">
                <span className="text-sm mr-2">
                  Logged in as: {user?.email || 'Unknown User'}
                </span>
              </div>

              <div className="ml-auto flex items-center gap-4">
                <ThemeToggle />
                <button onClick={handleLogout} className="text-lg font-bold">
                  Logout
                </button>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex flex-1">
            {/* Sidebar con z-index più alto */}
            {isLoggedIn && (
              <div
                className={`w-64 bg-card text-card-foreground p-4 transform transition-transform duration-300 fixed top-0 left-0 h-full z-[9999] ${
                  isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
              >
                <div className="flex justify-between items-center mb-4 pt-4">
                  <h2 className="text-2xl font-semibold">Sidebar</h2>
                  <button onClick={toggleSidebar} className="text-lg font-bold">
                    <FaTimes size={24} />
                  </button>
                </div>

                <ul>
                  <li className="mb-2">
                    <Link to="/dashboard" onClick={toggleSidebar}>
                      Dashboard
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link to="/all-videos" onClick={toggleSidebar}>
                      All Videos
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link to="/admin" onClick={toggleSidebar}>
                      Admin Panel
                    </Link>
                  </li>
                </ul>
              </div>
            )}

            {/* Main Panel */}
            <div className="flex-1 flex items-center justify-center transition-all duration-300">
              {!isLoggedIn ? (
                <Login onLoginSuccess={handleLoginSuccess} />
              ) : (
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/all-videos" element={<SocialPostCards />} />
                  <Route path="/admin" element={<AdminPanel />} />
                </Routes>
              )}
            </div>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
