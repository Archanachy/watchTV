import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { faSearch, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { watchtv, Profile, RedOne, watchtv_icon, Movies } from '../assets/Pictures';
import '../Styles/Dashboard.css';

function Dashboard() {
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [isGenreDropdownVisible, setGenreDropdownVisible] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isMobileMenuVisible, setIsMobileMenuVisible] = useState(false);

    const dropdownRef = useRef(null);
    const genredropdownRef = useRef(null);
    const mobileMenuRef = useRef(null);
    const navigate = useNavigate();

    const toggleGenreDropdown = () => {
        setGenreDropdownVisible((prev) => !prev);
    };

    const toggleDropdown = () => {
        setDropdownVisible((prev) => !prev);
    };

    const toggleDarkMode = () => {
        setIsDarkMode((prev) => !prev);
        document.body.classList.toggle('dark-mode');
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

    const handleLogout = () => {
        const confirmLogout = window.confirm("Are you sure you want to log out?");
        if (confirmLogout) {
            console.log("User logged out");
            navigate('/signin');
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div className="dashboard-fullscreen-container">
            <nav className="navbar">
                <div className="dashboard-text-overlay">
                    <img src={watchtv} alt="TV icon" className="dashboard-tv-icon" />
                    <h1>WatchTV</h1>
                </div>
                <div className={`nav-links ${isMobileMenuVisible ? 'mobile-menu' : ''}`} ref={mobileMenuRef}>
                    <a href="#">Home</a>

                    {/* Genre Dropdown */}
                    <div className="genre-container" ref={genredropdownRef}>
                        <button
                            className="genre-link"
                            onClick={(e) => {
                                e.preventDefault();
                                toggleGenreDropdown();
                            }}
                            aria-haspopup="true"
                            aria-expanded={isGenreDropdownVisible}
                        >
                            Genre
                            <span className={`arrow ${isGenreDropdownVisible ? 'up' : 'down'}`}></span>
                        </button>
                        {isGenreDropdownVisible && (
                            <div className="genre-dropdown">
                                <div className="genre-column">
                                    <a href="#">Action</a>
                                    <a href="#">Comedy</a>
                                    <a href="#">Drama</a>
                                    <a href="#">Horror</a>
                                    <a href="#">Romance</a>
                                    <a href="#">Sci-Fi/Fantasy</a>
                                </div>
                                <div className="genre-column">
                                    <a href="#">Thriller</a>
                                    <a href="#">Fantasy</a>
                                    <a href="#">Documentary</a>
                                    <a href="#">Animation</a>
                                    <a href="#">Mystery</a>
                                    <a href="#">Adventure</a>
                                </div>
                                
                            </div>
                        )}
                    </div>

                    <a href="#">WatchList</a>
                    <div className="search-container">
                        <input type="text" placeholder="Search.." className="search" />
                        <FontAwesomeIcon icon={faSearch} className="search-icon" />
                    </div>
                    <div className="toggle-container">
                        <input type="checkbox" id="toggle" onChange={toggleDarkMode} checked={isDarkMode} />
                        <label htmlFor="toggle" className="toggle-label">
                            <span className="toggle-slider"></span>
                        </label>
                    </div>

                    {/* Profile Dropdown */}
                    <div className="profile" ref={dropdownRef}>
                        <img
                            src={Profile}
                            alt="Profile"
                            className="profile-picture"
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleDropdown();
                            }}
                        />
                        {isDropdownVisible && (
                            <div className="dropdown-menu">
                                <button className="dropdown-item">Profile</button>
                                <button className="dropdown-item" onClick={handleLogout}>
                                    Log Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="mobile-menu-icon" onClick={toggleMobileMenu}>
                    <FontAwesomeIcon icon={isMobileMenuVisible ? faTimes : faBars} />
                </div>
            </nav>

            <div className="Banner">
                <img src={RedOne} alt="Movie" className="banner-image" />
            </div>

            <div className="Mov-Shows">
                <p>
                    <img src={Movies} alt="Movie Icon" />
                    <a href="#">Movies</a>
                    <img src={watchtv_icon} alt="Show Icon" />
                    <a href="#">Shows</a>
                </p>
                <button className="upload-button">+ Upload</button>
            </div>

            <div className="View">
                {[...Array(12)].map((_, index) => (
                    <div key={index} className="block"></div>
                ))}
            </div>
        </div>
    );
}

export default Dashboard;