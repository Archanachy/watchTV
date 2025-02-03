import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import '../Styles/Content.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark as faBookmarkSolid } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as faBookmarkRegular } from '@fortawesome/free-regular-svg-icons';

const Content = ({ content }) => {
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

  useEffect(() => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
        if (darkMode) {
            document.body.classList.add('dark-mode');
        }
  }, []);

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
      <div className="stats">
        <div>
          <p>Released Date: {content.releaseDate}</p>
          <p>Duration: {content.duration}</p>
          <p>Genres: {content.genres.join(', ')}</p>
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

const dummyContent = {
  poster: 'https://picsum.photos/300/450',
  name: 'Sample Movie',
  rating: 8.5,
  rates: 1200,
  description: 'This is a sample description of the movie. It provides an overview of the plot and main characters.',
  releaseDate: '2023-01-01',
  duration: '2h 30m',
  genres: ['Action', 'Adventure', 'Drama'],
  uploaded_by: 'John'
};

const App = () => {
  return (
    <div>
      <Content content={dummyContent} />
    </div>
  );
};

export default App;