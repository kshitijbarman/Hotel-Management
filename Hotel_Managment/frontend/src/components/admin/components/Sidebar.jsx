 
import React from "react";
import { FaMapMarkerAlt, FaCity, FaHotel, FaSignOutAlt, FaBed, FaCalendarCheck, FaUserAlt, FaEye, FaTicketAlt } from "react-icons/fa";

const Sidebar = ({ sidebarTab, setSidebarTab, handleLogout }) => {
    return (
        <div className="w-64 bg-slate-950 text-white flex flex-col shadow-lg">
            <div className="p-6 border-b border-slate-800">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <FaUserAlt className="text-blue-400" /> Admin Panel
                </h1>
            </div>
            <nav className="flex-1">
                <ul className="space-y-2 p-4">
                    {[
                        { tab: "states", icon: <FaMapMarkerAlt />, label: "States" },
                        { tab: "cities", icon: <FaCity />, label: "Cities" },
                        { tab: "hotels", icon: <FaHotel />, label: "Hotels" },
                        { tab: "rooms", icon: <FaBed />, label: "Rooms" },
                        { tab: "bookings", icon: <FaCalendarCheck />, label: "Bookings" },
                        { tab: "coupons", icon: <FaTicketAlt />, label: "Coupons" },
                        { tab: "view", icon: <FaEye />, label: "View" },
                        { tab: "dash", icon: <FaEye />, label: "dash" },
                    ].map(({ tab, icon, label }) => (
                        <li key={tab}>
                            <button
                                onClick={() => setSidebarTab(tab)}
                                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                                    sidebarTab === tab ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-slate-800"
                                }`}
                            >
                                {icon} {label}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 p-3 rounded-lg bg-red-600 hover:bg-red-700 transition-all duration-200"
                >
                    <FaSignOutAlt /> Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;