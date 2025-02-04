import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import '../Styles/Content.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark as faBookmarkSolid } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as faBookmarkRegular } from '@fortawesome/free-regular-svg-icons';

const Content = ({  }) => {
  const { contentId } = useParams();
  const [content, setContent] = useState(null);

  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState(null);
  const [message, setMessage] = useState('');
  const [inWatchlist, setInWatchlist] = useState(false);
  const navigate = useNavigate();

  const handleWatchlist = () => {
    if (inWatchlist) {
      setMessage('Removed from Watchlist');
    } else {
      setMessage('Added to Watchlist');
    }
    setInWatchlist(!inWatchlist);
    setTimeout(() => setMessage(''), 3000);
  };

  const fetchContent = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/content/${contentId}`);
      setContent(response.data);
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  };

  useEffect(() => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
        if (darkMode) {
            document.body.classList.add('dark-mode');
        }
        fetchContent();
    
  }, [contentId]);

  if (!content) {
    return <div>Loading...</div>;
  }
  

  const handleEditContent = () => {
    navigate('/edit-content');
  };

  const handleHome = () => {
    navigate('/dashboard');
  };

  return (
    <div className="content-container">
      <div className="content-about-container">
        <div className="content-card">
          <div className="content-left-section">
            <div className="content-poster">
              <img src={content.poster} alt={`${content.name} Poster`} className="content-image" />
            </div>
            <div className="content-username">
              <img src="https://picsum.photos/30" alt="Profile" className="content-profile-picture" />
              <span>{content.uploaded_by}</span>
            </div>
            <button className="watchlist-btn" onClick={handleWatchlist}>
              <FontAwesomeIcon icon={inWatchlist ? faBookmarkSolid : faBookmarkRegular} /> Add to Watchlist
            </button>
          </div>
          <div className="content-right-section">
            <div className="content-info-section">
              <div className='home-edit-content'>
                <span id='home-kind'><span className='home' onClick={handleHome}>Home</span>&middot;<span>Kind</span></span>
                <button className='edit-content' onClick={handleEditContent}>Edit Content</button>
              </div>
            </div>
            <span><span className="content-name">{content.name}</span>
              <span className="rating">⭐ {content.rating}</span>
              <span className="votes">({content.rates} people rated)</span></span>
            <p className="description">{content.description}</p>
          </div>
        </div>
      </div>
      <div className="content-stats">
        <div>
          <p>Released Date: {content.releaseDate}</p>
          <p>Duration: {content.duration}</p>
          <p>Genres: {content.genres ? content.genres.join(', ') : 'N/A'}</p>
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
      {message && <div className="message">{message}</div>}
    </div>
  );
};





export default Content;