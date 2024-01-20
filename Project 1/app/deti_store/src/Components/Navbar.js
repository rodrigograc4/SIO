import React, { useEffect } from "react";
import { useAuth } from '../Context/AuthContext';
import "../Css/Navbar.css";

const Navbar = () => {
  const { isLoggedIn, logout } = useAuth();

  useEffect(() => {
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");
    const links = document.querySelectorAll(".nav-links li");

    if (hamburger) {
      const handleClick = () => {
        // Animate Links
        navLinks.classList.toggle("open");
        links.forEach(link => {
          link.classList.toggle("fade");
        });

        // Hamburger Animation
        hamburger.classList.toggle("toggle");
      };

      hamburger.addEventListener("click", handleClick);

      return () => {
        // Remove the event listener when the component unmounts
        hamburger.removeEventListener("click", handleClick);
      };
    }
  }, []);

  const handleLogout = (e) => {
    e.preventDefault(); 
    logout(); 
    window.location.href = "/";
  };

  return (
    <div>
      <nav>
        <div className="logo">
          <a href="/">
            <span>DETI STORE</span>
          </a>
        </div>
        <div className="hamburger">
          <div className="line1"></div>
          <div className="line2"></div>
          <div className="line3"></div>
        </div>
        <ul className="nav-links">
          <li><a href="/store">Products</a></li>
          <li><a href="/">About Us</a></li>
          {isLoggedIn ? (
            <>
              <li><a href="/profile"  className="login-button">Profile</a></li>
              <li><a className="login-button" onClick={handleLogout} >Logout</a></li>
            </>
          ) : (
            <>
              <li><a href="/login" className="login-button">Login</a></li>
              <li><a href="/register" className="login-button2">Register</a></li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
