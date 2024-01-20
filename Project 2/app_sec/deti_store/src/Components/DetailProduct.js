import React, { useEffect, useState } from 'react';
import "../Css/DetailProduct.css";
import { useAuth } from "../Context/AuthContext";
import { useParams } from 'react-router-dom';
import ReviewCard from './ReviewCard';
import DOMPurify from 'dompurify';


const DetailProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState();
  const { userInfo, isLoggedIn } = useAuth();
  const [loading, setLoading] = useState(true);
  const [reviews,setReviews] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);

  const validateInput = (input) => {
    const sanitizedInput = input.replace(/[#$%^[&*(){}+=_?:/<>'";-]+/g, '');
    return sanitizedInput;
  };


  useEffect(() => {
    setLoading(true);
  
    fetch(`http://localhost:5000/api/detailproduct/${id}`)
      .then(response => response.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
  
        fetch(`http://localhost:5000/api/productreviews/${id}`)
          .then(response => response.json())
          .then(reviewsData => {
            setReviews(reviewsData)
            setLoading(false);
         
          })
          .catch(error => {
            console.error('Erro ao buscar as avaliações do produto:', error);
          });
      })
      .catch(error => {
        console.error('Erro ao buscar dados do produto:', error);
        setLoading(false);
      });
  }, [id]);
  


  if (loading) {
    return <div>Loading...</div>;
  }

  if (isLoggedIn && userInfo === null) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>No product found.</div>;
  }

  const handleAddReview = async (e) => {
    e.preventDefault();
    try {
      const reviewData = {
        userId: userInfo.id, 
        productId: id, 
        reviewText: reviewText,
        rating: rating,
      };

      const response = await fetch('http://localhost:5000/api/addreview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });

      if (response.status === 200) {
      
        const updatedReviews = [...reviews, reviewData];
        setReviews(updatedReviews);
        setReviewText('');
        setRating(0);
        window.location.reload();
      
      } else {
        alert('Erro ao adicionar a avaliação. Verifique os dados e tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao adicionar a avaliação:', error);
    }
  };


  console.log(reviews)

  return (
    <div className="DetailProductPage">
      <h2 className='detailproduct-title'>Detailed Product</h2>
        <div className="productdetail-container">
          <div className="productdetail-card">
            
              <div className="left-detail">
                <img src={`http://localhost:5000/public/Images/${product.foto_url}`} alt={product.nome} className="detailproduct-image"/>
              </div>
              <div className="right-detail">
                <h2>{product.nome}</h2>
                <h4>Tipo: {product.tipo}</h4>
                <p>Descrição: {product.descricao}</p>
                <p>Tamanho: {product.tamanho || 'N/A'}</p>
                <h4>Stock: {product.Nstock}</h4>
                <h3>Preço: {product.preco} €</h3>
              </div>
           </div>
        </div>
        <div className="main-container">
          <h2 className='reviews-h2'>Reviews do Produto</h2>
          <div className="cards">
            {reviews && reviews.length > 0 ? (
              <div className="cards">
                {reviews.map((review) => (
              <ReviewCard
                  username={review.username}
                  reviewText={review.Review}
                  reviewDate={review.review_date}
                  rating={review.rating}
                  />  
                  ))}
                </div>
              ) : (
                <div className="no-reviews">
                  <p>No reviews available</p>
                </div>
              )}
              
          </div>
        </div>
        <div className='container-add-review'>
        <h2>Add Review</h2>
        <div className='add-review'>
          <label>
            Review:
            <textarea
              value={DOMPurify.sanitize(reviewText)}  
              onChange={(e) => setReviewText(e.target.value)}
              rows="6" 
              cols="50"
            ></textarea>
          </label>
              <label>
                Rate (0-5):
                <input
                  type="text"
                  value={rating}
                  onChange={(e) => {
                    const newRating = e.target.value;
                    const numericRating = newRating.replace(/[^0-9]/g, '');
                    if (numericRating >= 0 && numericRating <= 5) {
                      setRating(numericRating);
                    }
                  }}
                />
              </label>
              <button   onClick={handleAddReview} className='add-review-button'><i className="animation"></i>	Adicionar Avaliação<i className="animation"></i></button>
            </div>
          </div>
        <span className='detail-page-footer'></span>
    </div>
  );
};

export default DetailProduct;
