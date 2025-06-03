import React from 'react';
import { FiBook, FiHome, FiDollarSign, FiKey, FiTag, FiUsers } from 'react-icons/fi';

const Navigation = ({ currentScreen, setCurrentScreen }) => {
    const screens = [
        { id: 'overview', label: 'Overview', icon: <FiHome /> },
        { id: 'profile', label: 'Users', icon: <FiUsers /> },
        { id: 'revenue', label: 'Revenue', icon: <FiDollarSign /> },
        { id: 'bookings', label: 'Bookings', icon: <FiBook /> },
        { id: 'hotels', label: 'Hotels', icon: <FiHome /> },
        // { id: 'rooms', label: 'Rooms', icon: <FiKey /> },
        { id: 'coupons', label: 'Coupons', icon: <FiTag /> },
    ];

    return (
        <nav className="bg-green-400 text-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 overflow-x-auto">
                <div className="flex space-x-2">
                    {screens.map(screen => (
                        <button
                            key={screen.id}
                            onClick={() => setCurrentScreen(screen.id)}
                            className={`flex items-center px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${
                                currentScreen === screen.id
                                    ? 'bg-green-700 text-white shadow-lg'
                                    : 'text-black hover:bg-green-700 hover:text-white'
                            }`}
                        >
                            {screen.icon}
                            <span className="ml-2">{screen.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default Navigation;