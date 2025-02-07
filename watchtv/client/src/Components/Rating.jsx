import React, { useState } from 'react';
import '../Styles/Rating.css';

const RatingPage = () => {
  const [rating, setRating] = useState(null);

  return (
    <div className="rating-container">
      <h1>Rate Us</h1>
      <div className="stars">
        {[1, 2, 3, 4, 5].map((value) => (
          <span
            key={value}
            className={`star ${value <= rating ? 'selected' : ''}`}
            onClick={() => setRating(value)}
          >
            ★
          </span>
        ))}
      </div>
      <p>The rating is {rating}</p>
    </div>
  );
};

export default RatingPage;