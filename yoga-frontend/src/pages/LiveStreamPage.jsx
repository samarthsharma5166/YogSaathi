import React, { useState, useEffect } from "react";
import "./CSS/livestream.css";

// ✅ Local Past Event Images (b1 to b3)
import b1 from "../assets/b1.jpg";
import b2 from "../assets/b2.jpg";
import b3 from "../assets/b3.jpg";
import b4 from "../assets/b4.jpg";
import b5 from "../assets/b5.jpg";
import b6 from "../assets/b6.jpg";

// ✅ Local Gallery Images (s1 to s5)
import s1 from "../assets/s1.jpg";
import s2 from "../assets/s2.jpg";
import s3 from "../assets/s3.jpg";
import s4 from "../assets/s4.jpg";
import s5 from "../assets/s5.jpg";
import s6 from "../assets/s1.jpg";
import s7 from "../assets/s2.jpg";
import s8 from "../assets/s3.jpg";
import s9 from "../assets/s4.jpg";
import s10 from "../assets/s5.jpg";
import b11 from "../assets/b1.jpg";
import b22 from "../assets/b2.jpg";
import b33 from "../assets/b3.jpg";
import b44 from "../assets/b4.jpg";
import b55 from "../assets/b5.jpg";
import b66 from "../assets/b6.jpg";

const images = [b1, b2, b3, b4, b5, b6]; // Past Events Slider Images
const galleryImages = [s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, b11, b22, b33, b44, b55, b66]; // Gallery Images

const benefits = [
  "Improved Flexibility and Posture",
  "Reduced Stress and Anxiety",
  "Enhanced Strength and Balance",
  "Improved Breathing",
  "Increased Energy Levels",
  "Enhanced Mental Focus",
];

function Liveevent() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const toggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="slide">
      {/* 🔵 Intro Text */}
      <div className="text">
  <h2 style={{ color: "black" }}>
    Stay tuned for upcoming events that will ignite your curiosity.
  </h2>
  <h2 style={{ color: "black" }}>
    Enrich your experience — Coming soon!
  </h2>
</div>

      {/* 🔵 Past Events Slider */}
      <div className="slider-container">
        <div className="past-events-overlay" >
          <h2 className="past-events-title">Past Events</h2>
          <div className="underline"></div>
        </div>

        <button
          className="arrow left"
          onClick={() =>
            setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1)
          }
        >
          &#10094;
        </button>

        <img
          src={images[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          className="slide-image"
        />

        <button
          className="arrow right"
          onClick={() =>
            setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1)
          }
        >
          &#10095;
        </button>
      </div>

      {/* 🔵 Gallery Section */}
      <h2 className="gallery-title" style={{ color: "black" }}>Gallery</h2>
      <div className="gallery-section">
        <div className="scroll-container">
          <div className="scroll-content">
            {[...galleryImages, ...galleryImages].map((src, idx) => (
              <div className="gallery-item" key={idx}>
                <img className="gimg" src={src} alt={`Gallery ${idx + 1}`} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 🔵 Yoga Benefits Section */}
    
    </div>
  );
}

export default Liveevent;
