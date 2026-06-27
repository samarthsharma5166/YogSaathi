import React, { useState, useEffect, useRef } from "react";
import { toast, Toaster } from "react-hot-toast";
import {
  Play,
  Volume2,
  Tv,
  Users,
  Send,
  Calendar,
  Clock,
  User,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle,
  MessageSquare
} from "lucide-react";
import "./CSS/livestream.css";

// ✅ Local Past Event Images (b1 to b6)
import b1 from "../assets/b1.jpeg";
import b2 from "../assets/b2.jpeg";
import b3 from "../assets/b3.jpeg";
import b4 from "../assets/b4.jpeg";
import b5 from "../assets/b5.jpeg";
import b6 from "../assets/b6.jpeg";

// ✅ International Yoga Day 2026 Images
import yogaDay1 from "../assets/yoga_day_1.jpg";
import yogaDay2 from "../assets/yoga_day_2.jpg";
import yogaDay3 from "../assets/yoga_day_3.jpg";
import yogaDay4 from "../assets/yoga_day_4.jpg";
import yogaDay5 from "../assets/yoga_day_5.jpg";

// ✅ International Yoga Day 2026 Videos
import yogaDayVideo1 from "../assets/yoga_day_video_1.mp4";
import yogaDayVideo2 from "../assets/yoga_day_video_2.mp4";

// ✅ Local Gallery Images (s1 to s10, b11 to b66)
import s1 from "../assets/s1.jpg";
import s2 from "../assets/s2.jpg";
import s3 from "../assets/s3.jpg";
import s4 from "../assets/s2.jpeg";
import s5 from "../assets/s5.jpg";
import s6 from "../assets/s1.jpg";
import s7 from "../assets/s2.jpg";
import s8 from "../assets/s3.jpg";
import s9 from "../assets/s4.jpeg";
import s10 from "../assets/s5.jpg";
import b11 from "../assets/b1.jpg";
import b22 from "../assets/b2.jpg";
import b33 from "../assets/b3.jpg";
import b44 from "../assets/b4.jpg";
import b55 from "../assets/b5.jpg";
import b66 from "../assets/s7.jpeg";

const images = [b3, b2, b1, b4, b5, b6, s4, s9, b66]; // Past Events Slider Images
const galleryImages = [
  { src: s1, size: "normal" },
  { src: s2, size: "wide" },
  { src: s3, size: "normal" },
  { src: s4, size: "tall" },
  { src: s5, size: "normal" },
  { src: s6, size: "normal" },
  { src: s7, size: "wide" },
  { src: s8, size: "normal" },
  { src: s9, size: "tall" },
  { src: s10, size: "normal" },
  { src: b11, size: "normal" },
  { src: b22, size: "wide" },
  { src: b33, size: "normal" },
  { src: b44, size: "tall" },
  { src: b55, size: "normal" },
  { src: b66, size: "normal" }
];

const initialChatMessages = [
  { id: 1, sender: "Elena Rostova", text: "Namaste! Excited for today's Vinyasa class.", isMod: false, isIncoming: true },
  { id: 2, sender: "Yogi_Dave", text: "Great flow so far, feeling the stretch!", isMod: false, isIncoming: true },
  { id: 3, sender: "Anya (Instructor)", text: "Welcome everyone! Focus on your breath and go at your own pace.", isMod: true, isIncoming: true },
  { id: 4, sender: "Marcus K.", text: "This ambient background music is perfect.", isMod: false, isIncoming: true },
  { id: 5, sender: "Sarah Chen", text: "Will this live session be recorded? Need to share with my mom.", isMod: false, isIncoming: true },
  { id: 6, sender: "Anya (Instructor)", text: "Yes Sarah, all live streams are saved to the Past Events library below!", isMod: true, isIncoming: true }
];

