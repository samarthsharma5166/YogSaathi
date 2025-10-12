import React from "react";
import logo from '../assets/yogalogonew.png'
import "../pages/CSS/Footer.css";
import { FaFacebookF, FaInstagramSquare, FaLinkedin } from "react-icons/fa";
import { IoLogoYoutube } from "react-icons/io";

const Footer = () => {
  const footerData = {
    address: " Yog Saathi, M/s Healthy Horizons Pvt. Ltd., Noida",
    phone: "+91 9910433340",
    cities: [],
  };

  // useEffect(() => {
  //   fetch("/api/footer")
  //     .then((res) => res.json())
  //     .then((data) => setFooterData(data))
  //     .catch((err) => console.error("Error fetching footer data:", err));
  // }, []);

  return (
    <footer className="footer relative bottom-0 right-0 w-full">
      <div className="footer-container">
        {/* Logo & Contact */}
        <div className="footer-section">
          <div className="footer-logo">
            <img src={logo} alt="Logo" className="footer-logo-img" />
           
          </div>
          <div className="footer-info">
            <p className="footer-info-title">Address:</p>
            <p className="footer-info-text">
              {footerData.address}
            </p>
          </div>
          <div className="footer-info">
            <p className="footer-info-title">Phone:</p>
            <p className="footer-info-text">
              {footerData.phone}
            </p>
          </div>
          <div className="footer-social">
            <a href="https://www.facebook.com/share/1BwweQMVyw/?mibextid=wwXIfr" target="_blank" aria-label="Facebook" className="footer-social-link"><FaFacebookF /></a>
            <a href="https://www.instagram.com/yogsaathi?igsh=MWY5bXR3ZWkwcTRyMw%3D%3D&utm_source=qr" target="_blank" aria-label="Instagram" className="footer-social-link"><FaInstagramSquare /></a>
            <a href="https://www.youtube.com/@yogsaathilive" target="_blank" aria-label="YouTube" className="footer-social-link"><IoLogoYoutube /></a>
            {/* <a href="#" aria-label="LinkedIn" className="footer-social-link"><FaLinkedin /></a> */}
          </div>
        </div>

        {/* About Us */}
        <div className="footer-section">
          <h3 className="footer-section-title">About Us</h3>
          <ul className="footer-list">
            <li><a href="/" className="footer-link">Home</a></li>
            <li><a href="/price" className="footer-link">Pricing</a></li>
            <li><a href="/livestream" className="footer-link">Events</a></li>
          </ul>
        </div>

        {/* Blog */}
        <div className="footer-section">
          <h3 className="footer-section-title">Blog</h3>
          <ul className="footer-list">
            {/* <li><a href="/nutrition" className="footer-link">Nutrition</a></li> */}
            <li><a href="/physical" className="footer-link">Physical</a></li>
            <li><a href="/mentalhealth" className="footer-link">Mental Wellness</a></li>
            <li><a href="/lifestyle" className="footer-link">Lifestyle</a></li>
          </ul>
        </div>

        {/* Popular Cities */}
        
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Healthy Horizons Pvt. Ltd</p>
        <div className="footer-bottom-links">
          <a href="/privacy-policy" className="footer-link">Privacy Policy</a>
          <a href="/returnrefund" className="footer-link">Refund Policy</a>
          <a href="/termsofuse" className="footer-link">Terms of Use</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
