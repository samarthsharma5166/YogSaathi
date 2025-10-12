import React from "react";
import "./CSS/Physical.css";

const Physical = () => {
  return (
    <div className="physical-container">
      <h1 className="text-3xl font-bold text-[#2e7d32]">Physical Wellness</h1>
      <p>Maintain flexibility and strength with our guided yoga routines.</p>
      <div className="physical-sections">
        <div className="physical-card">
          <h3>Daily Yoga Routine</h3>
          <p>45-minute daily yoga to keep you active and energetic.</p>
        </div>
        <div className="physical-card">
          <h3>Yoga Challenges</h3>
          <p>
            Start your 14-Day Free Trial to boost your physical wellness, tips,
            and guidance!
          </p>
        </div>
        <div className="physical-card">
          <h3>Transformation Stories</h3>
          <p>
            365-days Physical Wellness Plan using the Yoga model for lasting
            growth and results.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Physical;
