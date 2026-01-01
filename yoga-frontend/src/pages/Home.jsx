import React, { useEffect, useState, useRef } from "react";
import "./CSS/Home.css";
import AAImage from "../assets/logo.jpg";
import ABImage from "../assets/yogasite2.jpg";
import Slider from "react-slick";
  import { useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Mainslider from "../pages/mainslider";
import yogaImage from "../assets/yr.png";
import {
  FaRulerCombined,
  FaGrinStars,
  FaBalanceScale,
  FaWind,
  FaBolt,
  FaLightbulb,
  FaShieldAlt,
  FaClock,
  FaMobileAlt,
  FaUsers,
  FaBell,
  FaUserMd,
} from "react-icons/fa";
import { Leaf, HeartPulse, Brain } from "lucide-react";
import img1 from "../assets/b1.jpg";
import img2 from "../assets/b2.jpg";
import img3 from "../assets/b3.jpg";
import img4 from "../assets/b4.jpg";
import img5 from "../assets/b5.jpg";
import img6 from "../assets/b6.jpg";

import teacher1 from '../assets/teacher1.jpeg'

import { registerUser } from "../services/api";
import { MdOutlineFreeBreakfast } from "react-icons/md";
import Testimonials from "../components/Testimonials";

const teamMembers = [
  {
    name: "Improved Flexibility and Posture",
    role: "Founder",
    image: img1,
  },
  {
    name: "Reduced Stress and Anxiety",
    role: "Creative Director",
    image: img2,
  },
  {
    name: "Enhanced Strength and Balance",
    role: "Lead Developer",
    image: img3,
  },
  {
    name: "Improved Breathing",
    role: "UX Designer",
    image: img4,
  },
  {
    name: "Increased Energy Levels",
    role: "Marketing Manager",
    image: img5,
  },
  {
    name: "Enhanced Mental Focus",
    role: "Product Manager",
    image: img6,
  },
];
const HomePage = () => {
  const [members, setMembers] = useState(0);
  const [years, setYears] = useState(0);
  const [rating, setRating] = useState(0);
  const [openIndex, setOpenIndex] = useState(0);
  const [showRegister, setShowRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const animateValue = (target, setter, duration) => {
    let start = 0;
    const increment = target / (duration / 10);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        clearInterval(timer);
        setter(target);
      } else {
        setter(parseFloat(start.toFixed(2)));
      }
    }, 10);
  };

  useEffect(() => {
    animateValue(1.18, setMembers, 1200);
    animateValue(12, setYears, 1000);
    animateValue(4.9, setRating, 800);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await registerUser(formData);
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error occurred");
    }
  };

  const founderSlides = [
    {
      img: ABImage,
      name: "Sanjay Kumar Mahesh",
      title: "Founder & CEO",
      desc: "B.E. in Mechanical Engineering from IIT Roorkee with 38 years of distinguished corporate experience. A passionate yoga enthusiast, he is a firm believer in the transformative power of yoga to enhance strength, flexibility, and overall well-being. His vision is rooted in the belief that yoga is not just a form of exercise, but a holistic practice that can help people achieve better physical health, mental clarity, and inner balance. Through this venture, he aspires to make the benefits of yoga accessible to people from all walks of life by making Quality Yoga available at their door-step at the price not seen before.",
    },
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
  };

 


  const faqs = [
    {
      question: "How do I join the Class?",
      answer:
        "You can join the Class by clicking link sent to you on Whats App. You can join on Mobile or devices such as TV etc. can be linked to do the Yoga with us thru You Tube. The Application is simple and User-friendly.",
    },
    {
      question: "Can I change the Slots as per my convenience?",
      answer:
        "Absolutely yes. For example,  you can join session today at 6 AM, tomorrow at 8.30 AM and next day 6.30 PM as per your convenience. Total six slots are available every day, you can chose any one.",
    },
    {
      question: "Whether  it is possible to join for part session?",
      answer:
        "Yes, you can join the program for shorter period, however we recommend that you must  join  full session as far as possible. However in case of any exigency, even joining part session is better than not to join at all.",
    },
    {
      question:
        "Can I understand the instructions on-line and follow the same?",
      answer:
        "Yes, the instructions are in Hindi with some mix of English and pace is moderate. You can follow and do Yoga easily with us.",
    },
    {
      question:
        "Can  I  follow correct postures and do the Yoga in right way through On-Line Sessions?",
      answer:
        "Yes, yoga is demonstrated by experienced instructors with proper emphasis on correct postures and the right way of doing asanas.",
    },
    {
      question:
        "Are these sessions for Beginners or Experienced Yoga Enthusiasts; Young or Old People?",
      answer:
        "These Sessions are designed after lot of considerations and thinking so that these are suitable for all age-groups, beginners as well as experienced people. The selection of Asanas has been done by expert Yoga Trainers keeping the wellbeing of all walks of people  in mind.",
    },
    {
      question:
        "Does extra session such as Nutritionist etc. are free (included in subscription amount) or additional amount is to be paid separately before these sessions?",
      answer: "The sessions are absolutely free and no charges are to be paid.",
    },
  ];
  const trainers = [
    {
      name: "Ms.Upma Gupta",
      about:
        "Certificate from Yoga Certification Board, Ministry of AYUSH, Government of India, Diploma in Naturopathy and Yoga, MA – Science of Living, Preksha Meditation & Yoga,  having more than 15 Years Experience of imparting Yoga Training.",
      image: "./teacher1.jpeg",
    },
    {
      name: "Monika Bhatnagar",
      about:
        "Certificate of Diploma in Naturopathy & Yogic Science (4 Years Course) conducted many workshops on Yoga, having more than 12 years experience of imparting Yoga Training",
      image: "./teacher2.jpeg",
    },
    {
      name: "Aniket Saini",
      about:"Masters in Yogic Science, Gurukul Kangdi, Haridwar, having 6 Years of Experience of imparting Yoga Training, including 6 months Yoga teaching at Vietnam. ",
      image: "./teacher3.jpeg",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const autoSlideIntervalRef = useRef(null);

  const updateCarousel = (newIndex) => {
    if (isAnimating) return;
    setIsAnimating(true);

    const adjustedIndex = (newIndex + teamMembers.length) % teamMembers.length;
    setCurrentIndex(adjustedIndex);

    resetAutoSlide();

    setTimeout(() => {
      setIsAnimating(false);
    }, 800);
  };


  const handleSwipe = (startX, endX) => {
    const swipeThreshold = 50;
    const navigation = useNavigate();
    const diff = startX - endX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        updateCarousel(currentIndex + 1);
      } else {
        updateCarousel(currentIndex - 1);
      }
    }
  };

  const startAutoSlide = () => {
    autoSlideIntervalRef.current = setInterval(() => {
      updateCarousel(currentIndex + 1);
    }, 2000);
  };

  const stopAutoSlide = () => {
    if (autoSlideIntervalRef.current) {
      clearInterval(autoSlideIntervalRef.current);
    }
  };

  const resetAutoSlide = () => {
    stopAutoSlide();
    startAutoSlide();
  };

  useEffect(() => {
    startAutoSlide();
    return () => stopAutoSlide();
  }, [currentIndex]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        updateCarousel(currentIndex - 1);
      } else if (e.key === "ArrowRight") {
        updateCarousel(currentIndex + 1);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, isAnimating]);

  let touchStartX = 0;

  // free registration section start
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimate(true);
      setTimeout(() => setAnimate(false), 1000); // Animation duration
    }, 5000); // Every 5 seconds

    return () => clearInterval(interval);
  }, []);
  // end

  return (
    <div className="home-wrapper mt-24">
      {/* offer */}
      {/* <div className="!bg-white h-18 z-9999 relative mt-4">
        <p className="text-red-600 animate-pulse font-semibold text-center mb-2">
          Registration for 21 Days Free Online Yoga Sessions Open 
        </p>
        <p className="text-red-600 animate-pulse font-semibold text-center mb-4">
          🔴 Speial New Year Offer On Subscription Plans (Valid Till 10 Jan, 2026): 12+6 Months FREE | 6+3 Months FREE | 3+1 Month FREE
        </p>
      </div> */}
      {/* <div className="offer-banner">
        <div className="offer-left">
          <span className="offer-badge">NEW YEAR OFFER 🎉</span>
          <h3>
            21 Days <span>FREE</span> Online Yoga Sessions
          </h3>
          <p>
            Limited-time subscription bonus valid till
            <strong> 10 Jan 2026</strong>
          </p>
        </div>

        <div className="offer-right">
          <ul>
            <li>12 + 6 Months FREE</li>
            <li>6 + 3 Months FREE</li>
            <li>3 + 1 Month FREE</li>
          </ul>
          <button onClick={() => navigate("/auth/register")}>
            Claim Offer →
          </button>
        </div>
      </div> */} 
      <div className="offer-banner">
        {/* LEFT: Offer Content */}
        <div className="offer-left">
          <span className="offer-badge">NEW YEAR OFFER 🎉</span>

          <h3>
            21 Days <span>FREE</span> Online Yoga Sessions
          </h3>

          <p className="offer-sub">
            Start risk-free. No payment required.
          </p>


          {/* Primary CTA */}
          <button
            className="offer-btn primary"
            onClick={() => navigate("/auth/register")}
          >
            Start Free Trial →
          </button>
        </div>

        {/* RIGHT: Subscription Deals */}
        <div className="offer-right">
          <p className="offer-valid">
            New Year Special Subscription Bonus <strong>(Valid till 10 Jan 2026)</strong>
          </p>

          <ul>
            <li>12 + 6 Months FREE</li>
            <li>6 + 3 Months FREE</li>
            <li>3 + 1 Month FREE</li>
          </ul>

          {/* Secondary CTA */}
          <button
            className="offer-btn secondary"
            onClick={() => navigate("/price")}
          >
            View Subscription Plans →
          </button>
        </div>
      </div>

      <Mainslider />

      {/* <section className="trusted-section"> */}
      {/* <h4 className="subheading">Welcome to Yoga Website</h4>
        <h2 className="main-heading">Trusted by Members Worldwide</h2>
        <p className="description">
          We blend the best of old-school knowledge with modern tricks to help
          you form long-lasting healthy habits.
        </p> */}
      {/* <div className="stats-box">
          <div className="stat-card">
            <h3>{members.toFixed(2)} Crore +</h3>
            <p>Community Members</p>
          </div>
          <div className="stat-card">
            <h3>{years}+</h3>
            <p>Years of Experience</p>
          </div>
          <div className="stat-card">
            <h3>{rating}/5</h3>
            <p>Google Rating</p>
          </div>
        </div> */}
      {/* </section> */}

      <section className="yoga-join-us">
        <h4 style={{ color: "black" }} className="yoga-subtitle">
          Benefits
        </h4>
        <h2 style={{ color: "black" }} className="yoga-title">
          Reasons to Join Us
        </h2>
        <div className="yoga-card-grid">
          <div
            className="yoga-card 	bg-[#E0F7FA] space-y-4"
            data-aos="zoom-in"
            data-aos-delay="0"
          >
            <div className="flex justify-center">
              <FaRulerCombined
                style={{ color: "#4CAF50" }}
                className="yoga-icon"
              />
            </div>
            <h4
              style={{ color: "black" }}
              className="text-center font-bold w-full"
            >
              Improve Flexibility & Posture
            </h4>
            <ul>
              <li style={{ color: "black" }}>Enhance Range of Motion</li>
              <li style={{ color: "black" }}>Correct Body Alignment</li>
              <li style={{ color: "black" }}>Alleviate Back Pain</li>
            </ul>
          </div>

          <div
            className="yoga-card bg-[#FCE4EC] space-y-4"
            data-aos="zoom-in"
            data-aos-delay="100"
          >
            <div className="flex justify-center">
              <FaGrinStars style={{ color: "#4CAF50" }} className="yoga-icon" />
            </div>
            <h4 className="text-center font-bold w-full">
              Reduce Stress & Anxiety
            </h4>
            <ul>
              <li>Calm Your Mind</li>
              <li>Promote Relaxation</li>
              <li>Boost Mood</li>
            </ul>
          </div>

          <div
            className="yoga-card yoga-gold 	bg-[#E8F5E9] space-y-4"
            data-aos="zoom-in"
            data-aos-delay="200"
          >
            <div className="flex items-center justify-center">
              <FaBalanceScale
                style={{ color: "#4CAF50" }}
                className="yoga-icon"
              />
            </div>
            <h4 style={{ color: "black" }} className="font-bold w-full">
              Enhance Strength & Balance
            </h4>
            <ul>
              <li style={{ color: "black" }}>Build Core Strength</li>
              <li style={{ color: "black" }}>Improve Stability</li>
              <li style={{ color: "black" }}>Prevent Falls</li>
            </ul>
          </div>

          <div
            className="yoga-card bg-[#E6F4EA] space-y-4"
            data-aos="zoom-in"
            data-aos-delay="300"
          >
            <div className="flex items-center justify-center">
              <FaWind style={{ color: "#4CAF50" }} className="yoga-icon" />
            </div>
            <h4 className="font-bold w-full">Improve Breathing</h4>
            <ul>
              <li>Deepen Respiration</li>
              <li>Increase Lung Capacity</li>
              <li>Optimize Oxygen Flow</li>
            </ul>
          </div>
        </div>
        <div className="yoga-card-grid yoga-grid-two-cols">
          <div
            className="yoga-card bg-[#FFF8E1] space-y-4"
            data-aos="zoom-in"
            data-aos-delay="400"
          >
            <div className="flex items-center justify-center">
              <FaBolt
                style={{ color: "#4CAF50" }}
                className="yoga-icon text-black"
              />
            </div>
            <h4 className="font-bold w-full">Increase Energy Levels</h4>
            <ul>
              <li>Revitalize Your Body</li>
              <li>Boost Vitality</li>
              <li>Combat Fatigue</li>
            </ul>
          </div>

          <div
            className="yoga-card bg-[#F3E5F5] space-y-4"
            data-aos="zoom-in"
            data-aos-delay="500"
          >
            <div className="flex items-center justify-center">
              <FaLightbulb style={{ color: "#4CAF50" }} className="yoga-icon" />
            </div>
            <h4 style={{ color: "black" }} className="font-bold w-full">
              Enhance Mental Focus
            </h4>
            <ul>
              <li style={{ color: "black" }}>Improve Concentration</li>
              <li style={{ color: "black" }}>Sharpen Clarity</li>
              <li style={{ color: "black" }}>Cultivate Mindfulness</li>
            </ul>
          </div>
        </div>
        {/* +++++++++++++ Feature section +++++++++++++ */}
        <div className="feature-section">
          <h4 style={{ color: "black" }} className="yoga-subtitle">
            Membership Features
          </h4>
          <h2 style={{ color: "black" }} className="yoga-title">
            Unlock Your Exclusive Benefits
          </h2>

          <div className="feature-grid">
            <div className="feature-card space-y-2">
              {/* <MdOutlineFreeBreakfast className="icon" /> */}
              <div className="flex justify-center">
                <img src="./trial.png" className="w-16 h-16  " />
              </div>
              <h3 style={{ color: "black" }} className="font-bold text-xl">
                Free Trials
              </h3>
              <p className="font-medium">
                Enjoy a <strong>14-day absolutely free trial</strong> to explore
                our yoga sessions.
              </p>
            </div>
            <div className="feature-card space-y-2">
              {/* <FaBell className="icon" /> */}
              <div className="flex justify-center">
                <img src="./yoga.png" className="w-16 h-16" />
              </div>
              <h3 style={{ color: "black" }} className="font-bold text-xl">
                Daily Yoga
              </h3>
              <p className="font-medium">
                Access <strong>365 days of uninterrupted yoga sessions</strong>{" "}
                — stay consistent and transform your health daily.
              </p>
            </div>
            <div className="feature-card space-y-2">
              {/* <FaMobileAlt className="icon" /> */}
              <div className="flex justify-center">
                <img src="./qualified.png" className="w-16 h-16" />
              </div>
              <h3 style={{ color: "black" }} className="font-bold text-xl">
                Experienced Trainers
              </h3>
              <p className="font-medium">
                Learn from <strong>highly experienced yoga experts</strong>{" "}
                offering guidance and depth in each asana.
              </p>
            </div>
            <div className="feature-card space-y-2">
              {/* <FaUsers className="icon" /> */}
              <div className="flex justify-center">
                <img src="./pc.png" className="w-16 h-16" />
              </div>
              <h3 style={{ color: "black" }} className="font-bold text-xl">
                Easy Accessibility
              </h3>
              <p className="font-medium">
                Attend classes <strong>from anywhere</strong> — all you need is
                an internet connection.
              </p>
            </div>

            <div className="feature-card second-row space-y-2">
              {/* <FaClock className="icon" /> */}
              <div className="flex justify-center">
                <img src="./flexibleTiming.png" className="w-16 h-16" />
              </div>
              <h3 style={{ color: "black" }} className="font-bold text-xl">
                Flexible Timings
              </h3>
              <p className="font-medium">
                Sessions are available <strong>six times a day</strong>, giving
                you flexibility to practice at your convenience.
              </p>
            </div>
            <div className="feature-card second-row space-y-2">
              {/* <FaUserMd className="icon" /> */}
              <div className="flex justify-center">
                <img src="./others.png" className="w-16 h-16" />
              </div>
              <h3 style={{ color: "black" }} className="font-bold text-xl">
                Other Wellness Programs
              </h3>
              <p className="font-medium">
                Subscribers get access to{" "}
                <strong>additional wellness programs</strong>, including
                <strong> nutrition guidance</strong> and more —{" "}
                <strong>at no extra cost</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <p>Start Your Journey</p>
        <h2 style={{ color: "black" }}>
          Ready for a Change? Begin Your Wellness Journey!
        </h2>
        <button
          className="cta-button-glow"
          onClick={() => navigate("/auth/register")}
        >
          Register Now for FREE →
        </button>
        <p className="cta-note">1.18 Crore + already attended</p>
      </section>

      {/* ++++++++++++++++ Trainer ++++++++++++++ */}
      <div className="divine-wrapper px-4 sm:px-6 md:px-10 lg:px-20 space-y-6">
        <h1 className=" text-white text-3xl text-center font-bold">
          Our Trainers
        </h1>
        <div className="h-1 bg-white w-20 mx-auto rounded mb-10"></div>
        <div className=" flex flex-wrap justify-evenly gap-8">
          {trainers.map((trainer) => (
            <div className="w-full sm:[300px] md:w-[250px] lg:[280px] p-4 rounded-lg flex flex-col items-center text-center space-y-4">
               <img src={trainer.image} className="w-32 h-52 rounded-full  object-fill" /> 
              <div className="space-y-2">
                <h1 className="text-white text-3xl sm:text-4xl text-center font-bold">
                  {trainer.name}
                </h1>
                <p className="text-white  text-center mx-auto w-80 font-medium text-sm tracking-wide">
                  {trainer.about}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showRegister && (
        <div className="register-popup">
          <form
            className="register-form animated-form"
            onSubmit={handleRegister}
          >
            <h2>Register</h2>
            <input
              type="text"
              name="name"
              placeholder="Name"
              required
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              onChange={handleChange}
            />
            <button type="submit">Register</button>
            <p>{message}</p>
            <span className="close-btn" onClick={() => setShowRegister(false)}>
              ×
            </span>
          </form>
        </div>
      )}


      <section className="founders-faqs">
        <h2 className="section-title">Meet Our Founder</h2>

        <div {...sliderSettings} className="founder-slider">
          {founderSlides.map((slide, index) => (
            <div key={index} className="founder-slide bg-[#AABB63]">
              <div className="flex justify-center">
                <img src={slide.img} alt={slide.name} className="founder-img" />
              </div>
              <h4 className="text-white">{slide.name}</h4>
              <p>{slide.title}</p>
              <small>{slide.desc}</small>
            </div>
          ))}
        </div>
        <br />
        <br />
        <br />

          <Testimonials/>
        <h1
          style={{ paddingBottom: "20px", fontSize: "40px" }}
          className="faq-heading"
        >
          Frequently asked questions
        </h1>
        <div className="faq-container">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`faq-item ${openIndex === index ? "open" : ""}`}
              onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
            >
              <div className="faq-question">
                <strong>{faq.question}</strong>
                <span>{openIndex === index ? "-" : "+"}</span>
              </div>
              <p className="faq-answer">
                {faq.answer || "Content coming soon..."}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;

