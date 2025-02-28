import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { watchtv, defaultAvatar } from '../assets/Pictures';
import Search from './Search';
import '../Styles/Dashboard.css';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

// Helper function to get user role from JWT
// Helper function to get user role from JWT
const getUserRoleFromToken = () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    console.error('No token found in localStorage');
    return null; // Return null if no token is found
  }

  try {
    const decoded = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
    return decoded.role;
  } catch (error) {
    console.error('Error decoding token', error);
    return null; // Return null if token is invalid
  }
};


const Navbar = ({ setSelectedGenre, setFilterType, currentPage }) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [profilePic, setProfilePic] = useState(defaultAvatar);
  const [isGenreDropdownVisible, setGenreDropdownVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuVisible, setIsMobileMenuVisible] = useState(false);
  const [genres, setGenres] = useState([]);
  const dropdownRef = useRef(null);
  const genredropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const [userRole, setUserRole] = useState(null); // Store the user role here
  const navigate = useNavigate();

  const handleGenreSelect = (genre) => {
    setSelectedGenre(genre.genre_id);
    setGenreDropdownVisible(false); 
  };

  useEffect(() => {
    const role = getUserRoleFromToken(); // Get user role from token
    setUserRole(role);
  }, []);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/genres`);
        setGenres(response.data);
      } catch (error) {
        console.error('Failed to fetch genres:', error);
      }
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    // Fetch user profile data
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("authToken");
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/profile_Pic`, {
              headers: {
                "Authorization": `Bearer ${token}`, 
                "Content-Type": "application/json"
              }
            });
            const profilePicture = response.data.profilePicture;
        setProfilePic(profilePicture ? `${import.meta.env.VITE_API_URL}${profilePicture}` : defaultAvatar);
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };
    fetchUserProfile();
}, []);

  useEffect(() => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(darkMode);
    if (darkMode) {
      document.body.classList.add('dark-mode');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const newDarkMode = !prev;
      localStorage.setItem('darkMode', newDarkMode);
      document.body.classList.toggle('dark-mode', newDarkMode);
      return newDarkMode;
    });
  };

  const toggleGenreDropdown = () => {
    setGenreDropdownVisible((prev) => !prev);
  };

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuVisible((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownVisible(false);
    }
    if (genredropdownRef.current && !genredropdownRef.current.contains(event.target)) {
      setGenreDropdownVisible(false);
    }
    if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && !event.target.closest('.mobile-menu-icon')) {
      setIsMobileMenuVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      localStorage.removeItem("authToken"); // Remove token on logout
      navigate('/signin');
    }
  };

  const handleProfile = () => {
    navigate('/profile');
  };

  const handleHomeClick = (e) => {
    e.preventDefault();
    navigate('/dashboard');
    setSelectedGenre(null);
    setFilterType('movies');
  };

  const handleWatchlistClick = (e) => {
    e.preventDefault();
    navigate('/watchlist');
  };

  const handleUsersClick = (e) => {
    e.preventDefault();
    navigate('/users');
  };

  return (
    <nav className="navbar">
      <div className="dashboard-text-overlay">
        <img src={watchtv} alt="TV icon" className={`dashboard-tv-icon`} />
        <h1>WatchTV</h1>
      </div>

      <div className={`search-container ${currentPage === "users" ? "disabled" : ""}`}>
        <Search disabled={currentPage === "users"} />
        {currentPage === "users"}
      </div>

      <div className={`nav-links ${isMobileMenuVisible ? 'mobile-menu' : ''}`} ref={mobileMenuRef}>
        <a href='#' onClick={handleHomeClick}>Home</a>

        <div className={`genre-container ${currentPage === "users" ? "disabled" : ""}`} ref={genredropdownRef}>
          <button
            className="genre-link"
            onClick={(e) => {
              e.preventDefault();
              toggleGenreDropdown();
            }}
            aria-haspopup="true"
            aria-expanded={isGenreDropdownVisible}
            disabled={currentPage === "users"}
          >
            Genre
            <span className={`arrow ${isGenreDropdownVisible ? 'up' : 'down'}`}></span>
          </button>
          {isGenreDropdownVisible && (
            <div className="genre-dropdown">
              <div className="genre-column">
                {genres.slice(0, Math.ceil(genres.length / 2)).map((genre) => (
                  <a href="#" key={genre.genre_id} onClick={(e) => {
                    e.preventDefault();
                    handleGenreSelect(genre);
                  }}
                  disabled={currentPage === "users"}
                  >{genre.name}</a>
                ))}
              </div>
              <div className="genre-column">
                {genres.slice(Math.ceil(genres.length / 2)).map((genre) => (
                  <a href="#" key={genre.genre_id} onClick={(e) => {
                    e.preventDefault();
                    handleGenreSelect(genre);
                  }}>{genre.name}</a>
                ))}
              </div>
            </div>
          )}
          {currentPage === "users" }
        </div>

        {userRole === "admin" ? (
          <a href="#" onClick={handleUsersClick}>Users</a>
        ) : (
        <a href="#" onClick={handleWatchlistClick}>Watchlist</a>
        )}

        <div className="toggle-container">
          <input type="checkbox" id="toggle" onChange={toggleDarkMode} checked={isDarkMode} />
          <label htmlFor="toggle" className="toggle-label">
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="profile" ref={dropdownRef}>
          <img
            src={profilePic}
            alt="Profile"
            className="profile-picture"
            onClick={(e) => {
              e.stopPropagation();
              toggleDropdown();
            }}
          />
          {isDropdownVisible && (
            <div className="dropdown-menu">
              <button className="dropdown-item" onClick={handleProfile}>Profile</button>
              <button className="dropdown-item" onClick={handleLogout}>Log Out</button>
            </div>
          )}
        </div>
      </div>
      <div className="mobile-menu-icon" onClick={toggleMobileMenu}>
        <FontAwesomeIcon icon={isMobileMenuVisible ? faTimes : faBars} />
      </div>
    </nav>
  );
};

export default Navbar;