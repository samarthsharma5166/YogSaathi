import React from "react";
import "./CSS/mentalhealth.css";

const MentalWellness = () => {
  return (
    <div className="mental-wellness-container min-h-screen">
      <h2 className="text-3xl font-bold text-[#2e7d32]"> Mental Wellness</h2>
      <p className="mental-subtext">
        Prioritize your mind with mindful practices, breathing techniques, and
        emotional balance.
      </p>

      <div className="mental-cards">
        <div className="mental-card">
          <h3>🌿 Meditation</h3>
          <p>
            Learn techniques to reduce stress, calm your thoughts, and improve
            focus.
          </p>
        </div>
        <div className="mental-card">
          <h3>🌬️ Breathing Exercises</h3>
          <p>Master pranayama to boost energy and control anxiety naturally.</p>
        </div>
        <div className="mental-card">
          <h3 className="">🧠 Positive Thinking</h3>
          <p>
            Build a resilient mindset and overcome daily challenges with
            optimism.
          </p>
        </div>
        <div className="mental-card">
          <h3>🛌 Sleep Health</h3>
          <p>
            Improve your sleep quality through guided relaxation and evening
            yoga.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MentalWellness;
