import React from "react";
import "../Css/Home.css";
import { useAuth } from '../Context/AuthContext';

const Home = () => {
  const { isLoggedIn } = useAuth();

  return (
    <div className="home">
      {!isLoggedIn ? (
        <div className="welcome-text">
          <h1>DETI STORE</h1>
          <div className="button-container">
            <button className="custom-button" onClick={() => window.location.href = '/store'}>See Products</button>
            <button className="custom-button" onClick={() => window.location.href = '/login'}>Login</button>
          </div>
        </div>
      ) : (
        <div className="welcome-text">
          <h1>DETI STORE</h1>
          <div className="button-container">
            <button className="custom-button" onClick={() => window.location.href = '/store'}>See Products</button>
          </div>
        </div>
      )}
      <div className="footer">
        <ul>
          <li>
            <a href="#">
              <i className="fa fa-facebook" aria-hidden="true"></i>
              <span> - Facebook</span>
            </a>
          </li>
          <li>
            <a href="#">
              <i className="fa fa-twitter" aria-hidden="true"></i>
              <span> - Twitter</span>
            </a>
          </li>
          <li>
            <a href="#">
              <i className="fa fa-google-plus" aria-hidden="true"></i>
              <span> - Google</span>
            </a>
          </li>
          <li>
            <a href="#">
              <i className="fa fa-instagram" aria-hidden="true"></i>
              <span> - Instagram</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Home;
