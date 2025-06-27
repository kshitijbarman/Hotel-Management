
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaVenusMars, FaCalendarAlt, FaLock, FaSignOutAlt, FaEdit, FaSave, FaTimes, FaCamera, FaSun, FaMoon } from 'react-icons/fa';
import useDarkMode from '../hooks/useDarkMode';



const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    gender: '',
    age: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedBackgroundImage, setSelectedBackgroundImage] = useState("");
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDarkMode, toggleMode] = useDarkMode();

  const baseURL = 'https://hotel-management-backend-rgpk.onrender.com';

  // Predefined list of background images--------------------------------------------------
  const backgroundImages = [

    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8bHV4dXJ5JTIwaG90ZWx8ZW58MHx8MHx8fDA%3D",

    "https://images.unsplash.com/photo-1723119832675-0031e0f0408c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGx1eHVyeSUyMGhvdGVsfGVufDB8fDB8fHww",
    "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bHV4dXJ5JTIwaG90ZWx8ZW58MHx8MHx8fDA%3D",
  ];

  const fetchUser = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found. Please log in.');
      }
      const response = await axios.get(`${baseURL}/user/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = response.data;
      console.log('user profile data', userData);

      setUser(userData);
      setFormData({
        firstname: userData.firstname || '',
        lastname: userData.lastname || '',
        email: userData.email || '',
        phone: userData.phone || '',
        gender: userData.gender || '',
        age: userData.age || '',
      });

      if (userData.profileImage) {
        setImagePreview(userData.profileImage);
      }
      setSelectedBackgroundImage(userData.backgroundImage || "");
    } catch (err) {
      console.error('fetchUser - Error:', err);
      setError(err.response?.data?.message || 'Failed to fetch user details.');
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) return;

    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('profileImage', imageFile);

      const response = await axios.post(`${baseURL}/user/me/profile-image`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess('Profile image updated successfully!');
      await fetchUser();
    } catch (err) {
      console.error('handleImageUpload - Error:', err);
      setError(err.response?.data?.message || 'Failed to upload profile image.');
    } finally {
      setLoading(false);
      setImageFile(null);
    }
  };

  const handleBackgroundImageChange = async (imageUrl) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }

      const response = await axios.patch(
        `${baseURL}/user/users/me/background`,
        { backgroundImage: imageUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser({ ...user, backgroundImage: response.data.backgroundImage });
      setSelectedBackgroundImage(imageUrl);
      setSuccess('Background image updated successfully!');

    
      window.dispatchEvent(new Event('backgroundImageUpdated'));
    } catch (err) {
      console.error("handleBackgroundImageChange - Error:", err);
      setError(err.response?.data?.message || "Failed to update background image.");
    }
  };

  const handleResetBackground = async () => {
    try {
      await handleBackgroundImageChange("");
      setSuccess('Background image reset successfully!');
    } catch (err) {
      console.error("handleResetBackground - Error:", err);
      setError(err.response?.data?.message || "Failed to reset background image.");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${baseURL}/user/me`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data.user);
      setIsEditing(false);
      setSuccess('Profile updated successfully!');

      if (imageFile) {
        await handleImageUpload();
      }
    } catch (err) {
      console.error('handleUpdate - Error:', err);
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  // const handlePasswordReset = async () => {
  //   setLoading(true);
  //   setError('');
  //   setSuccess('');
  //   try {
  //     const response = await axios.post(`${baseURL}/user/forgot`, { email: user.email });
  //     setSuccess('OTP sent to your email for password reset.');
  //     navigate('/reset-password');
  //   } catch (err) {
  //     console.error('handlePasswordReset - Error:', err);
  //     setError(err.response?.data?.message || 'Failed to initiate password reset.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handlePasswordReset = async () => {
  setLoading(true);
  setError('');
  setSuccess('');

  if (!user.email) {
    setError('Please enter your email address.');
    setLoading(false);
    return;
  }

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!isValidEmail(user.email)) {
    setError('Please enter a valid email address.');
    setLoading(false);
    return;
  }

  try {
    const response = await axios.post(`${baseURL}/user/forgot`, { email: user.email });
    console.log(response)
    setSuccess('OTP sent to your email for password reset.');
    navigate('/reset-password');
  } 
  catch (err) {
    console.error('handlePasswordReset - Error:', err);
    setError(err.response?.data?.message || 'Failed to initiate password reset.');
  } finally {
    setLoading(false);
  }
};


  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-black text-gray-100' : 'bg-white text-gray-900'} font-sans flex items-center justify-center py-12`}>
      <div className={`${isDarkMode ? 'bg-slate-800/90 text-gray-100' : 'bg-white text-gray-900'} backdrop-blur-md rounded-2xl shadow-xl p-8 w-full max-w-lg relative`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-blue-300' : 'text-blue-600'} flex items-center`}>
            <FaUser className="mr-2" /> My Profile
          </h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleMode}
              className={`${isDarkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors duration-200`}
              aria-label="Toggle theme"
            >
              {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
            </button>
            <button
              onClick={() => navigate(-1)}
              className={`${isDarkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-600 hover:text-red-600'} transition-colors duration-200`}
              aria-label="Go back"
            >
              <FaTimes size={20} />
            </button>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
          </div>
        )}

        {error && (
          <div className={`${isDarkMode ? 'bg-red-900/20 border-red-500/50' : 'bg-red-100 border-red-400'} border rounded-lg p-4 mb-6`}>
            <p className={`${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>{error}</p>
          </div>
        )}

        {success && (
          <div className={`${isDarkMode ? 'bg-green-900/20 border-green-500/50' : 'bg-green-100 border-green-400'} border rounded-lg p-4 mb-6`}>
            <p className={`${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>{success}</p>
          </div>
        )}

        {user && !loading && (
          <div className="space-y-6">
            {/* Profile Image Display */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                {imagePreview || user.profileImage ? (
                  <img
                    src={imagePreview || user.profileImage}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-lg"
                    onError={(e) => console.error("Image load error:", e)}
                  />
                ) : (
                  <div className={`${isDarkMode ? 'bg-slate-700 text-gray-400' : 'bg-gray-200 text-gray-500'} w-32 h-32 rounded-full flex items-center justify-center border-4 border-blue-500 shadow-lg`}>
                    <FaUser size={40} />
                  </div>
                )}
                {isEditing && (
                  <label
                    htmlFor="profileImage"
                    className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-500 transition-all duration-200"
                  >
                    <FaCamera className="text-white" />
                    <input
                      id="profileImage"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Background Image Selection */}
            <div className="space-y-4">
              <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>Select Background Image for Home Screen</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {backgroundImages.map((image, index) => (
                  <div
                    key={index}
                    className={`relative h-24 rounded-lg overflow-hidden cursor-pointer border-2 ${selectedBackgroundImage === image ? 'border-blue-500' : 'border-transparent'
                      }`}
                    onClick={() => handleBackgroundImageChange(image)}
                    role="button"
                    aria-label={`Select background image ${index + 1}`}
                  >
                    <img
                      src={image}
                      alt={`Background option ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <span className="text-white font-medium">Select</span>
                    </div>
                  </div>
                ))}
              </div>
              {selectedBackgroundImage && (
                <button
                  onClick={handleResetBackground}
                  className="mt-2 bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-md"
                >
                  Reset Background
                </button>
              )}
            </div>

            {!isEditing ? (
              <div className="space-y-4">
                <div className="flex items-center">
                  <FaUser className={`${isDarkMode ? 'text-blue-400' : 'text-blue-500'} mr-3`} />
                  <p>
                    <strong className={`${isDarkMode ? 'text-blue-200' : 'text-blue-600'}`}>Name:</strong> {user.firstname} {user.lastname}
                  </p>
                </div>
                <div className="flex items-center">
                  <FaEnvelope className={`${isDarkMode ? 'text-blue-400' : 'text-blue-500'} mr-3`} />
                  <p>
                    <strong className={`${isDarkMode ? 'text-blue-200' : 'text-blue-600'}`}>Email:</strong> {user.email}
                  </p>
                </div>
                <div className="flex items-center">
                  <FaPhone className={`${isDarkMode ? 'text-blue-400' : 'text-blue-500'} mr-3`} />
                  <p>
                    <strong className={`${isDarkMode ? 'text-blue-200' : 'text-blue-600'}`}>Phone:</strong> {user.phone || 'N/A'}
                  </p>
                </div>
                <div className="flex items-center">
                  <FaVenusMars className={`${isDarkMode ? 'text-blue-400' : 'text-blue-500'} mr-3`} />
                  <p>
                    <strong className={`${isDarkMode ? 'text-blue-200' : 'text-blue-600'}`}>Gender:</strong> {user.gender || 'N/A'}
                  </p>
                </div>
                <div className="flex items-center">
                  <FaCalendarAlt className={`${isDarkMode ? 'text-blue-400' : 'text-blue-500'} mr-3`} />
                  <p>
                    <strong className={`${isDarkMode ? 'text-blue-200' : 'text-blue-600'}`}>Age:</strong> {user.age || 'N/A'}
                  </p>
                </div>
                <div className="flex items-center">
                  <FaUser className={`${isDarkMode ? 'text-blue-400' : 'text-blue-500'} mr-3`} />
                  <p>
                    <strong className={`${isDarkMode ? 'text-blue-200' : 'text-blue-600'}`}>Role:</strong> {user.role || 'N/A'}
                  </p>
                </div>
                <div className="flex space-x-4 mt-6">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-md"
                  >
                    <FaEdit className="mr-2" /> Edit Profile
                  </button>
                  <button
                    onClick={handlePasswordReset}
                    className="flex items-center bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-md"
                  >
                    <FaLock className="mr-2" /> Change Password
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label htmlFor="firstname" className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
                    First Name
                  </label>
                  <div className="relative">
                    <input
                      id="firstname"
                      name="firstname"
                      type="text"
                      value={formData.firstname}
                      onChange={handleInputChange}
                      required
                      className={`${isDarkMode ? 'bg-slate-700/80 border-slate-600 text-gray-100' : 'bg-gray-100 border-gray-300 text-gray-900'} w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400`}
                    />
                    <FaUser className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                  </div>
                </div>
                <div>
                  <label htmlFor="lastname" className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
                    Last Name
                  </label>
                  <div className="relative">
                    <input
                      id="lastname"
                      name="lastname"
                      type="text"
                      value={formData.lastname}
                      onChange={handleInputChange}
                      required
                      className={`${isDarkMode ? 'bg-slate-700/80 border-slate-600 text-gray-100' : 'bg-gray-100 border-gray-300 text-gray-900'} w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400`}
                    />
                    <FaUser className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
                    Email
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className={`${isDarkMode ? 'bg-slate-700/80 border-slate-600 text-gray-100' : 'bg-gray-100 border-gray-300 text-gray-900'} w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400`}
                    />
                    <FaEnvelope className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                  </div>
                </div>
                <div>
                  <label htmlFor="phone" className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
                    Phone
                  </label>
                  <div className="relative">
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className={`${isDarkMode ? 'bg-slate-700/80 border-slate-600 text-gray-100' : 'bg-gray-100 border-gray-300 text-gray-900'} w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400`}
                    />
                    <FaPhone className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                  </div>
                </div>
                <div>
                  <label htmlFor="gender" className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
                    Gender
                  </label>
                  <div className="relative">
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className={`${isDarkMode ? 'bg-slate-700/80 border-slate-600 text-gray-100' : 'bg-gray-100 border-gray-300 text-gray-900'} w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400`}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    <FaVenusMars className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                  </div>
                </div>
                <div>
                  <label htmlFor="age" className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
                    Age
                  </label>
                  <div className="relative">
                    <input
                      id="age"
                      name="age"
                      type="number"
                      value={formData.age}
                      onChange={handleInputChange}
                      min="1"
                      max="120"
                      className={`${isDarkMode ? 'bg-slate-700/80 border-slate-600 text-gray-100' : 'bg-gray-100 border-gray-300 text-gray-900'} w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400`}
                    />
                    <FaCalendarAlt className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                  </div>
                </div>
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-md disabled:opacity-50"
                  >
                    <FaSave className="mr-2" /> {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setImageFile(null);
                      setImagePreview(user.profileImage || null);
                    }}
                    className={`flex items-center ${isDarkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-500 hover:bg-gray-400'} text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-md`}
                  >
                    <FaTimes className="mr-2" /> Cancel
                  </button>
                </div>
              </form>
            )}
            <button
              onClick={handleLogout}
              className="mt-6 flex items-center bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-md w-full justify-center"
            >
              <FaSignOutAlt className="mr-2" /> Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );



};

export default Profile;