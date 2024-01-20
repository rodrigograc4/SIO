import React from 'react';
import '../Css/ReviewCard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faTimes } from '@fortawesome/free-solid-svg-icons'; // Importe os ícones necessários



function formatReviewDate(dateStr) {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
  const date = new Date(dateStr);
  return date.toLocaleString('pt-PT', options);
}

function ReviewCard({ username, reviewText, reviewDate, rating }) {
  const stars = [];
  for (let i = 0; i < rating; i++) {
    stars.push(<li key={i}><FontAwesomeIcon icon={faStar} className="star-icon" /></li>);
  }

  const formattedReviewDate = formatReviewDate(reviewDate);
  
  return (
    <div className="card">
      <div>
        <ul className="stars">{stars}</ul>
      </div>

      <p className="close">
        <FontAwesomeIcon icon={faTimes} />
      </p>
      <h3>{username}</h3>
      <p className="desc">{reviewText}</p>
      <p className="review-date">Review Date: {formattedReviewDate}</p>
    </div>
  );
}

export default ReviewCard;

  
 
  