const mockPastEvents = [
  {
    image: b3,
    title: "International Yoga Day Mega Celebration",
    tag: "Special Event",
    desc: "Over 500+ yogis joined in unison for a sunrise salutation session. Refined alignment techniques and unified breathing flows led by YogSaathi masters."
  },
  {
    image: b2,
    title: "Vinyasa Core Strength & Flow Workshop",
    tag: "Core Focus",
    desc: "A powerful dynamic sequence aimed at strengthening the core abdominal center while keeping a graceful, fluid breath connection."
  },
  {
    image: b1,
    title: "Pranayama & Meditative Sound Bath",
    tag: "Meditation",
    desc: "A relaxing sensory journey incorporating deep pranayama breathing and therapeutic singing bowls. Released deep-seated mental stresses."
  },
  {
    image: b4,
    title: "Yin Yoga for Deep Fascial Release",
    tag: "Restorative",
    desc: "Quiet, slow-paced postures held for 3-5 minutes, focusing on connective tissue health, joint mobility, and calming the nervous system."
  },
  {
    image: b5,
    title: "Sunset Hatha Yoga & Guided Nidra",
    tag: "Hatha & Nidra",
    desc: "A beautifully balanced evening class transitioning from strengthening alignment postures into a deep, conscious yogic sleep."
  },
  {
    image: b6,
    title: "Chakra Balance & Energy Alignment",
    tag: "Energy Alignment",
    desc: "An exploration of the body's energy system. Utilizing targeted asanas, mudras, and seed mantras to restore structural harmony."
  }
];

const mockUpcomingEvents = [
  {
    id: 1,
    title: "Morning Sun Salutations & Warm-up",
    category: "Vinyasa",
    instructor: "Anya Sharma",
    avatar: s1,
    image: s1,
    time: "Live in 1h 15m",
    duration: "45 Mins",
    level: "All Levels",
    desc: "Start your morning with a refreshing, standard sun salutation sequence designed to energize and align the spine.",
    status: "live"
  },
  {
    id: 2,
    title: "Mindfulness & Transcendental Meditation",
    category: "Meditation",
    instructor: "Guruji Devendra",
    avatar: s2,
    image: s2,
    time: "Today, 6:30 PM",
    duration: "60 Mins",
    level: "Beginner",
    desc: "Learn to quiet the monkey mind through ancient Vedic focus points, pranayama breathing, and peaceful introspection.",
    status: "upcoming"
  },
  {
    id: 3,
    title: "Advanced Kundalini Energy Activation",
    category: "Breathwork",
    instructor: "Swami Raman",
    avatar: s3,
    image: s3,
    time: "Tomorrow, 8:00 AM",
    duration: "75 Mins",
    level: "Advanced",
    desc: "A rigorous practice involving powerful breath control, dynamic body locks (bandhas), and active energy channel clearing.",
    status: "upcoming"
  },
  {
    id: 4,
    title: "Deep Stretch & Hip Opener Yin Flow",
    category: "Yin",
    instructor: "Elena Rostova",
    avatar: s5,
    image: s5,
    time: "Sunday, 5:00 PM",
    duration: "90 Mins",
    level: "Intermediate",
    desc: "Focus on releasing chronic stiffness in the hip sockets, hamstrings, and lower back using prop-assisted resting holds.",
    status: "upcoming"
  },
  {
    id: 5,
    title: "Vinyasa flow for Detoxification",
    category: "Vinyasa",
    instructor: "Anya Sharma",
    avatar: s1,
    image: s4,
    time: "Next Tuesday, 7:00 AM",
    duration: "60 Mins",
    level: "Intermediate",
    desc: "Twisting sequences and heat-building flows to help massage the internal digestive organs and sweat out impurities.",
    status: "upcoming"
  },
  {
    id: 6,
    title: "Pranayama for Anxiety & Stress Relief",
    category: "Breathwork",
    instructor: "Swami Raman",
    avatar: s3,
    image: s8,
    time: "Next Thursday, 6:00 PM",
    duration: "45 Mins",
    level: "All Levels",
    desc: "Gentle alternate-nostril breathing, cooling breath practices, and box breathing for immediate parasympathetic relaxation.",
    status: "upcoming"
  }
];

