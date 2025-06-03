
import React, { useState } from "react";
import { FaSearch, FaStar, FaSortAmountUp, FaSortAmountDown, FaArrowDown, FaMapMarkerAlt } from "react-icons/fa";
import useDarkMode from "../hooks/useDarkMode";

const SearchHotels = ({
  states,
  cities,
  selectedState,
  selectedCity,
  filterRating,
  searchTerm,
  sortOrder,
  handleStateChange,
  handleCityChange,
  setFilterRating,
  setSearchTerm,
  setSortOrder,
  loadingStates,
  loadingCities,
  error,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [isDarkMode] = useDarkMode();

  return (
    <section
      className={`${
        isDarkMode ? "bg-black text-white" : "bg-white text-black"
      } rounded-2xl p-8 shadow-xl mb-10 backdrop-blur-md transform -mt-24 mx-4 lg:mx-auto max-w-7xl`}
    >
      <h2
        className={`text-2xl font-semibold ${isDarkMode ? "text-blue-300" : "text-blue-600"} mb-6 flex items-center`}
      >
        <FaSearch className="mr-2" /> Search Hotels
      </h2>
      {error && (
        <div
          className={`${
            isDarkMode ? "bg-red-900/20 border-red-500/50" : "bg-red-100/20 border-red-400/50"
          } border rounded-lg p-4 mb-6`}
        >
          <p className={`${isDarkMode ? "text-red-400" : "text-red-600"} text-center`}>{error}</p>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <label
            htmlFor="state-select"
            className={`block text-sm font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-700"} mb-2`}
          >
            Select State
          </label>
          <div className="relative">
            <select
              id="state-select"
              value={selectedState}
              onChange={(e) => handleStateChange(e.target.value)}
              disabled={loadingStates}
              className={`${
                isDarkMode
                  ? "bg-gray-700/80 border-gray-600 text-gray-100 focus:ring-blue-400 focus:border-blue-400 disabled:bg-gray-600/50 disabled:text-gray-400"
                  : "bg-gray-200/80 border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-300/50 disabled:text-gray-600"
              } w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 transition-all duration-200 appearance-none disabled:cursor-not-allowed`}
              aria-label="Select state"
              aria-busy={loadingStates}
            >
              <option value="">-- All States --</option>
              {states.map((state) => (
                <option key={state._id} value={state._id}>
                  {state.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              {loadingStates ? (
                <div
                  className={`animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 ${
                    isDarkMode ? "border-blue-400" : "border-blue-500"
                  }`}
                ></div>
              ) : (
                <FaMapMarkerAlt className={`${isDarkMode ? "text-blue-400" : "text-blue-500"}`} />
              )}
            </div>
          </div>
        </div>
        <div>
          <label
            htmlFor="city-select"
            className={`block text-sm font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-700"} mb-2`}
          >
            Select City
          </label>
          <div className="relative">
            <select
              id="city-select"
              value={selectedCity}
              onChange={(e) => handleCityChange(e.target.value)}
              disabled={!selectedState || loadingCities}
              className={`${
                isDarkMode
                  ? "bg-gray-700/80 border-gray-600 text-gray-100 focus:ring-blue-400 focus:border-blue-400 disabled:bg-gray-600/50 disabled:text-gray-400"
                  : "bg-gray-200/80 border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-300/50 disabled:text-gray-600"
              } w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 disabled:cursor-not-allowed transition-all duration-200 appearance-none`}
              aria-label="Select city"
              aria-busy={loadingCities}
            >
              <option value="">-- All Cities --</option>
              {cities.map((city) => (
                <option key={city._id} value={city._id}>
                  {city.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              {loadingCities ? (
                <div
                  className={`animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 ${
                    isDarkMode ? "border-blue-400" : "border-blue-500"
                  }`}
                ></div>
              ) : (
                <FaMapMarkerAlt className={`${isDarkMode ? "text-blue-400" : "text-blue-500"}`} />
              )}
            </div>
          </div>
        </div>
        <div>
          <label
            htmlFor="search-hotel"
            className={`block text-sm font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-700"} mb-2`}
          >
            Search Hotel
          </label>
          <div className="relative">
            <input
              id="search-hotel"
              type="text"
              placeholder="Enter hotel name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`${
                isDarkMode
                  ? "bg-gray-700/80 border-gray-600 text-gray-100 focus:ring-blue-400 focus:border-blue-400"
                  : "bg-gray-200/80 border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500"
              } w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 transition-all duration-200`}
              aria-label="Search hotel by name"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <FaSearch className={`${isDarkMode ? "text-blue-400" : "text-blue-500"}`} />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center ${
            isDarkMode ? "text-blue-300 hover:text-blue-200" : "text-blue-500 hover:text-blue-600"
          } font-medium transition-colors duration-200`}
          aria-label={showFilters ? "Hide advanced filters" : "Show advanced filters"}
          aria-expanded={showFilters}
        >
          {showFilters ? "Hide Filters" : "Show Advanced Filters"}
          <FaArrowDown
            className={`ml-2 transform transition-transform duration-200 ${showFilters ? "rotate-180" : ""}`}
          />
        </button>
        {showFilters && (
          <div
            className={`mt-4 grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t ${
              isDarkMode ? "border-gray-600/50" : "border-gray-300/50"
            } transition-all duration-300 ease-in-out animate-fadeIn`}
          >
            <div>
              <label
                className={`block text-sm font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-700"} mb-2`}
              >
                Minimum Rating
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setFilterRating(star)}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      filterRating >= star
                        ? isDarkMode
                          ? "text-yellow-400 bg-yellow-900/20"
                          : "text-yellow-500 bg-yellow-200/20"
                        : isDarkMode
                        ? "text-gray-400 hover:text-yellow-300"
                        : "text-gray-500 hover:text-yellow-400"
                    }`}
                    aria-label={`Filter hotels with minimum rating of ${star} stars`}
                    aria-pressed={filterRating >= star}
                  >
                    <FaStar />
                  </button>
                ))}
                <button
                  onClick={() => setFilterRating(0)}
                  className={`ml-2 text-xs ${
                    isDarkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-800"
                  } px-3 py-1 rounded-full ${
                    isDarkMode ? "bg-gray-700/80 hover:bg-gray-600" : "bg-gray-200/80 hover:bg-gray-300"
                  } transition-all duration-200`}
                  aria-label="Clear minimum rating filter"
                >
                  Clear
                </button>
              </div>
              {filterRating > 0 && (
                <p className={`mt-2 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Showing hotels with {filterRating} {filterRating === 1 ? "star" : "stars"} or higher
                </p>
              )}
            </div>
            <div>
              <label
                className={`block text-sm font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-700"} mb-2`}
              >
                Sort by Rating
              </label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setSortOrder(sortOrder === "asc" ? "" : "asc")}
                  className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                    sortOrder === "asc"
                      ? isDarkMode
                        ? "bg-blue-600 text-white"
                        : "bg-blue-500 text-white"
                      : isDarkMode
                      ? "bg-gray-700/80 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-200/80 text-gray-600 hover:bg-gray-300"
                  }`}
                  aria-label="Sort hotels by rating from low to high"
                  aria-pressed={sortOrder === "asc"}
                >
                  <FaSortAmountUp className="mr-2" /> Low to High
                </button>
                <button
                  onClick={() => setSortOrder(sortOrder === "desc" ? "" : "desc")}
                  className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                    sortOrder === "desc"
                      ? isDarkMode
                        ? "bg-blue-600 text-white"
                        : "bg-blue-500 text-white"
                      : isDarkMode
                      ? "bg-gray-700/80 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-200/80 text-gray-600 hover:bg-gray-300"
                  }`}
                  aria-label="Sort hotels by rating from high to low"
                  aria-pressed={sortOrder === "desc"}
                >
                  <FaSortAmountDown className="mr-2" /> High to Low
                </button>
              </div>
              {sortOrder && (
                <p className={`mt-2 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Sorting by rating: {sortOrder === "asc" ? "Low to High" : "High to Low"}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );


};

export default SearchHotels;