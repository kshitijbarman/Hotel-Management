import React from 'react';
import { FiLogOut, FiMoon, FiSun } from 'react-icons/fi';

const Header = ({ user, isDarkMode, toggleMode, handleLogout, handleBack }) => (


    <header className="bg-white shadow-xl">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
    <h1 className="text-2xl font-extrabold text-black tracking-tight"> Dashboard</h1>
    <div className="flex items-center space-x-4">
      {/* <button
        onClick={toggleMode}
        className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-200"
      >
        {isDarkMode ? (
          <FiSun size={20} className="text-yellow-500" />
        ) : (
          <FiMoon size={20} className="text-black" />
        )}
      </button> */}
      <span className="text-black font-medium">{user.firstname || 'User'}</span>
      
      <button
        onClick={handleBack}
        className="flex items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-all duration-200 shadow-md hover:shadow-lg"
      >
        {/* <FiLogOut className="mr-2" /> */}
        Back to Admin Panel
      </button>

      <button
        onClick={handleLogout}
        className="flex items-center  bg-red-600 text-white px-4 py-2 rounded-2xl hover:bg-red-700 transition-all duration-200 shadow-md hover:shadow-lg"
      >
        {/* <FiLogOut className="mr-2" /> */}
        Logout
      </button>
    </div>
  </div>
</header>

);

export default Header;