import React from 'react';
import './CSS/Nutrition.css';

const Nutrition = () => {
  return (
    <div className="nutrition-container">
      <h1>Nutrition & Yoga</h1>
      <p>Discover meal plans, detox routines, and tips to enhance your yoga journey through nutrition.</p>
      <div className="nutrition-sections">
        <div className="nutrition-card">
          <h3>Beginner Diet Plan</h3>
          <p>A simple vegetarian plan to kickstart your wellness.</p>
        </div>
        <div className="nutrition-card">
          <h3>Hydration Tips</h3>
          <p>Learn how much water you need and when to drink.</p>
        </div>
        <div className="nutrition-card">
          <h3>Detox Plans</h3>
          <p>1-day and 3-day juice detox options curated by our experts.</p>
        </div>
      </div>
    </div>
  );
};

export default Nutrition;
