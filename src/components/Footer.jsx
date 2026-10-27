import React from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaMapMarkerAlt } from "react-icons/fa";
import "../Styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
          <div className="footer-section">
          <button
            className="top-btn"
            onClick={() =>
              window.scrollTo({ top: 0, behavior: "smooth" })
            }
          >
          Back to Top
          </button>
        </div>
      <div className="footer-container">

        
        {/* COMPANY */}
        <div className="footer-section">
          <h3>Company</h3>
          <a href="#">About Us</a>
          <a href="#">Contact</a>
          <a href="/privacy" target="_main">Privacy Policy</a>
        </div>

        {/* CATEGORIES */}
        <div className="footer-section">
          <h3>Categories</h3>
          <a href="#">Fiction</a>
          <a href="#">Academic</a>
          <a href="#">Comics</a>
          <a href="#">Self-help</a>
        </div>

        {/* CONNECT WITH US */}
        <div className="footer-section">
          <h3>Connect With Us</h3>
          <div className="social-icons">
             <a href="#"><FaFacebook /></a>
             <a href="#"><FaInstagram /></a>
             <a href="#"><FaTwitter /></a>
          </div>
          {/* Location */}
          <div className="location">
                   <FaMapMarkerAlt className="location-icon" />
                  <span>Narayanpur, West Bengal 743357</span>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© 2026 Samanta E-Book Stall</p>
      </div>
    </footer>
  );
};

export default Footer;