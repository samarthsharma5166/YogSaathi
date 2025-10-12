import React from "react";
import "./CSS/Lifestyle.css";

const Lifestyle = () => {
  return (
    <div className="mental-wellness-container min-h-screen">
      <h2 className="text-3xl font-bold text-[#2e7d32]"> Life Style</h2>
      <p className="mental-subtext">
        Prioritize your mind with mindful practices, breathing techniques, and
        emotional balance.
      </p>

      <div className="mental-cards">
        <div className="mental-card">
          <h3>
            {" "}
            <span> 🗓️ </span> Daily Routine
          </h3>
          <p>Yoga sessions available on 365 days round the year.</p>
        </div>
        <div className="mental-card">
          <h3>
            {" "}
            <span> ⏰ </span> Flexible Timings
          </h3>
          <p>
            Six Sessions (Three morning and three evening) available on daily basis
          </p>
        </div>
        <div className="mental-card">
          <h3 className="">
            {" "}
            <span> 🧘‍♂️ </span> Stress-Free Lifestyle
          </h3>
          <p>
            yoga session will make your life stressfree and bring
            mental peace.
          </p>
        </div>
        <div className="mental-card">
          <h3>
            {" "}
            <span>⚡ </span> Enhanced Energy
          </h3>
          <p>Yoga session will bring energy, power & strength</p>
        </div>
      </div>
    </div>
  );
};

export default Lifestyle;
