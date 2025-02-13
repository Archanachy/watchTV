import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { watchtv_icon, Movies } from '../assets/Pictures';
import '../Styles/Dashboard.css';
import axios from '../api/axios';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

function Dashboard({ selectedGenre, setSelectedGenre }) {
  const [content, setContent] = useState([]);
  const [filterType, setFilterType] = useState('movies');
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideInterval = useRef(null);

  const images = [
    "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://th.bing.com/th/id/OIP.rdE9srFu8KREbfQaTc_ppwHaE6?rs=1&pid=ImgDetMain",
    "https://images.unsplash.com/photo-1631805249874-3f546d176de4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bW92aWUlMjBwb3N0ZXJ8ZW58MHx8MHx8fDA%3D"
  ];

  const handleContentClick = (contentId) => {
    navigate(`/content/${contentId}`);
  };

  useEffect(() => {
    const fetchContent = async () => {
      try {
        let endpoint = filterType === 'movies' ? '/api/movies' : '/api/shows';
        let url = `${import.meta.env.VITE_API_URL}${endpoint}`;

        if (selectedGenre) {
          url += `?genre_id=${selectedGenre}`;
        }

        const response = await axios.get(url);
        const uniqueContent = Array.from(new Map(response.data.map(item => [item.content_id, item])).values());
        setContent(uniqueContent);
      } catch (error) {
        console.error(`Failed to fetch ${filterType} content:`, error);
      }
    };

    fetchContent();
  }, [selectedGenre, filterType]);

  const handleFilterChange = (type) => {
    setFilterType(type);
  };

  const handleupload = () => {
    navigate('/upload');
  };

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




  return (
    <div className="dashboard-fullscreen-container">
      <Navbar />

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
            <img
              src={Movies}
              alt="Movie Icon"
              onClick={() => handleFilterChange('movies')}
            />
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleFilterChange('movies');
              }}
            >
              Movies
            </a>
            <img
              src={watchtv_icon}
              alt="Show Icon"
              onClick={() => handleFilterChange('shows')}
            />
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleFilterChange('shows');
              }}
            >
              Shows
            </a>
          </p>
          <button className="upload-button" onClick={handleupload}><span>+   </span>Upload</button>
        </div>

        <div className="View">
          {content.map((item) => (
            <div key={item.content_id} className="block" onClick={() => handleContentClick(item.content_id)}>
              <img src={`${import.meta.env.VITE_API_URL}${item.image_path}`} alt={item.title} className="block-image" />
              <div className="block-details">
                <div className="block-rating">
                  <FontAwesomeIcon icon={faStar} className="star-icon" />
                  <span>{Number(item.average_rating) > 0 ? Number(item.average_rating).toFixed(1) : "N/A"}</span>
                  <div className="block-date">{new Date(item.released_date).toISOString().split('T')[0]}</div>
                </div>
                <div className="block-name">{item.title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;