function Liveevent() {
  const [chatMessages, setChatMessages] = useState(initialChatMessages);
  const [chatInput, setChatInput] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [currentPastIndex, setCurrentPastIndex] = useState(0);
  const [selectedLightboxImage, setSelectedLightboxImage] = useState(null);
  const [timeLeft, setTimeLeft] = useState(4500); // 1 hour 15 mins in seconds
  const [activeYogaDayVideo, setActiveYogaDayVideo] = useState(yogaDayVideo1);

  const chatContainerRef = useRef(null);

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 4500));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const formatCountdown = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}h ${mins.toString().padStart(2, "0")}m ${secs.toString().padStart(2, "0")}s`;
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: "You",
      text: chatInput.trim(),
      isMod: false,
      isIncoming: false
    };

    setChatMessages((prev) => [...prev, newMessage]);
    setChatInput("");

    // Simulate an automatic response after 2 seconds
    setTimeout(() => {
      const responses = [
        "Namaste! Thanks for sharing.",
        "Yes, breathing makes a huge difference!",
        "Peaceful vibes indeed.",
        "Let's focus on the stretch now."
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "Yogi Guest",
          text: randomResponse,
          isMod: false,
          isIncoming: true
        }
      ]);
    }, 2000);
  };

  const handleReserveSpot = (title) => {
    toast.success(`Successfully registered for "${title}"! Check your email for details.`);
  };

  const handlePlayReplay = (title) => {
    toast.success(`Playing Replay: "${title}"`);
  };

  // Filter logic
  const filteredEvents = activeFilter === "All"
    ? mockUpcomingEvents
    : mockUpcomingEvents.filter((event) => event.category === activeFilter);

  const activePast = mockPastEvents[currentPastIndex];

  return (
    <div className="livestream-page-container">
      <Toaster position="top-right" reverseOrder={false} />

      

      {/* 🌟 Recent Highlights Section */}
      <section className="recent-highlights-container-box">
        <div className="section-title-wrapper">
          <h2>Recent Highlights</h2>
          <p className="subtitle">International Yoga Day Celebration 2026</p>
          <div className="section-title-divider"></div>
        </div>

        <div className="highlights-dashboard">
          {/* Main Video Highlight Card */}
          <div className="highlight-video-card">
            <div className="highlight-video-wrapper">
              <video
                key={activeYogaDayVideo}
                src={activeYogaDayVideo}
                controls
                className="highlight-video-player"
                poster={activeYogaDayVideo === yogaDayVideo1 ? yogaDay1 : yogaDay3}
                playsInline
              />
            </div>
            <div className="video-playlist-tabs">
              <button
                type="button"
                className={`playlist-tab ${activeYogaDayVideo === yogaDayVideo1 ? "active" : ""}`}
                onClick={() => setActiveYogaDayVideo(yogaDayVideo1)}
              >
                <Play size={12} fill="currentColor" style={{ marginRight: 6 }} /> Clip 1: Asana Flow
              </button>
              <button
                type="button"
                className={`playlist-tab ${activeYogaDayVideo === yogaDayVideo2 ? "active" : ""}`}
                onClick={() => setActiveYogaDayVideo(yogaDayVideo2)}
              >
                <Play size={12} fill="currentColor" style={{ marginRight: 6 }} /> Clip 2: Group Movement
              </button>
            </div>
          </div>

          {/* Photo Gallery Grid */}
          <div className="highlight-photos-panel">
            <div className="highlight-photos-grid">
              {[yogaDay2, yogaDay3, yogaDay4, yogaDay5].map((imgSrc, idx) => (
                <div 
                  key={idx} 
                  className="highlight-photo-item"
                  onClick={() => setSelectedLightboxImage(imgSrc)}
                >
                  <img src={imgSrc} alt={`Yoga Day Moment ${idx + 2}`} />
                  <div className="photo-hover-overlay">
                    <Maximize2 size={18} />
                  </div>
                </div>
              ))}
            </div>
            <div className="highlight-brief-card">
              <h4>Sanctuary Celebration</h4>
              <p>YogSaathi celebrated International Yoga Day 2026 with great enthusiasm, bringing together more than 150 participants to experience the transformative power of yoga.

                The session included physical warm-up exercises, yoga asanas, breathing practices, and collective Om chanting, creating an atmosphere of harmony, positivity, and inner peace. Participants from different age groups joined the celebration and experienced the benefits of yoga for physical health, mental well-being, and emotional balance.

                The participants highly appreciated the activities conducted during the event and expressed keen interest in YogSaathi's various offerings, including online yoga programs, free trial classes, and residential yoga retreats.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 🌿 Header Section */}
      <header className="livestream-header">
        <span className="badge">YogSaathi Sanctuary</span>
        <h1>Live Classes & <span>Interactive Events</span></h1>
        <p>
          Connect, flow, and align your energy in real-time with our master instructors.
          Stream live classes or catch up on past sanctuary events from anywhere.
        </p>
      </header>

      {/* 📺 Dashboard: Live Video Simulator & Live Chat */}
      <section className="livestream-dashboard">
        {/* Column 1: Video Player */}
        <div className="player-panel">
          <div className="video-wrapper">
            <img
              className="video-placeholder-img"
              src={s9}
              alt="Yoga Live Stream Banner"
            />
            <div className="player-overlay-gradient"></div>

            {/* Live Indicator overlay */}
            <div className="status-tags">
              <div className="tag-live">
                <span className="tag-live-dot"></span>
                LIVE
              </div>
              <div className="tag-viewers">
                <Users size={14} />
                284 watching
              </div>
            </div>

            {/* Timeline & Controls */}
            <div className="player-controls">
              <div className="controls-left">
                <button className="control-btn" onClick={() => handlePlayReplay("Sanctuary Live Stream")}>
                  <Play size={20} fill="#ffffff" />
                </button>
                <button className="control-btn">
                  <Volume2 size={20} />
                </button>
              </div>

              {/* Fake Timeline */}
              <div className="timeline-bar">
                <div className="timeline-progress"></div>
              </div>

              <div className="controls-right">
                <div className="equalizer-container">
                  <span className="eq-bar"></span>
                  <span className="eq-bar"></span>
                  <span className="eq-bar"></span>
                  <span className="eq-bar"></span>
                </div>
                <button className="control-btn">
                  <Maximize2 size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Stream Information Footer */}
          <div className="stream-info-footer">
            <div className="stream-info-text">
              <h3>Vinyasa Flow: Gentle Morning Alignments</h3>
              <p>
                <Clock size={14} /> Next Session Starts in: <strong>{formatCountdown(timeLeft)}</strong>
              </p>
            </div>
            <div className="instructor-brief">
              <div className="instructor-avatar-ring">
                <img src={s1} alt="Anya Sharma" />
              </div>
              <div className="instructor-details">
                <h5>Anya Sharma</h5>
                <span>Lead Yoga Therapist</span>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Simulated Live Chat */}
        <div className="chat-panel">
          <div className="chat-header">
            <h4>
              <MessageSquare size={18} />
              Sanctuary Live Chat
            </h4>
            <span className="chat-status-indicator">Connected</span>
          </div>

          {/* Messages feed */}
          <div className="chat-messages" ref={chatContainerRef}>
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`chat-message-bubble ${msg.isIncoming ? "incoming" : "outgoing"}`}
              >
                <div className="chat-sender-meta">
                  <span>{msg.sender}</span>
                  {msg.isMod && <span className="role-mod">MOD</span>}
                </div>
                <div className="chat-text-container">{msg.text}</div>
              </div>
            ))}
          </div>

          {/* Chat Form */}
          <form className="chat-input-form" onSubmit={handleSendMessage}>
            <input
              type="text"
              placeholder="Send a message to the sanctuary..."
              className="chat-input"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
            />
            <button type="submit" className="chat-send-btn">
              <Send size={16} />
            </button>
          </form>
        </div>
      </section>

      {/* 📅 Filterable Scheduled Events */}
      <section className="schedule-section">
        <div className="section-title-wrapper">
          <h2>Upcoming Live Schedule</h2>
          <div className="section-title-divider"></div>
        </div>

        {/* Filter categories */}
        <div className="schedule-filters">
          {["All", "Vinyasa", "Meditation", "Yin", "Breathwork"].map((category) => (
            <button
              key={category}
              className={`filter-tab ${activeFilter === category ? "active" : ""}`}
              onClick={() => setActiveFilter(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Grid cards */}
        <div className="schedule-grid">
          {filteredEvents.map((event) => (
            <article key={event.id} className="schedule-card">
              <div className="card-image-box">
                <img src={event.image} alt={event.title} />
                <span className={`card-status-badge ${event.status}`}>
                  {event.status === "live" ? "Live" : "Upcoming"}
                </span>
                <span className="card-level-badge">{event.level}</span>
              </div>

              <div className="card-details-box">
                <div className="card-time-row">
                  <span>
                    <Calendar size={14} />
                    {event.time}
                  </span>
                  <span>
                    <Clock size={14} />
                    {event.duration}
                  </span>
                </div>
                <h3>{event.title}</h3>
                <p>{event.desc}</p>

                <div className="card-footer">
                  <div className="card-instructor">
                    <img src={event.avatar} alt={event.instructor} />
                    <span>{event.instructor}</span>
                  </div>
                  <button
                    className="card-btn"
                    onClick={() => handleReserveSpot(event.title)}
                  >
                    Reserve Spot
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 🎥 Past Sanctuary Highlights */}
      <section className="past-highlights-section">
        <div className="past-highlights-container">
          <div className="section-title-wrapper">
            <h2>Past Replays & Highlights</h2>
            <div className="section-title-divider"></div>
          </div>

          <div className="past-slider-wrapper">
            <img
              className="past-slide-img"
              src={activePast.image}
              alt={activePast.title}
            />
            <div className="past-slider-overlay">
              <span className="tag">{activePast.tag}</span>
              <h3>{activePast.title}</h3>
              <p>{activePast.desc}</p>
              <button
                className="watch-btn"
                onClick={() => handlePlayReplay(activePast.title)}
              >
                <Play size={16} fill="currentColor" /> Watch Replay
              </button>
            </div>

            {/* Slider buttons */}
            <button
              className="slider-arrow prev"
              onClick={() =>
                setCurrentPastIndex(
                  currentPastIndex === 0 ? mockPastEvents.length - 1 : currentPastIndex - 1
                )
              }
            >
              <ChevronLeft size={24} />
            </button>
            <button
              className="slider-arrow next"
              onClick={() =>
                setCurrentPastIndex(
                  currentPastIndex === mockPastEvents.length - 1 ? 0 : currentPastIndex + 1
                )
              }
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </section>

      {/* 🖼️ Premium Media Gallery */}
      <section className="gallery-section-modern">
        <div className="section-title-wrapper">
          <h2>Sanctuary Gallery</h2>
          <div className="section-title-divider"></div>
        </div>

        <div className="gallery-grid">
          {galleryImages.map((img, idx) => (
            <div
              key={idx}
              className={`gallery-grid-item ${img.size}`}
              onClick={() => setSelectedLightboxImage(img.src)}
            >
              <img src={img.src} alt={`Gallery grid ${idx + 1}`} />
              <div className="gallery-item-overlay">
                <Maximize2 size={24} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 🔍 Lightbox Modal */}
      {selectedLightboxImage && (
        <div
          className="lightbox-modal"
          onClick={() => setSelectedLightboxImage(null)}
        >
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="lightbox-close"
              onClick={() => setSelectedLightboxImage(null)}
            >
              <X size={32} />
            </button>
            <img
              src={selectedLightboxImage}
              alt="High Resolution Sanctuary"
              className="lightbox-img"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Liveevent;
