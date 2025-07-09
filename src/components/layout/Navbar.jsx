import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { IoMdLogOut } from "react-icons/io";
import { FaUserCircle, FaTachometerAlt, FaHome } from 'react-icons/fa';
import { USER_ROLES } from '../../constants/roles';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = () => {
    onLogout();
    navigate('/login');
    setMenuOpen(false);
  };

  const handleDashboard = () => {
    navigate(user?.role === USER_ROLES.ADMIN ? '/admin' : '/dashboard');
    setMenuOpen(false);
  };

  // Close menu when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/30 backdrop-blur-sm text-black shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-green-600 text-xl font-bold hover:text-green-800 flex items-center gap-2">
          <FaHome />
        </Link>

        <nav className="flex items-center gap-6">
          {user && (
            <div className="relative" ref={menuRef}>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">
                  {user.name || 'User'} ({user.role})
                </span>

                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="hover:text-gray-700 cursor-pointer"
                >
                  <FaUserCircle className="text-2xl text-green-700" />
                </button>
              </div>

              {menuOpen && (
                <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-md w-40 z-50">
                  <button
                    onClick={handleDashboard}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 w-full text-left"
                  >
                    <FaTachometerAlt />
                    Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center text-red-600 gap-2 px-4 py-2 hover:bg-gray-100 w-full text-left"
                  >
                    <IoMdLogOut />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
