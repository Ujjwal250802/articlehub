import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Users, FolderOpen, FileText, HelpCircle, LogOut, Palette, Menu } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const { logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  return (
    <>
      {/* Top Header */}
      <div className="fixed top-0 left-0 right-0 bg-indigo-700 text-white h-14 flex items-center justify-between px-4 z-50">
        <div className="flex items-center">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-indigo-600 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold ml-4">Article Hub</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative group">
            <button className="p-2 hover:bg-indigo-600 rounded-lg">
              <Palette className="w-6 h-6" />
            </button>
            <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg p-2 hidden group-hover:block">
              <div className="flex space-x-2">
                <button
                  onClick={() => setTheme('blue')}
                  className="w-8 h-8 rounded-full bg-blue-600"
                />
                <button
                  onClick={() => setTheme('pink')}
                  className="w-8 h-8 rounded-full bg-pink-500"
                />
                <button
                  onClick={() => setTheme('red')}
                  className="w-8 h-8 rounded-full bg-red-500"
                />
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="p-2 hover:bg-indigo-600 rounded-lg"
          >
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside 
        className={`fixed top-14 left-0 h-[calc(100vh-3.5rem)] bg-gray-100 transition-all duration-300 ${
          isCollapsed ? 'w-0 overflow-hidden' : 'w-64'
        } shadow-lg z-40`}
      >
        <div className="flex flex-col h-full">
          <div className={`p-6 text-center ${isCollapsed ? 'hidden' : ''}`}>
          <div className="w-20 h-20 mx-auto bg-gray-300 rounded-full mb-4 flex items-center justify-center">
          <span className="text-6xl font-bold text-gray-800 font-serif">A</span>
          </div>
          <h2 className="text-lg font-semibold mb-2">Article Hub</h2>
          </div>

          <div className={`flex-1 ${isCollapsed ? 'hidden' : ''}`}>
            <div className="px-4 py-2 text-sm text-gray-600 uppercase">Menu</div>
            <nav className="space-y-1 px-2">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 text-gray-700 rounded-lg ${
                    isActive ? 'bg-indigo-700 text-white' : 'hover:bg-gray-200'
                  }`
                }
              >
                <Home className="w-5 h-5 mr-3" />
                Dashboard
              </NavLink>
              <NavLink
                to="/users"
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 text-gray-700 rounded-lg ${
                    isActive ? 'bg-indigo-700 text-white' : 'hover:bg-gray-200'
                  }`
                }
              >
                <Users className="w-5 h-5 mr-3" />
                User
              </NavLink>
              <NavLink
                to="/categories"
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 text-gray-700 rounded-lg ${
                    isActive ? 'bg-indigo-700 text-white' : 'hover:bg-gray-200'
                  }`
                }
              >
                <FolderOpen className="w-5 h-5 mr-3" />
                Category
              </NavLink>
              <NavLink
                to="/branch"
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 text-gray-700 rounded-lg ${
                    isActive ? 'bg-indigo-700 text-white' : 'hover:bg-gray-200'
                  }`
                }
              >
                <FolderOpen className="w-5 h-5 mr-3" />
                Branch
              </NavLink>
              <NavLink
                to="/articles"
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 text-gray-700 rounded-lg ${
                    isActive ? 'bg-indigo-700 text-white' : 'hover:bg-gray-200'
                  }`
                }
              >
                <FileText className="w-5 h-5 mr-3" />
                Article
              </NavLink>
            </nav>

            <div className="px-4 py-2 mt-6 text-sm text-gray-600 uppercase">Support</div>
            <nav className="space-y-1 px-2">
              <NavLink
                to="/help"
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 text-gray-700 rounded-lg ${
                    isActive ? 'bg-indigo-700 text-white' : 'hover:bg-gray-200'
                  }`
                }
              >
                <HelpCircle className="w-5 h-5 mr-3" />
                Help
              </NavLink>
            </nav>
          </div>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Are you sure you want to Logout?</h2>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50"
              >
                No
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;