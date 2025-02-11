import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import Navbar from './Navbar';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import '../Styles/Dashboard.css';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/watchlist`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        console.log("Watchlist API Response:", response.data); // ✅ Debug log
        setWatchlist(response.data); // ✅ Set the watchlist correctly
      } catch (error) {
        console.error('Failed to fetch watchlist:', error);
      }
    };

    fetchWatchlist();
}, []);


  const handleContentClick = (contentId) => {
    navigate(`/content/${contentId}`);
  };

  return (
    <div className="watchlist-fullscreen-container">
      <Navbar />
      <div className="View">
        {watchlist.length > 0 ? (
          watchlist.map((item) => (
            <div key={item.content_id} className="block" onClick={() => handleContentClick(item.content_id)}>
              <img src={`${import.meta.env.VITE_API_URL}${item.image_path}`} alt={item.title} className="block-image" />
              <div className="block-details">
                <div className="block-rating">
                  <FontAwesomeIcon icon={faStar} className="star-icon" />
                  <span>{item.rating || "N/A"}</span>
                  <div className="block-date">{new Date(item.released_date).toISOString().split('T')[0]}</div>
                </div>
                <div className="block-name">{item.title}</div>
              </div>
            </div>
          ))
        ) : (
          <p>No items in your watchlist yet!</p>
        )}
      </div>
    </div>
  );
};

export default Watchlist;