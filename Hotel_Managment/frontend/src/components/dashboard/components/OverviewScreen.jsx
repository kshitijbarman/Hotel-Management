
import React from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { FiBook, FiHome, FiMap, FiTag, FiUsers, FiDollarSign } from 'react-icons/fi';

const OverviewScreen = ({ overviewStats, overviewLoading, overviewError, isDarkMode, fetchStats, totalUsers, totalRevenue, setCurrentScreen, recentBookings }) => {
    const overviewChartData = {
        labels: ['Bookings', 'Hotels', 'Locations', 'Coupons', 'Users'],
        datasets: [{
            label: 'Count',
            data: [
                overviewStats.bookings,
                overviewStats.hotels,
                overviewStats.locations,
                overviewStats.coupons,
                totalUsers,
            ],
            backgroundColor: [
                'rgba(99, 102, 241, 0.8)',
                'rgba(34, 197, 94, 0.8)',
                'rgba(234, 179, 8, 0.8)',
                'rgba(168, 85, 247, 0.8)',
                'rgba(255, 99, 132, 0.8)',
            ],
            borderColor: [
                'rgba(99, 102, 241, 1)',
                'rgba(34, 197, 94, 1)',
                'rgba(234, 179, 8, 1)',
                'rgba(168, 85, 247, 1)',
                'rgba(255, 99, 132, 1)',
            ],
            borderWidth: 2,
            borderRadius: 10,
        }],
    };

    const barOptions = {
        maintainAspectRatio: false,
        animation: { duration: 1500, easing: 'easeOutCubic' },
        scales: {
            y: {
                beginAtZero: true,
                title: { display: true, text: 'Count', color: isDarkMode ? '#D1D5DB' : '#4B5563', font: { size: 14, weight: 'bold' } },
                ticks: { color: isDarkMode ? '#D1D5DB' : '#4B5563', font: { size: 12 } },
                grid: { color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' },
            },
            x: {
                ticks: { color: isDarkMode ? '#D1D5DB' : '#4B5563', font: { size: 12 } },
                grid: { display: false },
            },
        },
        plugins: {
            legend: { display: false },
            datalabels: {
                display: true,
                color: isDarkMode ? '#FFFFFF' : '#000000',
                font: { weight: 'bold', size: 12 },
                anchor: 'end',
                align: 'top',
                formatter: (value) => value.toLocaleString(),
            },
            tooltip: {
                backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                titleColor: isDarkMode ? '#FFFFFF' : '#000000',
                bodyColor: isDarkMode ? '#D1D5DB' : '#4B5563',
                borderColor: isDarkMode ? '#4B5563' : '#E5E7EB',
                borderWidth: 1,
                cornerRadius: 8,
                callbacks: {
                    label: (context) => {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        return `${label}: ${value.toLocaleString()}`;
                    },
                },
            },
        },
    };

    const doughnutOptions = {
        maintainAspectRatio: false,
        animation: { duration: 1500, easing: 'easeOutCubic' },
        plugins: {
            legend: {
                position: 'bottom',
                labels: { color: isDarkMode ? '#D1D5DB' : '#4B5563', font: { size: 12 }, padding: 20, boxWidth: 20 },
            },
            datalabels: {
                display: true,
                color: '#FFFFFF',
                font: { weight: 'bold', size: 12 },
                formatter: (value) => value.toLocaleString(),
            },
            tooltip: {
                backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                titleColor: isDarkMode ? '#FFFFFF' : '#000000',
                bodyColor: isDarkMode ? '#D1D5DB' : '#4B5563',
                borderColor: isDarkMode ? '#4B5563' : '#E5E7EB',
                borderWidth: 1,
                cornerRadius: 8,
                callbacks: {
                    label: (context) => {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        return `${label}: ${value.toLocaleString()}`;
                    },
                },
            },
        },
    };

    return (
      
        <section className="space-y-8 max-w-full mx-auto px-6">
  <h2 className="text-4xl font-extrabold text-black mb-8 tracking-tight text-center">
    Overview
  </h2>

  {overviewLoading ? (
    <div className="text-center text-black">Loading...</div>
  ) : overviewError ? (
    <div className="text-center text-red-600">
      {overviewError}
      <button
        onClick={() => fetchStats()}
        className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
      >
        Retry
      </button>
    </div>
  ) : (
    <div className="flex flex-col lg:flex-row gap-10">
      {/* Left Side: Recent Bookings */}
      <div className="lg:w-1/3 bg-white rounded-2xl shadow-lg p-6 border border-gray-300">
        <h3 className="text-xl font-semibold text-black mb-5 text-center">
          Recent Bookings
        </h3>
        {recentBookings && recentBookings.length > 0 ? (
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div
                key={booking._id}
                className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div>
                  <p className="text-sm font-medium text-black">
                    {booking.roomId?.hotel?.name || "N/A"}
                  </p>
                  <p className="text-xs text-gray-700">
                    Check-In: {new Date(booking.checkIn).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-black">
                    ${booking.totalPrice?.toLocaleString() || "0.00"}
                  </p>
                  <p className="text-xs text-gray-700">{booking.status || "N/A"}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-700 text-center">
            No recent bookings available.
          </p>
        )}
      </div>

      {/* Right Side: Stats & Charts */}
      <div className="lg:flex-1 flex flex-col space-y-8">
        {/* Stats Cards: Two rows of cards with different order */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {/* Reordered cards for a different look */}
          <div
            className="bg-white rounded-2xl shadow-lg p-6 flex items-center space-x-4 border border-gray-300 cursor-pointer hover:scale-105 transition-transform duration-300"
            onClick={() => setCurrentScreen("users")}
          >
            <div className="p-4 bg-red-100 rounded-full">
              <FiUsers className="text-red-600" size={28} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-1">Total Users</h3>
              <p className="text-3xl font-extrabold text-black">{totalUsers}</p>
            </div>
          </div>
          <div
            className="bg-white rounded-2xl shadow-lg p-6 flex items-center space-x-4 border border-gray-300 cursor-pointer hover:scale-105 transition-transform duration-300"
            onClick={() => setCurrentScreen("revenue")}
          >
            <div className="p-4 bg-blue-100 rounded-full">
              <FiDollarSign className="text-blue-600" size={28} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-1">Total Revenue</h3>
              <p className="text-3xl font-extrabold text-black">${totalRevenue.toLocaleString()}</p>
            </div>
          </div>
          <div
            className="bg-white rounded-2xl shadow-lg p-6 flex items-center space-x-4 border border-gray-300 cursor-pointer hover:scale-105 transition-transform duration-300"
            onClick={() => setCurrentScreen("bookings")}
          >
            <div className="p-4 bg-indigo-100 rounded-full">
              <FiBook className="text-indigo-600" size={28} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-1">Total Bookings</h3>
              <p className="text-3xl font-extrabold text-black">{overviewStats.bookings}</p>
            </div>
          </div>
          <div
            className="bg-white rounded-2xl shadow-lg p-6 flex items-center space-x-4 border border-gray-300 cursor-pointer hover:scale-105 transition-transform duration-300"
            onClick={() => setCurrentScreen("hotels")}
          >
            <div className="p-4 bg-green-100 rounded-full">
              <FiHome className="text-green-600" size={28} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-1">Total Hotels</h3>
              <p className="text-3xl font-extrabold text-black">{overviewStats.hotels}</p>
            </div>
          </div>
          <div
            className="bg-white rounded-2xl shadow-lg p-6 flex items-center space-x-4 border border-gray-300 cursor-pointer hover:scale-105 transition-transform duration-300"
            onClick={() => setCurrentScreen("coupons")}
          >
            <div className="p-4 bg-purple-100 rounded-full">
              <FiTag className="text-purple-600" size={28} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-1">Available Coupons</h3>
              <p className="text-3xl font-extrabold text-black">{overviewStats.coupons}</p>
            </div>
          </div>
          <div
            className="bg-white rounded-2xl shadow-lg p-6 flex items-center space-x-4 border border-gray-300 cursor-pointer hover:scale-105 transition-transform duration-300"
            onClick={() => setCurrentScreen("hotels")}
          >
            <div className="p-4 bg-yellow-100 rounded-full">
              <FiMap className="text-yellow-600" size={28} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-1">Total Locations</h3>
              <p className="text-3xl font-extrabold text-black">{overviewStats.locations}</p>
            </div>
          </div>
        </div>

        {/* Charts Side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-300">
            <h3 className="text-lg font-semibold text-black mb-4 text-center">
              Statistics Overview (Bar)
            </h3>
            <div className="h-64">
              <Bar data={overviewChartData} options={barOptions} />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-300">
            <h3 className="text-lg font-semibold text-black mb-4 text-center">
              Statistics Breakdown (Doughnut)
            </h3>
            <div className="h-64">
              <Doughnut data={overviewChartData} options={doughnutOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )}
</section>

    );
};

export default OverviewScreen;