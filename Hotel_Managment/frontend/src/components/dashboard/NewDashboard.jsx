
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiBook, FiHome, FiMap, FiTag, FiLogOut, FiMoon, FiSun, FiDollarSign, FiMapPin, FiKey, FiUsers, FiSearch, FiFilter, FiRefreshCw } from 'react-icons/fi';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend, LineElement, PointElement } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import useDarkMode from '../User/hooks/useDarkMode';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend, LineElement, PointElement, ChartDataLabels);

const API_URL = 'http://localhost:6969/';
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

const UserDashboard = () => {
    const [currentScreen, setCurrentScreen] = useState('overview');
    // const [darkMode, setDarkMode] = useState(false);
    //   const [isDarkMode] = useDarkMode(); 

    const [isDarkMode, toggleMode] = useDarkMode();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();


    const [overviewStats, setOverviewStats] = useState({ bookings: 0, hotels: 0, locations: 0, coupons: 0 });
    const [overviewLoading, setOverviewLoading] = useState(false);
    const [overviewError, setOverviewError] = useState(null);

    const [bookings, setBookings] = useState([]);
    const [revenueData, setRevenueData] = useState({
        totalRevenue: 0,
        byState: [],
        byCity: [],
        byHotel: [],
        byDate: [],
    });
    const [revenueFilters, setRevenueFilters] = useState({
        startDate: '',
        endDate: '',
        state: '',
        city: '',
        hotel: '',
    });
    const [revenueLoading, setRevenueLoading] = useState(false);
    const [revenueError, setRevenueError] = useState(null);


    const [profileUsers, setProfileUsers] = useState([]);
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileError, setProfileError] = useState(null);


    const [users, setUsers] = useState([]);
    const [usersLoading, setUsersLoading] = useState(false);
    const [usersError, setUsersError] = useState(null);


    const [bookingsList, setBookingsList] = useState([]);
    const [bookingsFilters, setBookingsFilters] = useState({
        status: '',
        hotel: '',
        startDate: '',
        endDate: '',
        search: '',
    });
    const [bookingsSort, setBookingsSort] = useState({ field: 'checkIn', order: 'asc' });
    const [bookingsPage, setBookingsPage] = useState(1);
    const bookingsPerPage = 10;
    const [bookingsLoading, setBookingsLoading] = useState(false);
    const [bookingsError, setBookingsError] = useState(null);


    const [locations, setLocations] = useState([]);
    const [locationsLoading, setLocationsLoading] = useState(false);
    const [locationsError, setLocationsError] = useState(null);


    const [states, setStates] = useState([]);
    const [statesLoading, setStatesLoading] = useState(false);
    const [statesError, setStatesError] = useState(null);


    const [citiesStates, setCitiesStates] = useState([]);
    const [selectedState, setSelectedState] = useState('');
    const [cities, setCities] = useState([]);
    const [citiesLoading, setCitiesLoading] = useState(false);
    const [citiesError, setCitiesError] = useState(null);


    const [hotelsStates, setHotelsStates] = useState([]);
    const [hotelsCities, setHotelsCities] = useState([]);
    const [selectedHotelState, setSelectedHotelState] = useState('');
    const [selectedHotelCity, setSelectedHotelCity] = useState('');
    const [hotelsSearch, setHotelsSearch] = useState('');
    const [hotelsPage, setHotelsPage] = useState(1);
    const hotelsPerPage = 10;
    const [hotels, setHotels] = useState([]);
    const [hotelsLoading, setHotelsLoading] = useState(false);
    const [hotelsError, setHotelsError] = useState(null);


    const [roomsStates, setRoomsStates] = useState([]);
    const [roomsCities, setRoomsCities] = useState([]);
    const [roomsHotels, setRoomsHotels] = useState([]);
    const [selectedRoomState, setSelectedRoomState] = useState('');
    const [selectedRoomCity, setSelectedRoomCity] = useState('');
    const [selectedRoomHotel, setSelectedRoomHotel] = useState('');
    const [roomsSearch, setRoomsSearch] = useState('');
    const [roomsPage, setRoomsPage] = useState(1);
    const roomsPerPage = 10;
    const [rooms, setRooms] = useState([]);
    const [roomsLoading, setRoomsLoading] = useState(false);
    const [roomsError, setRoomsError] = useState(null);


    const [allCoupons, setAllCoupons] = useState([]);
    const [availableCoupons, setAvailableCoupons] = useState([]);
    const [couponsLoading, setCouponsLoading] = useState(false);
    const [couponsError, setCouponsError] = useState(null);

    const isAdmin = user?.role === 'admin';

    // Fetch User Data-------------------------------------------------------------------------
    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                const response = await api.get('user/me');
                setUser(response.data.user);
                console.log('User data:', response.data.user);
            } catch (err) {
                setError('Failed to fetch user details. Please log in again.');
                console.error('Error fetching user:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    // Overview Section Data Fetch--------------------------------------------------------
    useEffect(() => {
        const fetchStats = async () => {
            try {
                setOverviewLoading(true);
                const [bookingsRes, hotelsRes, locationsRes, couponsRes] = await Promise.all([
                    api.get(isAdmin ? 'api/bookings/' : 'api/bookings/'),
                    api.get('api/hotels'),
                    api.get('api/states'),
                    api.get('api/coupons/'),
                ]);
                setOverviewStats({
                    bookings: Array.isArray(bookingsRes.data) ? bookingsRes.data.length : bookingsRes.data.bookings?.length || 0,
                    hotels: Array.isArray(hotelsRes.data) ? hotelsRes.data.length : 0,
                    locations: Array.isArray(locationsRes.data) ? locationsRes.data.length : 0,
                    coupons: Array.isArray(couponsRes.data) ? couponsRes.data.length : 0,
                });
            } catch (err) {
                setOverviewError('Failed to fetch overview stats.');
                console.error('Error fetching stats:', err);
            } finally {
                setOverviewLoading(false);
            }
        };
        if (user && currentScreen === 'overview') fetchStats();
    }, [user, isAdmin, currentScreen]);

    // Revenue Section Data Fetch----------------------------------------
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setRevenueLoading(true);
                const endpoint = isAdmin ? '/api/bookings/' : '/api/bookings/';
                const response = await api.get(endpoint);
                setBookings(response.data.bookings || []);
                console.log('Bookings data:', response.data.bookings);
            } catch (err) {
                setRevenueError('Failed to fetch bookings.');
                console.error('Error fetching bookings:', err);
            } finally {
                setRevenueLoading(false);
            }
        };
        if (user && currentScreen === 'revenue') fetchBookings();
    }, [user, isAdmin, currentScreen]);

    useEffect(() => {
        const calculateRevenue = () => {
            let totalRevenue = 0;
            const byStateMap = {};
            const byCityMap = {};
            const byHotelMap = {};
            const byDateMap = {};

            for (const booking of bookings) {
                if (booking.status !== 'approved') continue;

                const checkInDate = new Date(booking.checkIn);
                const { startDate, endDate, state, city, hotel } = revenueFilters;

                // Date Range Filter================
                if (startDate && checkInDate < new Date(startDate)) continue;
                if (endDate && checkInDate > new Date(endDate)) continue;

                const room = booking.roomId;
                if (!room || !room.hotel || !room.hotel.city || !room.hotel.city.state) continue;

                const hotelObj = room.hotel;
                const cityObj = hotelObj.city;
                const stateObj = cityObj.state;

                // Location Filters=====================
                if (state && stateObj.name !== state) continue;
                if (city && cityObj.name !== city) continue;
                if (hotel && hotelObj.name !== hotel) continue;

                const revenue = booking.totalPrice || 0;
                totalRevenue += revenue;

                const stateName = stateObj.name || 'Unknown';
                const cityName = cityObj.name || 'Unknown';
                const hotelName = hotelObj.name || 'Unknown';
                const dateKey = checkInDate.toISOString().split('T')[0]; // yyyy-mm-dd

                // Aggregate by State========================
                byStateMap[stateName] = (byStateMap[stateName] || 0) + revenue;

                // Aggregate by City
                byCityMap[cityName] = (byCityMap[cityName] || 0) + revenue;

                // Aggregate by Hotel
                byHotelMap[hotelName] = (byHotelMap[hotelName] || 0) + revenue;

                // Aggregate by Date for Trend
                byDateMap[dateKey] = (byDateMap[dateKey] || 0) + revenue;
            }

            const byState = Object.entries(byStateMap).map(([stateName, revenue]) => ({ stateName, revenue }));
            const byCity = Object.entries(byCityMap).map(([cityName, revenue]) => ({ cityName, revenue }));
            const byHotel = Object.entries(byHotelMap).map(([hotelName, revenue]) => ({ hotelName, revenue }));
            const byDate = Object.entries(byDateMap)
                .map(([date, revenue]) => ({ date, revenue }))
                .sort((a, b) => new Date(a.date) - new Date(b.date));

            setRevenueData({
                totalRevenue,
                byState,
                byCity,
                byHotel,
                byDate,
            });
        };

        if (bookings.length > 0) {
            calculateRevenue();
        }
    }, [bookings, revenueFilters]);

    // Users Section Data Fetch--------------------------------------------------
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setProfileLoading(true);
                const response = await api.get('/user/getAllUsers');
                const usersData = Array.isArray(response.data) ? response.data : response.data.userData || [];
                setProfileUsers(usersData);
                console.log("users-----------------------", response.data.userData)
            } catch (err) {
                setProfileError('Failed to fetch users. Please check your permissions or try again.');
                console.error('Error fetching users:', err);
            } finally {
                setProfileLoading(false);
            }
        };
        if (user && currentScreen === 'profile') fetchUsers();
    }, [user, currentScreen]);

    // Users Section Data Fetch (for admins)--------------------------------------------------
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setUsersLoading(true);
                const response = await api.get('/user/getAllUsers');
                const usersData = Array.isArray(response.data) ? response.data : response.data.userData || [];
                setUsers(usersData);
            } catch (err) {
                setUsersError('Failed to fetch users. Please check your permissions or try again.');
                console.error('Error fetching users:', err);
            } finally {
                setUsersLoading(false);
            }
        };
        if (user && isAdmin && currentScreen === 'users') fetchUsers();
    }, [user, isAdmin, currentScreen]);

    // Bookings Section Data Fetch---------------------------------------------------------
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setBookingsLoading(true);
                const endpoint = isAdmin ? '/api/bookings/' : '/api/bookings/';
                const response = await api.get(endpoint);
                setBookingsList(response.data.bookings || []);
                console.log('Bookings data:', response.data.bookings);
            } catch (err) {
                setBookingsError('Failed to fetch bookings.');
                console.error('Error fetching bookings:', err);
            } finally {
                setBookingsLoading(false);
            }
        };
        if (user && currentScreen === 'bookings') fetchBookings();
    }, [user, isAdmin, currentScreen]);

    // Filtered and Sorted Bookings------------------------------------------------------------
    const filteredBookings = useMemo(() => {
        let filtered = [...bookingsList];

        const { status, hotel, startDate, endDate, search } = bookingsFilters;

        if (status) {
            filtered = filtered.filter(booking => booking.status === status);
        }

        if (hotel) {
            filtered = filtered.filter(booking => booking.roomId?.hotel?.name === hotel);
        }

        if (startDate) {
            filtered = filtered.filter(booking => new Date(booking.checkIn) >= new Date(startDate));
        }

        if (endDate) {
            filtered = filtered.filter(booking => new Date(booking.checkIn) <= new Date(endDate));
        }

        if (search) {
            filtered = filtered.filter(booking =>
                booking._id.toLowerCase().includes(search.toLowerCase()) ||
                (booking.roomId?.hotel?.name || '').toLowerCase().includes(search.toLowerCase())
            );
        }

        filtered.sort((a, b) => {
            const field = bookingsSort.field;
            const order = bookingsSort.order === 'asc' ? 1 : -1;
            if (field === 'checkIn' || field === 'checkOut') {
                return order * (new Date(a[field]) - new Date(b[field]));
            }
            return order * (a[field] || '').localeCompare(b[field] || '');
        });

        return filtered;
    }, [bookingsList, bookingsFilters, bookingsSort]);

    const paginatedBookings = filteredBookings.slice(
        (bookingsPage - 1) * bookingsPerPage,
        bookingsPage * bookingsPerPage
    );

    const totalBookingPages = Math.ceil(filteredBookings.length / bookingsPerPage);

    // Locations Section Data Fetch------------------------------------------------
    useEffect(() => {
        const fetchLocations = async () => {
            try {
                setLocationsLoading(true);
                const response = await api.get('/locations/all');
                setLocations(response.data.bookings || []);
            } catch (err) {
                setLocationsError('Failed to fetch locations.');
                console.error('Error fetching locations:', err);
            } finally {
                setLocationsLoading(false);
            }
        };
        if (user && currentScreen === 'locations') fetchLocations();
    }, [user, currentScreen]);

    // States Section Data Fetch----------------------------------------------------------
    useEffect(() => {
        const fetchStates = async () => {
            try {
                setStatesLoading(true);
                const response = await api.get('api/states');
                setStates(response.data || []);
            } catch (err) {
                setStatesError('Failed to fetch states.');
                console.error('Error fetching states:', err);
            } finally {
                setStatesLoading(false);
            }
        };
        if (user && currentScreen === 'states') fetchStates();
    }, [user, currentScreen]);

    // Cities Section Data Fetch--------------------------------------------------------
    useEffect(() => {
        const fetchStates = async () => {
            try {
                setCitiesLoading(true);
                const response = await api.get('api/states');
                setCitiesStates(response.data || []);
                if (response.data.length > 0) {
                    setSelectedState(response.data[0]._id);
                }
            } catch (err) {
                setCitiesError('Failed to fetch states.');
                console.error('Error fetching states:', err);
            } finally {
                setCitiesLoading(false);
            }
        };
        if (user && currentScreen === 'cities') fetchStates();
    }, [user, currentScreen]);

    useEffect(() => {
        if (selectedState && currentScreen === 'cities') {
            const fetchCities = async () => {
                try {
                    setCitiesLoading(true);
                    const response = await api.get(`/api/states/${selectedState}/cities`);
                    setCities(response.data || []);
                } catch (err) {
                    setCitiesError('Failed to fetch cities.');
                    console.error('Error fetching cities:', err);
                } finally {
                    setCitiesLoading(false);
                }
            };
            fetchCities();
        }
    }, [selectedState, currentScreen]);

    // Hotels Section Data Fetch-----------------------------------------
    useEffect(() => {
        const fetchStates = async () => {
            try {
                setHotelsLoading(true);
                const response = await api.get('api/states');
                setHotelsStates(response.data || []);
                if (response.data.length > 0) {
                    setSelectedHotelState(response.data[0]._id);
                }
            } catch (err) {
                setHotelsError('Failed to fetch states.');
                console.error('Error fetching states:', err);
            } finally {
                setHotelsLoading(false);
            }
        };
        if (user && currentScreen === 'hotels') fetchStates();
    }, [user, currentScreen]);

    useEffect(() => {
        if (selectedHotelState && currentScreen === 'hotels') {
            const fetchCities = async () => {
                try {
                    setHotelsLoading(true);
                    const response = await api.get(`/api/states/${selectedHotelState}/cities`);
                    setHotelsCities(response.data || []);
                    if (response.data.length > 0) {
                        setSelectedHotelCity(response.data[0]._id);
                    } else {
                        setSelectedHotelCity('');
                        setHotels([]);
                    }
                } catch (err) {
                    setHotelsError('Failed to fetch cities.');
                    console.error('Error fetching cities:', err);
                } finally {
                    setHotelsLoading(false);
                }
            };
            fetchCities();
        }
    }, [selectedHotelState, currentScreen]);

    useEffect(() => {
        if (selectedHotelCity && currentScreen === 'hotels') {
            const fetchHotels = async () => {
                try {
                    setHotelsLoading(true);
                    const response = await api.get(`api/cities/${selectedHotelCity}/hotels`);
                    setHotels(response.data || []);
                } catch (err) {
                    setHotelsError('Failed to fetch hotels.');
                    console.error('Error fetching hotels:', err);
                } finally {
                    setHotelsLoading(false);
                }
            };
            fetchHotels();
        }
    }, [selectedHotelCity, currentScreen]);

    const fetchAllHotels = async () => {
        try {
            setHotelsLoading(true);
            const response = await api.get('api/hotels');
            setHotels(response.data || []);
            setSelectedHotelState('');
            setSelectedHotelCity('');
        } catch (err) {
            setHotelsError('Failed to fetch all hotels.');
            console.error('Error fetching hotels:', err);
        } finally {
            setHotelsLoading(false);
        }
    };

    // Filtered and Paginated Hotels----------------------------------------------------
    const filteredHotels = useMemo(() => {
        let filtered = [...hotels];
        if (hotelsSearch) {
            filtered = filtered.filter(hotel =>
                hotel.name.toLowerCase().includes(hotelsSearch.toLowerCase())
            );
        }
        return filtered;
    }, [hotels, hotelsSearch]);

    const paginatedHotels = filteredHotels.slice(
        (hotelsPage - 1) * hotelsPerPage,
        hotelsPage * hotelsPerPage
    );

    const totalHotelPages = Math.ceil(filteredHotels.length / hotelsPerPage);

    // Rooms Section Data Fetch--------------------------------------------------
    useEffect(() => {
        const fetchStates = async () => {
            try {
                setRoomsLoading(true);
                const response = await api.get('api/states');
                setRoomsStates(response.data || []);
                if (response.data.length > 0) {
                    setSelectedRoomState(response.data[0]._id);
                }
            } catch (err) {
                setRoomsError('Failed to fetch states.');
                console.error('Error fetching states:', err);
            } finally {
                setRoomsLoading(false);
            }
        };
        if (user && currentScreen === 'rooms') fetchStates();
    }, [user, currentScreen]);

    useEffect(() => {
        if (selectedRoomState && currentScreen === 'rooms') {
            const fetchCities = async () => {
                try {
                    setRoomsLoading(true);
                    const response = await api.get(`/api/states/${selectedRoomState}/cities`);
                    setRoomsCities(response.data || []);
                    if (response.data.length > 0) {
                        setSelectedRoomCity(response.data[0]._id);
                    } else {
                        setSelectedRoomCity('');
                        setRoomsHotels([]);
                        setRooms([]);
                    }
                } catch (err) {
                    setRoomsError('Failed to fetch cities.');
                    console.error('Error fetching cities:', err);
                } finally {
                    setRoomsLoading(false);
                }
            };
            fetchCities();
        }
    }, [selectedRoomState, currentScreen]);

    useEffect(() => {
        if (selectedRoomCity && currentScreen === 'rooms') {
            const fetchHotels = async () => {
                try {
                    setRoomsLoading(true);
                    const response = await api.get(`/api/cities/${selectedRoomCity}/hotels`);
                    setRoomsHotels(response.data || []);
                    if (response.data.length > 0) {
                        setSelectedRoomHotel(response.data[0]._id);
                    } else {
                        setSelectedRoomHotel('');
                        setRooms([]);
                    }
                } catch (err) {
                    setRoomsError('Failed to fetch hotels.');
                    console.error('Error fetching hotels:', err);
                } finally {
                    setRoomsLoading(false);
                }
            };
            fetchHotels();
        }
    }, [selectedRoomCity, currentScreen]);

    useEffect(() => {
        if (selectedRoomHotel && currentScreen === 'rooms') {
            const fetchRooms = async () => {
                try {
                    setRoomsLoading(true);
                    const response = await api.get(`/api/${selectedRoomHotel}/rooms`);
                    setRooms(response.data || []);
                } catch (err) {
                    setRoomsError('Failed to fetch rooms.');
                    console.error('Error fetching rooms:', err);
                } finally {
                    setRoomsLoading(false);
                }
            };
            fetchRooms();
        }
    }, [selectedRoomHotel, currentScreen]);

    // Filtered and Paginated Rooms---------------------------------------------------------
    const filteredRooms = useMemo(() => {
        let filtered = [...rooms];
        if (roomsSearch) {
            filtered = filtered.filter(room =>
                room.roomNumber.toLowerCase().includes(roomsSearch.toLowerCase()) ||
                (room.type || '').toLowerCase().includes(roomsSearch.toLowerCase())
            );
        }
        return filtered;
    }, [rooms, roomsSearch]);

    const paginatedRooms = filteredRooms.slice(
        (roomsPage - 1) * roomsPerPage,
        roomsPage * roomsPerPage
    );

    const totalRoomPages = Math.ceil(filteredRooms.length / roomsPerPage);

    // Coupons Section Data Fetch------------------------------------------------------------------
    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                setCouponsLoading(true);
                const [allRes, availableRes] = await Promise.all([
                    api.get('api/coupons'),
                    api.get('api/coupons/available'),
                ]);
                setAllCoupons(allRes.data || []);
                setAvailableCoupons(availableRes.data || []);
            } catch (err) {
                setCouponsError('Failed to fetch coupons.');
                console.error('Error fetching coupons:', err);
            } finally {
                setCouponsLoading(false);
            }
        };
        if (user && currentScreen === 'coupons') fetchCoupons();
    }, [user, currentScreen]);

    // const toggleDarkMode = () => {
    //     setDarkMode(!darkMode);
    //     document.documentElement.classList.toggle('dark');
    // };

    const handleLogout = () => {

        confirm('Are you sure you want to log out?')

        localStorage.removeItem('token');
        navigate('/');
    }

    const handleBack = () => {




        navigate('/admin');
    }

    if (loading) {
        return <div className="text-center text-gray-600 dark:text-gray-300">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-red-600 dark:text-red-400">{error}</div>;
    }

    if (!user) {
        return <div className="text-center text-gray-600
         dark:text-gray-300">No user data available.</div>;
    }

    // tab navigation Options-----------------------------------------------
    const screens = [
        { id: 'overview', label: 'Overview', icon: <FiHome /> },
        { id: 'profile', label: 'Users', icon: <FiUsers /> },

        { id: 'revenue', label: 'Revenue', icon: <FiDollarSign /> },
        { id: 'bookings', label: 'Bookings', icon: <FiBook /> },
        // { id: 'states', label: 'States', icon: <FiMap /> },
        // { id: 'cities', label: 'Cities', icon: <FiMapPin /> },
        { id: 'hotels', label: 'Hotels', icon: <FiHome /> },
        { id: 'rooms', label: 'Rooms', icon: <FiKey /> },
        { id: 'coupons', label: 'Coupons', icon: <FiTag /> },
    ];

    // Chart Data and Options for Overview Section
    const overviewChartData = {
        labels: ['Bookings', 'Hotels', 'Locations', 'Coupons'],
        datasets: [{
            label: 'Count',
            data: [overviewStats.bookings, overviewStats.hotels, overviewStats.locations, overviewStats.coupons],
            backgroundColor: [
                'rgba(99, 102, 241, 0.8)',
                'rgba(34, 197, 94, 0.8)',
                'rgba(234, 179, 8, 0.8)',
                'rgba(168, 85, 247, 0.8)',
            ],
            borderColor: [
                'rgba(99, 102, 241, 1)',
                'rgba(34, 197, 94, 1)',
                'rgba(234, 179, 8, 1)',
                'rgba(168, 85, 247, 1)',
            ],
            borderWidth: 2,
            borderRadius: 10,
            shadowOffsetX: 3,
            shadowOffsetY: 3,
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.3)',
        }],
    };

    const barOptions = {
        maintainAspectRatio: false,
        animation: {
            duration: 1500,
            easing: 'easeOutCubic',
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Count',
                    color: isDarkMode ? '#D1D5DB' : '#4B5563',
                    font: { size: 14, weight: 'bold' },
                },
                ticks: {
                    color: isDarkMode ? '#D1D5DB' : '#4B5563',
                    font: { size: 12 },
                },
                grid: {
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                },
            },
            x: {
                ticks: {
                    color: isDarkMode ? '#D1D5DB' : '#4B5563',
                    font: { size: 12 },
                },
                grid: {
                    display: false,
                },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
            datalabels: {
                display: true,
                color: isDarkMode ? '#FFFFFF' : '#000000',
                font: { weight: 'bold', size: 12 },
                anchor: 'end',
                align: 'top',
                formatter: value => value.toLocaleString(),
            },
            tooltip: {
                backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                titleColor: isDarkMode ? '#FFFFFF' : '#000000',
                bodyColor: isDarkMode ? '#D1D5DB' : '#4B5563',
                borderColor: isDarkMode ? '#4B5563' : '#E5E7EB',
                borderWidth: 1,
                cornerRadius: 8,
            },
        },
    };

    const doughnutOptions = {
        maintainAspectRatio: false,
        animation: {
            duration: 1500,
            easing: 'easeOutCubic',
        },
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: isDarkMode ? '#D1D5DB' : '#4B5563',
                    font: { size: 12 },
                    padding: 20,
                    boxWidth: 20,
                },
            },
            datalabels: {
                display: true,
                color: '#FFFFFF',
                font: { weight: 'bold', size: 12 },
                formatter: value => value.toLocaleString(),
            },
            tooltip: {
                backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                titleColor: isDarkMode ? '#FFFFFF' : '#000000',
                bodyColor: isDarkMode ? '#D1D5DB' : '#4B5563',
                borderColor: isDarkMode ? '#4B5563' : '#E5E7EB',
                borderWidth: 1,
                cornerRadius: 8,
            },
        },
    };

    // Chart Data and Options for Revenue Section
    const revenueByStateChartData = {
        labels: revenueData.byState.map(item => item.stateName || 'Unknown'),
        datasets: [{
            label: 'Revenue by State (₹)',
            data: revenueData.byState.map(item => item.revenue || 0),
            backgroundColor: ctx => {
                const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 400);
                gradient.addColorStop(0, 'rgba(99, 102, 241, 0.8)');
                gradient.addColorStop(1, 'rgba(99, 102, 241, 0.4)');
                return gradient;
            },
            borderColor: 'rgba(99, 102, 241, 1)',
            borderWidth: 2,
            borderRadius: 8,
        }],
    };

    const revenueByCityChartData = {
        labels: revenueData.byCity.map(item => item.cityName || 'Unknown'),
        datasets: [{
            label: 'Revenue by City (₹)',
            data: revenueData.byCity.map(item => item.revenue || 0),
            backgroundColor: ctx => {
                const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 400);
                gradient.addColorStop(0, 'rgba(34, 197, 94, 0.8)');
                gradient.addColorStop(1, 'rgba(34, 197, 94, 0.4)');
                return gradient;
            },
            borderColor: 'rgba(34, 197, 94, 1)',
            borderWidth: 2,
            borderRadius: 8,
        }],
    };

    const revenueByHotelChartData = {
        labels: revenueData.byHotel.map(item => item.hotelName || 'Unknown'),
        datasets: [{
            label: 'Revenue by Hotel (₹)',
            data: revenueData.byHotel.map(item => item.revenue || 0),
            backgroundColor: ctx => {
                const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 400);
                gradient.addColorStop(0, 'rgba(234, 179, 8, 0.8)');
                gradient.addColorStop(1, 'rgba(234, 179, 8, 0.4)');
                return gradient;
            },
            borderColor: 'rgba(234, 179, 8, 1)',
            borderWidth: 2,
            borderRadius: 8,
        }],
    };

    const revenueTrendChartData = {
        labels: revenueData.byDate.map(item => item.date),
        datasets: [{
            label: 'Revenue Over Time (₹)',
            data: revenueData.byDate.map(item => item.revenue || 0),
            fill: true,
            backgroundColor: ctx => {
                const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 400);
                gradient.addColorStop(0, 'rgba(168, 85, 247, 0.3)');
                gradient.addColorStop(1, 'rgba(168, 85, 247, 0)');
                return gradient;
            },
            borderColor: 'rgba(168, 85, 247, 1)',
            borderWidth: 2,
            tension: 0.4,
            pointBackgroundColor: 'rgba(168, 85, 247, 1)',
            pointBorderColor: '#FFFFFF',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 8,
        }],
    };

    const revenueChartOptions = {
        maintainAspectRatio: false,
        animation: {
            duration: 1500,
            easing: 'easeOutCubic',
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Revenue (₹)',
                    color: isDarkMode ? '#D1D5DB' : '#4B5563',
                    font: { size: 14, weight: 'bold' },
                },
                ticks: {
                    color: isDarkMode ? '#D1D5DB' : '#4B5563',
                    font: { size: 12 },
                    callback: value => `₹${value.toLocaleString('en-IN')}`,
                },
                grid: {
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                },
            },
            x: {
                ticks: {
                    color: isDarkMode ? '#D1D5DB' : '#4B5563',
                    font: { size: 12 },
                    maxRotation: 45,
                    minRotation: 45,
                },
                grid: {
                    display: false,
                },
            },
        },
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    color: isDarkMode ? '#D1D5DB' : '#4B5563',
                    font: { size: 12 },
                },
            },
            datalabels: {
                display: true,
                color: isDarkMode ? '#FFFFFF' : '#000000',
                font: { weight: 'bold', size: 10 },
                anchor: 'end',
                align: 'top',
                formatter: value => `₹${value.toLocaleString('en-IN')}`,
            },
            tooltip: {
                backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                titleColor: isDarkMode ? '#FFFFFF' : '#000000',
                bodyColor: isDarkMode ? '#D1D5DB' : '#4B5563',
                borderColor: isDarkMode ? '#4B5563' : '#E5E7EB',
                borderWidth: 1,
                cornerRadius: 8,
                callbacks: {
                    label: context => `${context.dataset.label}: ₹${context.raw.toLocaleString('en-IN')}`,
                },
            },
        },
    };

    const revenueTrendOptions = {
        maintainAspectRatio: false,
        animation: {
            duration: 1500,
            easing: 'easeOutCubic',
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Revenue (₹)',
                    color: isDarkMode ? '#D1D5DB' : '#4B5563',
                    font: { size: 14, weight: 'bold' },
                },
                ticks: {
                    color: isDarkMode ? '#D1D5DB' : '#4B5563',
                    font: { size: 12 },
                    callback: value => `₹${value.toLocaleString('en-IN')}`,
                },
                grid: {
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                },
            },
            x: {
                ticks: {
                    color: isDarkMode ? '#D1D5DB' : '#4B5563',
                    font: { size: 12 },
                    maxTicksLimit: 10,
                },
                grid: {
                    display: false,
                },
            },
        },
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    color: isDarkMode ? '#D1D5DB' : '#4B5563',
                    font: { size: 12 },
                },
            },
            tooltip: {
                backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                titleColor: isDarkMode ? '#FFFFFF' : '#000000',
                bodyColor: isDarkMode ? '#D1D5DB' : '#4B5563',
                borderColor: isDarkMode ? '#4B5563' : '#E5E7EB',
                borderWidth: 1,
                cornerRadius: 8,
                callbacks: {
                    label: context => `${context.dataset.label}: ₹${context.raw.toLocaleString('en-IN')}`,
                },
            },
        },
    };


    const uniqueStates = [...new Set(bookings.map(b => b.roomId?.hotel?.city?.state?.name).filter(Boolean))];
    const uniqueCities = [...new Set(bookings.map(b => b.roomId?.hotel?.city?.name).filter(Boolean))];
    const uniqueHotels = [...new Set(bookings.map(b => b.roomId?.hotel?.name).filter(Boolean))];


    const uniqueBookingStatuses = [...new Set(bookingsList.map(b => b.status).filter(Boolean))];
    const uniqueBookingHotels = [...new Set(bookingsList.map(b => b.roomId?.hotel?.name).filter(Boolean))];

    return (
        <div className={`min-h-screen ${isDarkMode ? 'dark bg-gradient-to-br from-gray-900 to-gray-700' : 'bg-gradient-to-br from-gray-100 to-gray-300'} transition-colors duration-500`}>
            {/*----------------------------------------------- Header--------------------------------------------- */}
            <header className="bg-white/80 dark:bg-gray-800/80 shadow-xl backdrop-blur-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Hotel Management Dashboard</h1>
                    <div className="flex items-center space-x-4">
                        <button onClick={toggleMode} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200">
                            {isDarkMode ? <FiSun size={20} className="text-yellow-400" /> : <FiMoon size={20} className="text-gray-600" />}
                        </button>
                        <span className="text-gray-600 dark:text-gray-300 font-medium">{user.firstname || 'User'}</span>
                        <button
                            onClick={handleBack}
                            className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                            <FiLogOut className="mr-2" />
                            Back to Admin Panel
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                            <FiLogOut className="mr-2" />
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Navigation Bar */}
            <nav className="bg-indigo-900 text-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 overflow-x-auto">
                    <div className="flex space-x-2">
                        {screens.map(screen => (
                            <button
                                key={screen.id}
                                onClick={() => setCurrentScreen(screen.id)}
                                className={`flex items-center px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${currentScreen === screen.id
                                    ? 'bg-indigo-700 text-white shadow-lg'
                                    : 'text-indigo-100 hover:bg-indigo-700 hover:text-white'
                                    }`}
                            >
                                {screen.icon}
                                <span className="ml-2">{screen.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* ------------------------------------------------------Overview Screen------------------------------------- */}
                {currentScreen === 'overview' && (
                    <section className="space-y-8">
                        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8 tracking-tight">Overview</h2>
                        {overviewLoading ? (
                            <div className="text-center text-gray-600 dark:text-gray-300">Loading...</div>
                        ) : overviewError ? (
                            <div className="text-center text-red-600 dark:text-red-400">
                                {overviewError}
                                <button
                                    onClick={() => {
                                        setOverviewError(null);
                                        setOverviewLoading(true);
                                        fetchStats();
                                    }}
                                    className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                >
                                    Retry
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-xl p-6 flex items-center space-x-4 border border-gray-200/50 dark:border-gray-700/50 transform hover:scale-105 transition-transform duration-300">
                                        <div className="p-4 bg-indigo-100 dark:bg-indigo-900 rounded-full">
                                            <FiBook className="text-indigo-600 dark:text-indigo-400" size={28} />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Total Bookings</h3>
                                            <p className="text-3xl font-extrabold text-gray-900 dark:text-white">{overviewStats.bookings}</p>
                                        </div>
                                    </div>
                                    <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-xl p-6 flex items-center space-x-4 border border-gray-200/50 dark:border-gray-700/50 transform hover:scale-105 transition-transform duration-300">
                                        <div className="p-4 bg-green-100 dark:bg-green-900 rounded-full">
                                            <FiHome className="text-green-600 dark:text-green-400" size={28} />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Total Hotels</h3>
                                            <p className="text-3xl font-extrabold text-gray-900 dark:text-white">{overviewStats.hotels}</p>
                                        </div>
                                    </div>
                                    <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-xl p-6 flex items-center space-x-4 border border-gray-200/50 dark:border-gray-700/50 transform hover:scale-105 transition-transform duration-300">
                                        <div className="p-4 bg-yellow-100 dark:bg-yellow-900 rounded-full">
                                            <FiMap className="text-yellow-600 dark:text-yellow-400" size={28} />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Total Locations</h3>
                                            <p className="text-3xl font-extrabold text-gray-900 dark:text-white">{overviewStats.locations}</p>
                                        </div>
                                    </div>
                                    <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-xl p-6 flex items-center space-x-4 border border-gray-200/50 dark:border-gray-700/50 transform hover:scale-105 transition-transform duration-300">
                                        <div className="p-4 bg-purple-100 dark:bg-purple-900 rounded-full">
                                            <FiTag className="text-purple-600 dark:text-purple-400" size={28} />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Available Coupons</h3>
                                            <p className="text-3xl font-extrabold text-gray-900 dark:text-white">{overviewStats.coupons}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-xl p-6 backdrop-blur-md">
                                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Statistics Overview (Bar)</h3>
                                        <div className="h-64">
                                            <Bar data={overviewChartData} options={barOptions} />
                                        </div>
                                    </div>
                                    <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-xl p-6 backdrop-blur-md">
                                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Statistics Breakdown (Doughnut)</h3>
                                        <div className="h-64">
                                            <Doughnut data={overviewChartData} options={doughnutOptions} />
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </section>
                )}

                {/*----------------------------------------------- Revenue Screen -----------------------------------------------*/}
                {currentScreen === 'revenue' && (
                    <section className="space-y-8">
                        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8 tracking-tight">Revenue</h2>
                        {revenueLoading ? (
                            <div className="text-center text-gray-600 dark:text-gray-300">Loading...</div>
                        ) : revenueError ? (
                            <div className="text-center text-red-600 dark:text-red-400">
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
                            <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-xl p-6 backdrop-blur-md">
                                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
                                    {isAdmin ? "Total Revenue (All Bookings)" : "Your Total Revenue (Your Bookings)"}
                                </h3>
                                <div className="mb-6">
                                    <p className="text-3xl font-extrabold text-gray-900 dark:text-white">
                                        ₹{revenueData.totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </p>
                                </div>
                                {/*----------------------------------------------- Revenue Filters----------------------------------------------- */}
                                <div className="mb-8 flex flex-wrap gap-4">
                                    <div>
                                        <label className="block text-gray-700 dark:text-gray-300 mb-2">Start Date</label>
                                        <input
                                            type="date"
                                            value={revenueFilters.startDate}
                                            onChange={e => setRevenueFilters({ ...revenueFilters, startDate: e.target.value })}
                                            className="w-full max-w-xs px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 dark:text-gray-300 mb-2">End Date</label>
                                        <input
                                            type="date"
                                            value={revenueFilters.endDate}
                                            onChange={e => setRevenueFilters({ ...revenueFilters, endDate: e.target.value })}
                                            className="w-full max-w-xs px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 dark:text-gray-300 mb-2">State</label>
                                        <select
                                            value={revenueFilters.state}
                                            onChange={e => setRevenueFilters({ ...revenueFilters, state: e.target.value })}
                                            className="w-full max-w-xs px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                                        >
                                            <option value="">All States</option>
                                            {uniqueStates.map(state => (
                                                <option key={state} value={state}>{state}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 dark:text-gray-300 mb-2">City</label>
                                        <select
                                            value={revenueFilters.city}
                                            onChange={e => setRevenueFilters({ ...revenueFilters, city: e.target.value })}
                                            className="w-full max-w-xs px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                                        >
                                            <option value="">All Cities</option>
                                            {uniqueCities.map(city => (
                                                <option key={city} value={city}>{city}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 dark:text-gray-300 mb-2">Hotel</label>
                                        <select
                                            value={revenueFilters.hotel}
                                            onChange={e => setRevenueFilters({ ...revenueFilters, hotel: e.target.value })}
                                            className="w-full max-w-xs px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                                        >
                                            <option value="">All Hotels</option>
                                            {uniqueHotels.map(hotel => (
                                                <option key={hotel} value={hotel}>{hotel}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <button
                                        onClick={() => setRevenueFilters({ startDate: '', endDate: '', state: '', city: '', hotel: '' })}
                                        className="flex items-center mt-8 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-200"
                                    >
                                        <FiRefreshCw className="mr-2" />
                                        Reset Filters
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="text-md font-semibold text-gray-600 dark:text-gray-300 mb-2">Revenue Trend Over Time</h4>
                                        <div className="h-64">
                                            <Line data={revenueTrendChartData} options={revenueTrendOptions} />
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-md font-semibold text-gray-600 dark:text-gray-300 mb-2">Revenue by State</h4>
                                        <div className="h-64">
                                            <Bar data={revenueByStateChartData} options={revenueChartOptions} />
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-md font-semibold text-gray-600 dark:text-gray-300 mb-2">Revenue by City</h4>
                                        <div className="h-64">
                                            <Bar data={revenueByCityChartData} options={revenueChartOptions} />
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-md font-semibold text-gray-600 dark:text-gray-300 mb-2">Revenue by Hotel</h4>
                                        <div className="h-64">
                                            <Bar data={revenueByHotelChartData} options={revenueChartOptions} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>
                )}

                {/* -----------------------------------------------Users Screen ----------------------------------------------- */}
                {currentScreen === 'profile' && (
                    <section className="space-y-8">
                        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8 tracking-tight">All Users</h2>
                        {profileLoading ? (
                            <div className="text-center text-gray-600 dark:text-gray-300">Loading...</div>
                        ) : profileError ? (
                            <div className="text-center text-red-600 dark:text-red-400">{profileError}</div>
                        ) : (
                            <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-xl overflow-x-auto backdrop-blur-md">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-100/80 dark:bg-gray-700/80">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Name</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Email</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Role</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white/50 dark:bg-gray-800/50 divide-y divide-gray-200 dark:divide-gray-700">
                                        {profileUsers.length > 0 ? (
                                            profileUsers.map(user => (
                                                <tr key={user._id} className="hover:bg-gray-50/80 dark:hover:bg-gray-700/80 transition-colors duration-200">
                                                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-200">
                                                        {user.firstname} {user.lastname}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-200">{user.email}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-200">{user.role}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-200">{user.isDisabled ? 'Disabled' : 'Active'}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3" className="px-6 py-4 text-center text-gray-700 dark:text-gray-200">
                                                    No users found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>
                )}

                {/* ----------------------------------------------- Users Screen (Admin Only) ----------------------------------------------- */}
                {currentScreen === 'users' && isAdmin && (
                    <section className="space-y-8">
                        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8 tracking-tight">Users</h2>
                        {usersLoading ? (
                            <div className="text-center text-gray-600 dark:text-gray-300">Loading...</div>
                        ) : usersError ? (
                            <div className="text-center text-red-600 dark:text-red-400">{usersError}</div>
                        ) : (
                            <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-xl overflow-x-auto backdrop-blur-md">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-100/80 dark:bg-gray-700/80">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Name</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Email</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Role</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white/50 dark:bg-gray-800/50 divide-y divide-gray-200 dark:divide-gray-700">
                                        {users.length > 0 ? (
                                            users.map(user => (
                                                <tr key={user._id} className="hover:bg-gray-50/80 dark:hover:bg-gray-700/80 transition-colors duration-200">
                                                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-200">
                                                        {user.firstname} {user.lastname}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-200">{user.email}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-200">{user.role}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3" className="px-6 py-4 text-center text-gray-700 dark:text-gray-200">
                                                    No users found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>
                )}

                {/* ------------------------------------------------------ Bookings Screen ----------------------------------------------- */}
                {currentScreen === 'bookings' && (
                    <section className="space-y-8">
                        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8 tracking-tight">Bookings</h2>
                        {bookingsLoading ? (
                            <div className="text-center text-gray-600 dark:text-gray-300">Loading...</div>
                        ) : bookingsError ? (
                            <div className="text-center text-red-600 dark:text-red-400">{bookingsError}</div>
                        ) : (
                            <>
                                {/* ------------------------------------------------------ Bookings Filters ----------------------------------------------- */}
                                <div className="mb-6 flex flex-wrap gap-4">
                                    <div>
                                        <label className="block text-gray-700 dark:text-gray-300 mb-2">Status</label>
                                        <select
                                            value={bookingsFilters.status}
                                            onChange={e => setBookingsFilters({ ...bookingsFilters, status: e.target.value })}
                                            className="w-full max-w-xs px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                                        >
                                            <option value="">All Statuses</option>
                                            {uniqueBookingStatuses.map(status => (
                                                <option key={status} value={status}>{status}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 dark:text-gray-300 mb-2">Hotel</label>
                                        <select
                                            value={bookingsFilters.hotel}
                                            onChange={e => setBookingsFilters({ ...bookingsFilters, hotel: e.target.value })}
                                            className="w-full max-w-xs px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                                        >
                                            <option value="">All Hotels</option>
                                            {uniqueBookingHotels.map(hotel => (
                                                <option key={hotel} value={hotel}>{hotel}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 dark:text-gray-300 mb-2">Start Date</label>
                                        <input
                                            type="date"
                                            value={bookingsFilters.startDate}
                                            onChange={e => setBookingsFilters({ ...bookingsFilters, startDate: e.target.value })}
                                            className="w-full max-w-xs px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 dark:text-gray-300 mb-2">End Date</label>
                                        <input
                                            type="date"
                                            value={bookingsFilters.endDate}
                                            onChange={e => setBookingsFilters({ ...bookingsFilters, endDate: e.target.value })}
                                            className="w-full max-w-xs px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 dark:text-gray-300 mb-2">Search</label>
                                        <div className="relative">
                                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                value={bookingsFilters.search}
                                                onChange={e => setBookingsFilters({ ...bookingsFilters, search: e.target.value })}
                                                placeholder="Search by ID or Hotel"
                                                className="w-full max-w-xs pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setBookingsFilters({ status: '', hotel: '', startDate: '', endDate: '', search: '' })}
                                        className="flex items-center mt-8 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-200"
                                    >
                                        <FiRefreshCw className="mr-2" />
                                        Reset Filters
                                    </button>
                                </div>
                                <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-xl overflow-x-auto backdrop-blur-md">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-100/80 dark:bg-gray-700/80">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                                    Booking ID
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                                    Hotel
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider cursor-pointer" onClick={() => setBookingsSort({ field: 'checkIn', order: bookingsSort.order === 'asc' ? 'desc' : 'asc' })}>
                                                    Check-in {bookingsSort.field === 'checkIn' && (bookingsSort.order === 'asc' ? '↑' : '↓')}
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider cursor-pointer" onClick={() => setBookingsSort({ field: 'checkOut', order: bookingsSort.order === 'asc' ? 'desc' : 'asc' })}>
                                                    Check-out {bookingsSort.field === 'checkOut' && (bookingsSort.order === 'asc' ? '↑' : '↓')}
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                                    Status
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white/50 dark:bg-gray-800/50 divide-y divide-gray-200 dark:divide-gray-700">
                                            {paginatedBookings.length > 0 ? (
                                                paginatedBookings.map(booking => (
                                                    <tr key={booking._id} className="hover:bg-gray-50/80 dark:hover:bg-gray-700/80 transition-colors duration-200">
                                                        <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-200">{booking._id}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-200">{booking.roomId?.hotel?.name || 'N/A'}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-200">
                                                            {new Date(booking.checkIn).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-200">
                                                            {new Date(booking.checkOut).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-200">{booking.status}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="5" className="px-6 py-4 text-center text-gray-700 dark:text-gray-200">
                                                        No bookings found.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>

                                    <div className="flex justify-between items-center px-6 py-4">
                                        <button
                                            onClick={() => setBookingsPage(p => Math.max(p - 1, 1))}
                                            disabled={bookingsPage === 1}
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400"
                                        >
                                            Previous
                                        </button>
                                        <span className="text-gray-700 dark:text-gray-200">
                                            Page {bookingsPage} of {totalBookingPages}
                                        </span>
                                        <button
                                            onClick={() => setBookingsPage(p => Math.min(p + 1, totalBookingPages))}
                                            disabled={bookingsPage === totalBookingPages}
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </section>
                )}

        

                {/* ------------------------------------------------------ Hotels Screen ----------------------------------------------- */}
                {currentScreen === 'hotels' && (
                    <section className="space-y-8">
                        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8 tracking-tight">Hotels</h2>
                        {hotelsLoading ? (
                            <div className="text-center text-gray-600 dark:text-gray-300">Loading...</div>
                        ) : hotelsError ? (
                            <div className="text-center text-red-600 dark:text-red-400">{hotelsError}</div>
                        ) : (
                            <>
                                <div className="mb-6 flex flex-wrap gap-4">
                                    <div>
                                        <label className="block text-gray-700 dark:text-gray-300 mb-2">Select State</label>
                                        <select
                                            value={selectedHotelState}
                                            onChange={e => setSelectedHotelState(e.target.value)}
                                            className="w-full max-w-xs px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-White dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                                        >
                                            <option value="">Select State</option>
                                            {hotelsStates.map(state => (
                                                <option key={state._id} value={state._id}>
                                                    {state.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 dark:text-gray-300 mb-2">Select City</label>
                                        <select
                                            value={selectedHotelCity}
                                            onChange={e => setSelectedHotelCity(e.target.value)}
                                            className="w-full max-w-xs px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                                            disabled={!selectedHotelState}
                                        >
                                            <option value="">Select City</option>
                                            {hotelsCities.map(city => (
                                                <option key={city._id} value={city._id}>
                                                    {city.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 dark:text-gray-300 mb-2">Search Hotels</label>
                                        <div className="relative">
                                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                value={hotelsSearch}
                                                onChange={e => setHotelsSearch(e.target.value)}
                                                placeholder="Search by hotel name"
                                                className="w-full max-w-xs pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={fetchAllHotels}
                                        className="mt-8 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200"
                                    >
                                        View All Hotels
                                    </button>
                                    <button
                                        onClick={() => setHotelsSearch('')}
                                        className="mt-8 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-200 flex items-center"
                                    >
                                        <FiRefreshCw className="mr-2" />
                                        Reset Search
                                    </button>
                                </div>
                                <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-xl overflow-x-auto backdrop-blur-md">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-100/80 dark:bg-gray-700/80">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Name</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white/50 dark:bg-gray-800/50 divide-y divide-gray-200 dark:divide-gray-700">
                                            {paginatedHotels.length > 0 ? (
                                                paginatedHotels.map(hotel => (
                                                    <tr key={hotel._id} className="hover:bg-gray-50/80 dark:hover:bg-gray-700/80 transition-colors duration-200">
                                                        <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-200">{hotel.name}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td className="px-6 py-4 text-center text-gray-700 dark:text-gray-200">
                                                        No hotels found.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>

                                    <div className="flex justify-between items-center px-6 py-4">
                                        <button
                                            onClick={() => setHotelsPage(p => Math.max(p - 1, 1))}
                                            disabled={hotelsPage === 1}
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400"
                                        >
                                            Previous
                                        </button>
                                        <span className="text-gray-700 dark:text-gray-200">
                                            Page {hotelsPage} of {totalHotelPages}
                                        </span>
                                        <button
                                            onClick={() => setHotelsPage(p => Math.min(p + 1, totalHotelPages))}
                                            disabled={hotelsPage === totalHotelPages}
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </section>
                )}

                {/* ----------------------------------------------- Rooms Screen ----------------------------------------------- */}
                {currentScreen === 'rooms' && (
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
                )}

                {/*----------------------------------------------- Coupons Screen ----------------------------------------------- */}
                {currentScreen === 'coupons' && (
                    <section className="space-y-8">
                        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8 tracking-tight">Coupons</h2>
                        {couponsLoading ? (
                            <div className="text-center text-gray-600 dark:text-gray-300">Loading...</div>
                        ) : couponsError ? (
                            <div className="text-center text-red-600 dark:text-red-400">{couponsError}</div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-xl p-6 backdrop-blur-md">
                                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">All Coupons</h3>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                            <thead className="bg-gray-100/80 dark:bg-gray-700/80">
                                                <tr>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Code</th>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Discount</th>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white/50 dark:bg-gray-800/50 divide-y divide-gray-200 dark:divide-gray-700">
                                                {allCoupons.length > 0 ? (
                                                    allCoupons.map(coupon => (
                                                        <tr key={coupon._id} className="hover:bg-gray-50/80 dark:hover:bg-gray-700/80 transition-colors duration-200">
                                                            <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-200">{coupon.code}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-200">{coupon.discount}%</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-200">
                                                                <span
                                                                    className={`px-2 py-1 rounded-full text-xs font-semibold ${coupon.isActive
                                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                                                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                                                        }`}
                                                                >
                                                                    {coupon.isActive ? 'Active' : 'Inactive'}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="3" className="px-6 py-4 text-center text-gray-700 dark:text-gray-200">
                                                            No coupons found.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-xl p-6 backdrop-blur-md">
                                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Available Coupons</h3>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                            <thead className="bg-gray-100/80 dark:bg-gray-700/80">
                                                <tr>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Code</th>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Discount</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white/50 dark:bg-gray-800/50 divide-y divide-gray-200 dark:divide-gray-700">
                                                {availableCoupons.length > 0 ? (
                                                    availableCoupons.map(coupon => (
                                                        <tr key={coupon._id} className="hover:bg-gray-50/80 dark:hover:bg-gray-700/80 transition-colors duration-200">
                                                            <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-200">{coupon.code}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-200">{coupon.discount}%</td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="2" className="px-6 py-4 text-center text-gray-700 dark:text-gray-200">
                                                            No available coupons found.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>
                )}
            </main>
        </div>
    );
};

export default UserDashboard;