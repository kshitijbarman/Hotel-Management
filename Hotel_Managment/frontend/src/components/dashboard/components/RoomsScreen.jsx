import React from 'react';
import { FiRefreshCw, FiSearch } from 'react-icons/fi';

const RoomsScreen = ({
    roomsLoading,
    roomsError,
    roomsStates,
    selectedRoomState,
    setSelectedRoomState,
    roomsCities,
    selectedRoomCity,
    setSelectedRoomCity,
    roomsHotels,
    selectedRoomHotel,
    setSelectedRoomHotel,
    roomsSearch,
    setRoomsSearch,
    paginatedRooms,
    roomsPage,
    totalRoomPages,
    setRoomsPage,
}) => (
    <section className="space-y-8">
        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8 tracking-tight">Rooms</h2>
        {roomsLoading ? (
            <div className="text-center text-gray-600 dark:text-gray-300">Loading...</div>
        ) : roomsError ? (
            <div className="text-center text-red-600 dark:text-red-400">{roomsError}</div>
        ) : (
            <>
                <div className="mb-6 flex flex-wrap gap-4">
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-2">Select State</label>
                        <select
                            value={selectedRoomState}
                            onChange={e => setSelectedRoomState(e.target.value)}
                            className="w-full max-w-xs px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                        >
                            <option value="">Select State</option>
                            {roomsStates.map(state => (
                                <option key={state._id} value={state._id}>
                                    {state.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-2">Select City</label>
                        <select
                            value={selectedRoomCity}
                            onChange={e => setSelectedRoomCity(e.target.value)}
                            className="w-full max-w-xs px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                            disabled={!selectedRoomState}
                        >
                            <option value="">Select City</option>
                            {roomsCities.map(city => (
                                <option key={city._id} value={city._id}>
                                    {city.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-2">Select Hotel</label>
                        <select
                            value={selectedRoomHotel}
                            onChange={e => setSelectedRoomHotel(e.target.value)}
                            className="w-full max-w-xs px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                            disabled={!selectedRoomCity}
                        >
                            <option value="">Select Hotel</option>
                            {roomsHotels.map(hotel => (
                                <option key={hotel._id} value={hotel._id}>
                                    {hotel.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-2">Search Rooms</label>
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={roomsSearch}
                                onChange={e => setRoomsSearch(e.target.value)}
                                placeholder="Search by room number or type"
                                className="w-full max-w-xs pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                            />
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            setSelectedRoomState('');
                            setSelectedRoomCity('');
                            setSelectedRoomHotel('');
                            setRoomsSearch('');
                        }}
                        className="mt-8 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-200 flex items-center"
                    >
                        <FiRefreshCw className="mr-2" />
                        Reset Filters
                    </button>
                </div>
                <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-xl overflow-x-auto backdrop-blur-md">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-100/80 dark:bg-gray-700/80">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Room Number</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Price</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white/50 dark:bg-gray-800/50 divide-y divide-gray-200 dark:divide-gray-700">
                            {paginatedRooms.length > 0 ? (
                                paginatedRooms.map(room => (
                                    <tr key={room._id} className="hover:bg-gray-50/80 dark:hover:bg-gray-700/80 transition-colors duration-200">
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-200">{room.roomNumber}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-200">{room.type || 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-200">₹{room.price || 'N/A'}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="px-6 py-4 text-center text-gray-700 dark:text-gray-200">
                                        No rooms found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <div className="flex justify-between items-center px-6 py-4">
                        <button
                            onClick={() => setRoomsPage(p => Math.max(p - 1, 1))}
                            disabled={roomsPage === 1}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400"
                        >
                            Previous
                        </button>
                        <span className="text-gray-700 dark:text-gray-200">
                            Page {roomsPage} of {totalRoomPages}
                        </span>
                        <button
                            onClick={() => setRoomsPage(p => Math.min(p + 1, totalRoomPages))}
                            disabled={roomsPage === totalRoomPages}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </>
        )}
    </section>
);

export default RoomsScreen;