import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import '../Styles/Content.css';
import axios from '../api/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark as faBookmarkSolid, faStar } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as faBookmarkRegular } from '@fortawesome/free-regular-svg-icons';

const Content = () => {
  const { contentId } = useParams();
  const [content, setContent] = useState(null);
  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState(null);
  const [message, setMessage] = useState('');
  const [inWatchlist, setInWatchlist] = useState(false);
  const [loading, setLoading] = useState(true); // ✅ Added loading state

  const navigate = useNavigate();

  // ✅ Fetch content data
  useEffect(() => {
    const fetchContent = async () => {
      if (!contentId) return; // ✅ Prevents unnecessary API calls

      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/content/${contentId}`);
        setContent(response.data);
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setLoading(false); // ✅ Set loading to false after API call
      }
    };
    fetchContent();
  }, [contentId]);

  // ✅ Apply Dark Mode (Runs once)
  useEffect(() => {
    if (localStorage.getItem('darkMode') === 'true') {
      document.body.classList.add('dark-mode');
    }
  }, []);

  // ✅ Check if content is in the watchlist
  // useEffect(() => {
  //   const checkWatchlistStatus = async () => {
  //     try {
  //       const token = localStorage.getItem("token");
  //       if (!token) return;

  //       const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/watchlist`, {
  //         headers: { Authorization: `Bearer ${token}` }
  //       });

  //       const watchlist = response.data.watchlist || [];
  //       setInWatchlist(watchlist.some(item => item.content_id === parseInt(contentId)));
  //     } catch (error) {
  //       console.error("Error checking watchlist status:", error);
  //     }
  //   };

  //   if (contentId) {
  //     checkWatchlistStatus();
  //   }
  // }, [contentId]);

  // ✅ Handle watchlist actions
  const handleWatchlist = async () => {
    try {
      const token = localStorage.getItem("token");
  
      if (!token) {
        console.log("No token found in localStorage.");
        setMessage("Please log in to manage your watchlist.");
        return;
      }
  
      console.log("Token found:", token); // Debugging
  
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
  
      let response;
      if (inWatchlist) {
        response = await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/watchlist/${contentId}`,
          { headers }
        );
  
        if (response.status === 200) {
          setInWatchlist(false);
          setMessage("Removed from Watchlist");
        }
      } else {
        response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/watchlist/${contentId}`,
          {},
          { headers }
        );
  
        if (response.status === 201) {
          setInWatchlist(true);
          setMessage("Added to Watchlist");
        }
      }
    } catch (error) {
      console.error("Error updating watchlist:", error.response?.data || error);
      setMessage("Could not update watchlist. Please try again.");
    } finally {
      setTimeout(() => setMessage(''), 3000);
    }
  };
  

  // ✅ Redirects
  const handleEditContent = (contentId) => {
    if (typeof contentId === 'object') {
      console.error('Invalid contentId:', contentId);
      return;
    }
    navigate(`/edit-content/${contentId.toString()}`);
  };
  
  
  const handleHome = () => navigate('/dashboard');

  // ✅ Show loading state while fetching content
  if (loading) {
    return <p>Loading...</p>;
  }

  // ✅ Prevents accessing `content` properties before data is loaded
  if (!content) {
    return <p>Content not found.</p>;
  }

  return (
    <div className="content-container">
      <div className="content-about-container">
        <div className="content-card">
          <div className="content-left-section">
            <div className='content-poster-section'>
            <div className="content-poster">
              <img 
                src={`${import.meta.env.VITE_API_URL}${content.image_path}`} 
                alt={content.title} 
                className="content-image" 
              />
            </div>
            <div className="content-username">
              <img 
                src={content.profile_picture ? `${import.meta.env.VITE_API_URL}${content.profile_picture}` : "https://picsum.photos/30"} 
                alt="Profile" 
                className="content-profile-picture" 
              />
              <span>{content.username}</span>
            </div>
            </div>
            <button className="watchlist-btn" onClick={handleWatchlist}>
              <FontAwesomeIcon icon={inWatchlist ? faBookmarkSolid : faBookmarkRegular} /> 
              {inWatchlist ? ' Remove from Watchlist' : ' Add to Watchlist'}
            </button>
            
            <div className='content-stats'>
          <p>Released Date: {new Date(content.released_date).toISOString().split('T')[0]}</p>
          <p>Duration: {content.duration_minutes} minutes</p>
          <p>Genres: {Array.isArray(content.genres) ? content.genres.map(g => g.name).join(', ') : 'N/A'}</p>
          <span>Rate: </span>
          <div className="rating-section">
            {[1, 2, 3, 4, 5].map((value) => (
              <span
                key={value}
                className={`star ${value <= (hover || rating) ? 'selected' : ''}`}
                onClick={() => setRating(value)}
                onMouseEnter={() => setHover(value)}
                onMouseLeave={() => setHover(null)}
              >
                ★
              </span>
            ))}
          </div>
        </div>
          </div>
          <div className="content-right-section">
            <div className="content-info-section">
              <div className="home-edit-content">
                <span id="home-kind">
                  <span className="home" onClick={handleHome}>Home</span>&middot;<span>{content.kind}</span>
                </span>
                {/* <button  onClick={handleEditContent}>Edit Content</button> */}
                <button className="edit-content" onClick={() => handleEditContent(contentId)}>Edit Content</button>
              </div>
            </div>
            <span>
              <span className="content-name">{content.title}</span>
              <span className="rating"> <FontAwesomeIcon icon={faStar} className="star-icon"/>{content.rating || "N/A"} </span>
              <span className="votes">({content.rates || "0"} people rated)</span>
            </span>
            <p className="description">{content.description}</p>
          </div>
        </div>
      </div>
      {/* <div className="content-stats">
        <div>
          <p>Released Date: {new Date(content.released_date).toISOString().split('T')[0]}</p>
          <p>Duration: {content.duration_minutes} minutes</p>
          <p>Genres: {Array.isArray(content.genres) ? content.genres.map(g => g.name).join(', ') : 'N/A'}</p>
          <span>Rate: </span>
          <div className="rating-section">
            {[1, 2, 3, 4, 5].map((value) => (
              <span
                key={value}
                className={`star ${value <= (hover || rating) ? 'selected' : ''}`}
                onClick={() => setRating(value)}
                onMouseEnter={() => setHover(value)}
                onMouseLeave={() => setHover(null)}
              >
                ★
              </span>
            ))}
          </div>
        </div>
      </div> */}
      {message && <div className="message">{message}</div>}
    </div>
  );
};

export default Content;
