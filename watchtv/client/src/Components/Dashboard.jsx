import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { watchtv, Profile, RedOne, watchtv_icon, Movies } from '../assets/Pictures';
import '../Styles/Dashboard.css';

function Dashboard() {
    return (
        <div className="dashboard-fullscreen-container">
            <nav className="navbar">
                <div className="dashboard-text-overlay">
                    <img src={watchtv} alt="tvicon" className="dashboard-tv-icon" />
                    <h1>WatchTV</h1>
                </div>
                <div className="nav-links">
                    <a href="#">Home</a>
                    <a href="#">Genre</a>
                    <a href="#">WatchList</a>
                    <input type="text" placeholder="Search.." className="search" />
                    <FontAwesomeIcon icon={faSearch} className="search-icon" />
                    <input type="checkbox" id="toggle" />
                    <div className="display">
                        <label htmlFor="toggle">
                            <div className="circle"></div>
                        </label>
                    </div>
                    <div className="profile">
                        <img src={Profile} alt="profile" />
                    </div>
                </div>
            </nav>
            <div className="Banner">
                <img src={RedOne} alt="Movie" />
            </div>
            <div className="Mov-Shows">
                <p>
                    <img src={Movies} alt="Movie_Icon" />
                    <a href="#">Movies</a>
                    <img src={watchtv_icon} alt="Show_Icon" />
                    <a href="#">Shows</a>
                </p>
            </div>
            <div className="View">
                <div className="block"></div>
                <div className="block"></div>
                <div className="block"></div>
                <div className="block"></div>
                <div className="block"></div>
                <div className="block"></div>
                <div className="block"></div>
                <div className="block"></div>
                <div className="block"></div>
                <div className="block"></div>
                <div className="block"></div>
                <div className="block"></div>
            </div>
        </div>
    );
}

export default Dashboard;
