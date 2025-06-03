import React from "react";
import { Bar, Line } from "react-chartjs-2";
import { FiRefreshCw } from "react-icons/fi";

const RevenueScreen = ({
  revenueLoading,
  revenueError,
  revenueData,
  revenueFilters,
  setRevenueFilters,
  isAdmin,
  isDarkMode,
  fetchBookings,
  uniqueStates,
  uniqueCities,
  uniqueHotels,
}) => {
  const revenueByStateChartData = {
    labels: revenueData.byState.map((item) => item.stateName || "Unknown"),
    datasets: [
      {
        label: "Revenue by State (₹)",
        data: revenueData.byState.map((item) => item.revenue || 0),
        backgroundColor: (ctx) => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, "rgba(99, 102, 241, 0.8)");
          gradient.addColorStop(1, "rgba(99, 102, 241, 0.4)");
          return gradient;
        },
        borderColor: "rgba(99, 102, 241, 1)",
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const revenueByCityChartData = {
    labels: revenueData.byCity.map((item) => item.cityName || "Unknown"),
    datasets: [
      {
        label: "Revenue by City (₹)",
        data: revenueData.byCity.map((item) => item.revenue || 0),
        backgroundColor: (ctx) => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, "rgba(34, 197, 94, 0.8)");
          gradient.addColorStop(1, "rgba(34, 197, 94, 0.4)");
          return gradient;
        },
        borderColor: "rgba(34, 197, 94, 1)",
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const revenueByHotelChartData = {
    labels: revenueData.byHotel.map((item) => item.hotelName || "Unknown"),
    datasets: [
      {
        label: "Revenue by Hotel (₹)",
        data: revenueData.byHotel.map((item) => item.revenue || 0),
        backgroundColor: (ctx) => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, "rgba(234, 179, 8, 0.8)");
          gradient.addColorStop(1, "rgba(234, 179, 8, 0.4)");
          return gradient;
        },
        borderColor: "rgba(234, 179, 8, 1)",
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const revenueTrendChartData = {
    labels: revenueData.byDate.map((item) => item.date),
    datasets: [
      {
        label: "Revenue Over Time (₹)",
        data: revenueData.byDate.map((item) => item.revenue || 0),
        fill: true,
        backgroundColor: (ctx) => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, "rgba(168, 85, 247, 0.3)");
          gradient.addColorStop(1, "rgba(168, 85, 247, 0)");
          return gradient;
        },
        borderColor: "rgba(168, 85, 247, 1)",
        borderWidth: 2,
        tension: 0.4,
        pointBackgroundColor: "rgba(168, 85, 247, 1)",
        pointBorderColor: "#FFFFFF",
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 8,
      },
    ],
  };

  const revenueChartOptions = {
    maintainAspectRatio: false,
    animation: { duration: 1500, easing: "easeOutCubic" },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Revenue (₹)",
          color: isDarkMode ? "#D1D5DB" : "#4B5563",
          font: { size: 14, weight: "bold" },
        },
        ticks: {
          color: isDarkMode ? "#D1D5DB" : "#4B5563",
          font: { size: 12 },
          callback: (value) => `₹${value.toLocaleString("en-IN")}`,
        },
        grid: {
          color: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
        },
      },
      x: {
        ticks: {
          color: isDarkMode ? "#D1D5DB" : "#4B5563",
          font: { size: 12 },
          maxRotation: 45,
          minRotation: 45,
        },
        grid: { display: false },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: isDarkMode ? "#D1D5DB" : "#4B5563",
          font: { size: 12 },
        },
      },
      datalabels: {
        display: true,
        color: isDarkMode ? "#FFFFFF" : "#000000",
        font: { weight: "bold", size: 10 },
        anchor: "end",
        align: "top",
        formatter: (value) => `₹${value.toLocaleString("en-IN")}`,
      },
      tooltip: {
        backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF",
        titleColor: isDarkMode ? "#FFFFFF" : "#000000",
        bodyColor: isDarkMode ? "#D1D5DB" : "#4B5563",
        borderColor: isDarkMode ? "#4B5563" : "#E5E7EB",
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: (context) =>
            `${context.dataset.label}: ₹${context.raw.toLocaleString("en-IN")}`,
        },
      },
    },
  };

  const revenueTrendOptions = {
    maintainAspectRatio: false,
    animation: { duration: 1500, easing: "easeOutCubic" },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Revenue (₹)",
          color: isDarkMode ? "#D1D5DB" : "#4B5563",
          font: { size: 14, weight: "bold" },
        },
        ticks: {
          color: isDarkMode ? "#D1D5DB" : "#4B5563",
          font: { size: 12 },
          callback: (value) => `₹${value.toLocaleString("en-IN")}`,
        },
        grid: {
          color: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
        },
      },
      x: {
        ticks: {
          color: isDarkMode ? "#D1D5DB" : "#4B5563",
          font: { size: 12 },
          maxTicksLimit: 10,
        },
        grid: { display: false },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: isDarkMode ? "#D1D5DB" : "#4B5563",
          font: { size: 12 },
        },
      },
      tooltip: {
        backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF",
        titleColor: isDarkMode ? "#FFFFFF" : "#000000",
        bodyColor: isDarkMode ? "#D1D5DB" : "#4B5563",
        borderColor: isDarkMode ? "#4B5563" : "#E5E7EB",
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: (context) =>
            `${context.dataset.label}: ₹${context.raw.toLocaleString("en-IN")}`,
        },
      },
    },
  };

  return (
   
    <section className="space-y-8">
      <h2 className="text-4xl font-extrabold text-black mb-8 tracking-tight">
        Revenue
      </h2>

      {revenueLoading ? (
        <div className="text-center text-black">Loading...</div>
      ) : revenueError ? (
        <div className="text-center text-red-600">
          {revenueError}
          <button
            onClick={() => {
              setRevenueError(null);
              setRevenueLoading(true);
              fetchBookings();
            }}
            className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-xl p-6">
          {/* Header */}
          <h3 className="text-lg font-semibold text-black mb-4">
            {isAdmin
              ? "Total Revenue (All Bookings)"
              : "Your Total Revenue (Your Bookings)"}
          </h3>

          {/* Revenue amount */}
          <div className="mb-6">
            <p className="text-3xl font-extrabold text-black">
              ₹
              {revenueData.totalRevenue.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8 flex flex-wrap gap-4">
            {/* Start Date */}
            <div>
              <label className="block text-black mb-2">Start Date</label>
              <input
                type="date"
                value={revenueFilters.startDate}
                onChange={(e) =>
                  setRevenueFilters({
                    ...revenueFilters,
                    startDate: e.target.value,
                  })
                }
                className="w-full max-w-xs px-4 py-2 rounded-lg border border-black bg-white text-black"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-black mb-2">End Date</label>
              <input
                type="date"
                value={revenueFilters.endDate}
                onChange={(e) =>
                  setRevenueFilters({
                    ...revenueFilters,
                    endDate: e.target.value,
                  })
                }
                className="w-full max-w-xs px-4 py-2 rounded-lg border border-black bg-white text-black"
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-black mb-2">State</label>
              <select
                value={revenueFilters.state}
                onChange={(e) =>
                  setRevenueFilters({
                    ...revenueFilters,
                    state: e.target.value,
                  })
                }
                className="w-full max-w-xs px-4 py-2 rounded-lg border border-black bg-white text-black"
              >
                <option value="">All States</option>
                {uniqueStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            {/* City */}
            <div>
              <label className="block text-black mb-2">City</label>
              <select
                value={revenueFilters.city}
                onChange={(e) =>
                  setRevenueFilters({ ...revenueFilters, city: e.target.value })
                }
                className="w-full max-w-xs px-4 py-2 rounded-lg border border-black bg-white text-black"
              >
                <option value="">All Cities</option>
                {uniqueCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Hotel */}
            <div>
              <label className="block text-black mb-2">Hotel</label>
              <select
                value={revenueFilters.hotel}
                onChange={(e) =>
                  setRevenueFilters({
                    ...revenueFilters,
                    hotel: e.target.value,
                  })
                }
                className="w-full max-w-xs px-4 py-2 rounded-lg border border-black bg-white text-black"
              >
                <option value="">All Hotels</option>
                {uniqueHotels.map((hotel) => (
                  <option key={hotel} value={hotel}>
                    {hotel}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Button */}
            <button
              onClick={() =>
                setRevenueFilters({
                  startDate: "",
                  endDate: "",
                  state: "",
                  city: "",
                  hotel: "",
                })
              }
              className="flex items-center mt-8 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200"
            >
              <FiRefreshCw className="mr-2" />
              Reset Filters
            </button>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="text-md font-semibold text-black mb-2">
                Revenue Trend Over Time
              </h4>
              <div className="h-64">
                <Line
                  data={revenueTrendChartData}
                  options={revenueTrendOptions}
                />
              </div>
            </div>

            <div>
              <h4 className="text-md font-semibold text-black mb-2">
                Revenue by State
              </h4>
              <div className="h-64">
                <Bar
                  data={revenueByStateChartData}
                  options={revenueChartOptions}
                />
              </div>
            </div>

            <div>
              <h4 className="text-md font-semibold text-black mb-2">
                Revenue by City
              </h4>
              <div className="h-64">
                <Bar
                  data={revenueByCityChartData}
                  options={revenueChartOptions}
                />
              </div>
            </div>

            <div>
              <h4 className="text-md font-semibold text-black mb-2">
                Revenue by Hotel
              </h4>
              <div className="h-64">
                <Bar
                  data={revenueByHotelChartData}
                  options={revenueChartOptions}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default RevenueScreen;
