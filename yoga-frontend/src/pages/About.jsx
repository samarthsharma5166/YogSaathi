import React from 'react';
import founderImg from '../assets/yogasite.jpg';
// import forewordImg from '../assets/yogasite2.jpg';
import "./CSS/About.css"
const About = () => {
  return (
    <div className="about-container bg-gray-50 py-12 px-6 sm:px-12">
      <div className="max-w-6xl mx-auto container bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-center text-[#2e7d32] mb-4">
          About Us
        </h1>
        <p className="text-center text-gray-600 text-lg mb-2 max-w-3xl mx-auto">
          Welcome to{" "}
          <span className="font-semibold text-[#424242]">YogSaathi</span> — Your
          Companion for Everyday Yoga!
        </p>
        <div className="about-flex">
          {/* <div className="image-box">
            <img src={founderImg} alt="Founder - Sanjay Kumar Mahesh" />
          </div> */}
          <div>
            {/* <h2 className="text-2xl font-semibold mb-2 text-[#424242]">
              Founder & CEO - Sanjay Kumar Mahesh
            </h2> */}
            <p className="text-gray-700 text-center">
              At YogSaathi, we believe that Yoga is not just an exercise — it is
              a way to bring balance, wellness, and peace into everyday life.
              Our mission is to make authentic Yoga affordable, accessible, and
              practical for everyone.
            </p>
          </div>
        </div>

        <div className="about-section">
          <h3 className="text-[#424242]">What Makes YogSaathi Special?</h3>
          <ul>
            <li>
              <strong>✨ Flexible Timings:</strong> 6 convenient time slots
              every day.
            </li>
            <li>
              <strong>✨ Daily Yoga, Year-Round:</strong> 365 days of expert-led
              sessions.
            </li>
            <li>
              <strong>✨ Thoughtful Curriculum:</strong> Asanas for body, mind,
              and balance.
            </li>
            <li>
              <strong>✨ Highly Affordable:</strong> Premium yoga at a price that
              suits every pocket.
            </li>
          </ul>
        </div>

        <div className="vision-flex">
          <div className="image-box">
            <img src={founderImg} alt="Founder - Sanjay Kumar Mahesh" />
          </div>
          <div>
            <h3 className="text-[#424242]">Promoted by Experience & Passion</h3>
            <p className="mt-3 text-gray-700">
              YogSaathi is proudly promoted by Sanjay Kumar Mahesh, an IIT
              Roorkee Engineering Graduate with 38 years of rich corporate
              experience. His vision and dedication are the driving forces
              behind this initiative — to spread Yoga and general wellness to
              every corner of society.
            </p>
          </div>
        </div>

        <div className="vision-flex">
          <div>
            <h3 className="text-[#424242]">Our Vision & Aim</h3>

           We are committed to make Yoga an integral part of everyday life, helping people build strength, flexibility, and mental peace. Our goal is to reach every home, make Yoga truly affordable, and inspire people to embrace a healthier lifestyle.
          </div>
          {/* <div className="image-box">
            <img src={forewordImg} alt="Yoga Practice" />
          </div> */}
        </div>
        <h1 className='text-center text-gray-600 text-lg mb-10 max-w-3xl mx-auto'>“YogSaathi- together in every asana”</h1>
      </div>
    </div>
  );
};
export default About;
