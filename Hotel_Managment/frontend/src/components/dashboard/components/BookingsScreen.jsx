import React from "react";
import { FiRefreshCw, FiSearch } from "react-icons/fi";

const BookingsScreen = ({
  bookingsLoading,
  bookingsError,
  paginatedBookings,
  bookingsPage,
  totalBookingPages,
  setBookingsPage,
  bookingsFilters,
  setBookingsFilters,
  bookingsSort,
  setBookingsSort,
  uniqueBookingStatuses,
  uniqueBookingHotels,
}) => (
  <section className="space-y-8 bg-white text-black">
    <h2 className="text-4xl font-extrabold mb-8 tracking-tight">Bookings</h2>

    {bookingsLoading ? (
      <div className="text-center text-black">Loading...</div>
    ) : bookingsError ? (
      <div className="text-center text-red-600">{bookingsError}</div>
    ) : (
      <>
        <div className="mb-6 flex flex-wrap gap-4">
          <div>
            <label className="block mb-2 text-black">Status</label>
            <select
              value={bookingsFilters.status}
              onChange={(e) =>
                setBookingsFilters({
                  ...bookingsFilters,
                  status: e.target.value,
                })
              }
              className="w-full max-w-xs px-4 py-2 rounded-md border border-black bg-white text-black"
            >
              <option value="">All Statuses</option>
              {uniqueBookingStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2 text-black">Hotel</label>
            <select
              value={bookingsFilters.hotel}
              onChange={(e) =>
                setBookingsFilters({
                  ...bookingsFilters,
                  hotel: e.target.value,
                })
              }
              className="w-full max-w-xs px-4 py-2 rounded-md border border-black bg-white text-black"
            >
              <option value="">All Hotels</option>
              {uniqueBookingHotels.map((hotel) => (
                <option key={hotel} value={hotel}>
                  {hotel}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2 text-black">Start Date</label>
            <input
              type="date"
              value={bookingsFilters.startDate}
              onChange={(e) =>
                setBookingsFilters({
                  ...bookingsFilters,
                  startDate: e.target.value,
                })
              }
              className="w-full max-w-xs px-4 py-2 rounded-md border border-black bg-white text-black"
            />
          </div>
          <div>
            <label className="block mb-2 text-black">End Date</label>
            <input
              type="date"
              value={bookingsFilters.endDate}
              onChange={(e) =>
                setBookingsFilters({
                  ...bookingsFilters,
                  endDate: e.target.value,
                })
              }
              className="w-full max-w-xs px-4 py-2 rounded-md border border-black bg-white text-black"
            />
          </div>
          <div>
            <label className="block mb-2 text-black">Search</label>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black" />
              <input
                type="text"
                value={bookingsFilters.search}
                onChange={(e) =>
                  setBookingsFilters({
                    ...bookingsFilters,
                    search: e.target.value,
                  })
                }
                placeholder="Search by ID or Hotel"
                className="w-full max-w-xs pl-10 pr-4 py-2 rounded-md border border-black bg-white text-black"
              />
            </div>
          </div>
          <button
            onClick={() =>
              setBookingsFilters({
                status: "",
                hotel: "",
                startDate: "",
                endDate: "",
                search: "",
              })
            }
            className="flex items-center mt-8 px-4 py-2 bg-black text-white rounded-md hover:bg-opacity-90 transition-all duration-200"
          >
            <FiRefreshCw className="mr-2" />
            Reset Filters
          </button>
        </div>

        <div className="bg-white rounded-md shadow-md overflow-x-auto border border-black">
          <table className="min-w-full divide-y divide-black text-black">
            <thead className="bg-white">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                  Booking ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                  Hotel
                </th>
                <th
                  className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer"
                  onClick={() =>
                    setBookingsSort({
                      field: "checkIn",
                      order: bookingsSort.order === "asc" ? "desc" : "asc",
                    })
                  }
                >
                  Check-in{" "}
                  {bookingsSort.field === "checkIn" &&
                    (bookingsSort.order === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer"
                  onClick={() =>
                    setBookingsSort({
                      field: "checkOut",
                      order: bookingsSort.order === "asc" ? "desc" : "asc",
                    })
                  }
                >
                  Check-out{" "}
                  {bookingsSort.field === "checkOut" &&
                    (bookingsSort.order === "asc" ? "↑" : "↓")}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-black">
              {paginatedBookings.length > 0 ? (
                paginatedBookings.map((booking) => (
                  <tr
                    key={booking._id}
                    className="hover:bg-black/5 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {booking._id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {booking.roomId?.hotel?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(booking.checkIn).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(booking.checkOut).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {booking.status}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center">
                    No bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="flex justify-between items-center px-6 py-4">
            <button
              onClick={() => setBookingsPage((p) => Math.max(p - 1, 1))}
              disabled={bookingsPage === 1}
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-opacity-90 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-black">
              Page {bookingsPage} of {totalBookingPages}
            </span>
            <button
              onClick={() =>
                setBookingsPage((p) => Math.min(p + 1, totalBookingPages))
              }
              disabled={bookingsPage === totalBookingPages}
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-opacity-90 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </>
    )}
  </section>
);

export default BookingsScreen;
