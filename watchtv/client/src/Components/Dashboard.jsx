import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { faSearch, faBars, faTimes, faStar } from '@fortawesome/free-solid-svg-icons';
import { watchtv, Profile, RedOne, watchtv_icon, Movies } from '../assets/Pictures';
import '../Styles/Dashboard.css';
import axios from '../api/axios';


function Dashboard() {
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [isGenreDropdownVisible, setGenreDropdownVisible] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isMobileMenuVisible, setIsMobileMenuVisible] = useState(false);
    const [movies, setMovies] = useState([]); // State to hold movie/show data
    const [genres, setGenres] = useState([]); // State to hold fetched genres

    const dropdownRef = useRef(null);
    const genredropdownRef = useRef(null);
    const mobileMenuRef = useRef(null);
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);
    const slideInterval = useRef(null);


    const images = [
        "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://th.bing.com/th/id/OIP.rdE9srFu8KREbfQaTc_ppwHaE6?rs=1&pid=ImgDetMain",
        "https://images.unsplash.com/photo-1631805249874-3f546d176de4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bW92aWUlMjBwb3N0ZXJ8ZW58MHx8MHx8fDA%3D"    
        ];

    
    useEffect(() => {
        // Fetch genres from the backend
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

    // Fetch movies from the backend
    useEffect(() => {
        const fetchMovies = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/movies`);
            setMovies(response.data); // Assuming the response is an array of movie objects
        } catch (error) {
            console.error('Failed to fetch movies:', error);
        }
        };

        fetchMovies();
    }, []);
    
    
    const toggleGenreDropdown = () => {
        setGenreDropdownVisible((prev) => !prev);
    };

    const toggleDropdown = () => {
        setDropdownVisible((prev) => !prev);
    };

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

    const handleupload = () => {
        // Simulate file upload
        if(handleupload){
            navigate('/upload');
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % images.length);
    };
    
    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
    };
    
    useEffect(() => {
        slideInterval.current = setInterval(nextSlide, 10000);
        return () => clearInterval(slideInterval.current);
    }, []);


    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 3000 },
            items: 5
        },
        LargeDesktop:{
            breakpoint: { max: 3000, min: 1200 },
            items: 4
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 3
        },
        tablet: {
            breakpoint: { max: 1024, min: 164 },
            items: 2
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1
        }
    };

    return (
        <div className="dashboard-fullscreen-container">
            <nav className="navbar">
                <div className="dashboard-text-overlay">
                    <img src={watchtv} alt="TV icon" className={`dashboard-tv-icon`} />
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
                                    {genres.slice(0, Math.ceil(genres.length / 2)).map((genre, index) => (
                                        <a href="#" key={index}>{genre.name}</a>
                                    ))}
                                </div>
                                <div className="genre-column">
                                    {genres.slice(Math.ceil(genres.length / 2)).map((genre, index) => (
                                        <a href="#" key={index}>{genre.name}</a>
                                    ))}
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
            
            <div className="dashboard-container">
                <div className="Banner">
                    <div className="slider" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                        {images.map((src, index) => (
                            <div className="slide" key={index}>
                                <img src={src} alt={`Slide ${index + 1}`} />
                            </div>
                        ))}
                    </div>
                    <button className="prev" onClick={prevSlide}>&#10094;</button>
                    <button className="next" onClick={nextSlide}>&#10095;</button>
                </div>
                


                <div className="Mov-Shows">
                    <p>
                        <img src={Movies} alt="Movie Icon" className={isDarkMode ? 'invert' : ''} />
                        <a href="#">Movies</a>
                        <img src={watchtv_icon} alt="Show Icon" className={isDarkMode ? 'invert' : ''}/>
                        <a href="#">Shows</a>
                    </p>
                    <button className="upload-button" onClick={handleupload}><span>+   </span>Upload</button>
                </div>

                <div className="View">
                    {movies.map((movie,index) => (
                        <div key={`${movie.id}-${index}`} className="block">
                             <img src={`${import.meta.env.VITE_API_URL}${movie.image_path}`} alt={movie.title} className="block-image" />
                            <div className="block-details">
                                <div className="block-rating">
                                    <FontAwesomeIcon icon={faStar} className="star-icon" />
                                    <span>{movie.rating || "N/A"}</span>
                                    <div className="block-date"> {new Date(movie.released_date).toISOString().split('T')[0]}</div>
                                </div>
                                <div className="block-name">{movie.title}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;