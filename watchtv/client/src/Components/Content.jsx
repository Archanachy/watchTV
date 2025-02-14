import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import '../Styles/Content.css';
import axios from '../api/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark as faBookmarkSolid } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as faBookmarkRegular } from '@fortawesome/free-regular-svg-icons';

const Content = () => {
  const { contentId } = useParams();
  const [content, setContent] = useState(null);
  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState(null);
  const [message, setMessage] = useState('');
  const [inWatchlist, setInWatchlist] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // ✅ Handle Rating Submission
const handleRating = async (value) => {
  try {
    setRating(value); // Instantly update UI before sending request
    setLoading(true); // Start loading state

    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/rating/${contentId}`,
      { rating: value },
      { headers: { "Authorization": `Bearer ${token}` } }
    );

    // ✅ Update UI with new rating & average rating
    setContent((prevContent) => ({
      ...prevContent,
      average_rating: response.data.average_rating || prevContent.average_rating, // Fallback for undefined
      total_ratings: response.data.total_ratings || prevContent.total_ratings // Fallback for undefined
    }));

    // Update the user's rating after submission
    setRating(response.data.user_rating || value);  // Using the response from POST or fallback to current value

    setMessage(response.data.message); // Show success message
  } catch (error) {
    setMessage("Could not submit rating. Please try again.");
  } finally {
    setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
    setLoading(false); // Stop loading state
  }
};


  // ✅ Fetch Content Data
  useEffect(() => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
        document.body.classList.add('dark-mode');
    }
    const fetchContent = async () => {
      if (!contentId) return;

      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/content/${contentId}`);
        setContent(response.data);

        // ✅ Load user's existing rating (if available)
        const token = localStorage.getItem('token');
        if (token) {
          const ratingResponse = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/ratings/${contentId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setRating(ratingResponse.data.rating || null);
        }
        
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [contentId]);

  // ✅ Fetch Watchlist Status
  useEffect(() => {
    const fetchWatchlistStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/watchlist/${contentId}`,
          { headers: { "Authorization": `Bearer ${token}` } }
        );
        setInWatchlist(response.data.inWatchlist);
      } catch (error) {
        console.error('Error fetching watchlist status:', error);
      }
    };

    if (contentId) {
      fetchWatchlistStatus();
    }
  }, [contentId]);

  // ✅ Handle Watchlist
  const handleWatchlist = async () => {
    try {
      const token = localStorage.getItem('token');
      let response;

      if (inWatchlist) {
        response = await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/watchlist/${contentId}`,
          { headers: { "Authorization": `Bearer ${token}` } }
        );
        if (response.status === 200) {
          setInWatchlist(false);
          setMessage("Removed from Watchlist");
        }
      } else {
        response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/watchlist/${contentId}`,
          {},
          { headers: { "Authorization": `Bearer ${token}` } }
        );
        if (response.status === 201) {
          setInWatchlist(true);
          setMessage("Added to Watchlist");
        }
      }
    } catch (error) {
      console.error("Error updating watchlist:", error);
      setMessage("Could not update watchlist. Please try again.");
    } finally {
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // ✅ Redirect Functions
  const handleEditContent = () => navigate(`/edit-content/${contentId}`);
  const handleHome = () => navigate('/dashboard');

  // ✅ Loading State
  if (loading) return <p>Loading...</p>;
  if (!content) return <p>Content not found.</p>;

  return (
    <div className="content-container">
      <div className="content-about-container">
        <div className="content-card">
          <div className="content-left-section">
            <div className='content-poster-section'>
            <div className="content-poster">
              <img src={`${import.meta.env.VITE_API_URL}${content.image_path}`} alt={content.title} className="content-image" />
            </div>
            <div className="content-username">
              <img src={content.profile_picture ? `${import.meta.env.VITE_API_URL}${content.profile_picture}` : "https://picsum.photos/30"} alt="Profile" className="content-profile-picture" />
              <span>{content.username}</span>
            </div>
            </div>
            <button className="watchlist-btn" onClick={handleWatchlist}>
              <FontAwesomeIcon icon={inWatchlist ? faBookmarkSolid : faBookmarkRegular} /> 
              {inWatchlist ? ' Remove from Watchlist' : ' Add to Watchlist'}
            </button>
          </div>
          <div className="content-right-section">
            <div className="content-info-section">
              <div className="home-edit-content">
                <span id="home-kind">
                  <span className="home" onClick={handleHome}>Home</span> &middot; <span>{content.kind}</span>
                </span>
                <button className="edit-content" onClick={handleEditContent}>Edit Content</button>
              </div>
            </div>
            <span>
              <span className="content-name">{content.title}</span>
              <span className="rating">⭐ {content.average_rating ? Number(content.average_rating).toFixed(1) : "N/A"}</span>
              <span className="votes">({content.total_ratings || "0"} people rated)</span>
            </span>
            <p className="description">{content.description}</p>
          </div>
        </div>
      </div>
      <div className="content-stats">
        <p>Released Date: {new Date(content.released_date).toISOString().split('T')[0]}</p>
        <p>Duration: {content.duration_minutes} minutes</p>
        <p>Genres: {Array.isArray(content.genres) ? content.genres.map(g => g.name).join(', ') : 'N/A'}</p>
        <span>Rate: </span>
        <div className="rating-section">
          {[1, 2, 3, 4, 5].map((value) => (
            <span
              key={value}
              className={`star ${value <= (hover || rating) ? 'selected' : ''}`}
              onClick={() => handleRating(value)}
              onMouseEnter={() => setHover(value)}
              onMouseLeave={() => setHover(null)}
            >
              ★
            </span>
          ))}
        </div>

      </div>
      {message && <div className="message">{message}</div>}
    </div>
  );
};

export default Content;
