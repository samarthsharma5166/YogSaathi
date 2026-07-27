import React, { useRef } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Sparkles,
  Brain,
  Smile,
  Moon,
  Award,
  Users,
  Compass,
  TrendingUp,
  MapPin,
  Heart,
  Briefcase,
  Layers,
  Laptop
} from "lucide-react";
import heroImg from "../assets/corporate_yoga_hero.png";

const CorporateRetreats = () => {
  const modulesSectionRef = useRef(null);

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Why Corporate Yoga benefits list
  const corporateBenefits = [
    { text: "Reduce stress, anxiety, and mental fatigue", icon: <Brain className="w-5 h-5 text-emerald-600" /> },
    { text: "Improve focus, concentration, and clarity of thought", icon: <Compass className="w-5 h-5 text-amber-600" /> },
    { text: "Relieve back pain, neck stiffness, and spinal discomfort", icon: <Activity className="w-5 h-5 text-blue-600" /> },
    { text: "Improve posture, flexibility, and overall fitness", icon: <Award className="w-5 h-5 text-rose-600" /> },
    { text: "Enhance emotional balance and workplace happiness", icon: <Smile className="w-5 h-5 text-indigo-600" /> },
    { text: "Increase productivity, efficiency, and team performance", icon: <TrendingUp className="w-5 h-5 text-green-600" /> },
    { text: "Promote better sleep and healthier lifestyle habits", icon: <Moon className="w-5 h-5 text-violet-600" /> },
    { text: "Build stronger team bonding and positive work culture", icon: <Users className="w-5 h-5 text-teal-600" /> }
  ];

  // Tailor-Made Wellness Program Modules
  const wellnessModules = [
    { title: "Yoga Asanas for Back & Spine Care", color: "border-emerald-100 bg-emerald-50/40" },
    { title: "Desk Yoga & Stretching Sessions", color: "border-amber-100 bg-amber-50/40" },
    { title: "Stress & Anxiety Management", color: "border-teal-100 bg-teal-50/40" },
    { title: "Breathing Practices (Pranayama)", color: "border-blue-100 bg-blue-50/40" },
    { title: "Meditation & Mindfulness Sessions", color: "border-rose-100 bg-rose-50/40" },
    { title: "Focus & Concentration Enhancement", color: "border-indigo-100 bg-indigo-50/40" },
    { title: "Relaxation & Emotional Wellness Practices", color: "border-violet-100 bg-violet-50/40" },
    { title: "Team Wellness Activities", color: "border-cyan-100 bg-cyan-50/40" }
  ];

  // WhatsApp Link for corporate wellness query
  const whatsappUrl = "https://wa.me/+919971714091?text=Hi%20YogSaathi!%20I%20am%20interested%20in%20organizing%20a%20Corporate%20Yoga/Wellness%20program%20for%20my%20company.%20Can%20you%20share%20the%20packages%20and%20details?";

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F8F2] via-white to-[#EEF5EB] overflow-x-hidden text-gray-800 pb-20">
      {/* Background Decorative Soft Gradients */}
      <div className="absolute top-0 right-0 w-[45vw] h-[45vw] rounded-full bg-emerald-200/20 blur-[100px] -z-10 pointer-events-none" />
      <div className="absolute top-[45%] left-0 w-[35vw] h-[35vw] rounded-full bg-amber-100/30 blur-[90px] -z-10 pointer-events-none" />

      {/* ─── Hero Section ─── */}
      <section className="relative px-6 py-12 md:py-24 max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center gap-12">
        <div className="flex-1 space-y-8 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block"
          >
            <span className="great-vibes-regular text-emerald-600 block text-3xl md:text-4xl mb-1">
              Balanced Blossoms
            </span>
            <span className="text-xs tracking-widest text-emerald-800/60 font-semibold uppercase block text-center lg:text-left">
              Corporate Wellness
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-3xl sm:text-3xl lg:text-4xl font-extrabold text-gray-950 leading-tight animate-in"
          >
            Rejuvenate Teams. <br />
            Reduce Stress. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
              Improve Productivity.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium"
          >
            In today’s fast-paced corporate environment, long working hours, screen exposure, work pressure, and sedentary lifestyles often lead to stress, anxiety, fatigue, poor posture, back pain, reduced concentration, and declining productivity.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-base md:text-lg text-emerald-800 bg-emerald-50/80 border border-emerald-100 rounded-2xl p-5 max-w-2xl mx-auto lg:mx-0 font-semibold shadow-sm leading-relaxed"
          >
            At YogSaathi, we offer thoughtfully designed Corporate Yoga & Wellness Programs aimed at improving the physical, mental, and emotional well-being of employees while creating a happier, healthier, and more productive workplace culture.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-2"
          >
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-emerald-600 text-white rounded-full font-bold text-lg hover:bg-emerald-700 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 shadow-md text-center cursor-pointer"
            >
              Show Interest
            </a>
            <button
              onClick={() => scrollToSection(modulesSectionRef)}
              className="px-8 py-4 bg-white text-emerald-700 border-2 border-emerald-100 rounded-full font-bold text-lg hover:border-emerald-600 hover:bg-emerald-50/50 transition-all duration-300 shadow-sm cursor-pointer"
            >
              Explore Modules
            </button>
          </motion.div>
        </div>

        {/* Right side Illustration */}
        <div className="flex-1 w-full max-w-md lg:max-w-xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-100/40 to-teal-100/35 rounded-[40px] rotate-3 scale-105 -z-10" />
            <img
              src={heroImg}
              alt="Corporate Yoga Illustration"
              className="w-full h-auto rounded-[36px] shadow-2xl object-cover border border-white/50"
            />
          </motion.div>
        </div>
      </section>

      {/* ─── Why Corporate Yoga Section ─── */}
      <section className="px-6 py-16 md:py-24 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-950">
            Why Corporate Yoga?
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto font-medium">
            Our programs are specially curated to help professionals:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {corporateBenefits.map((item, idx) => (
           <div key={idx} className="h-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05, duration: 0.5 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="h-full p-[4px] rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex items-center text-left space-x-4"
              >
                <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100 flex-shrink-0">
                  {item.icon}
                </div>
                <p className="font-bold text-gray-900 text-sm md:text-base leading-snug">
                  {item.text}
                </p>
              </motion.div>
           </div>
          ))}
        </div>
      </section>

      {/* ─── Tailor-Made Wellness Programs Section ─── */}
      <section ref={modulesSectionRef} className="px-6 py-16 md:py-24 max-w-6xl mx-auto space-y-12 scroll-mt-24">
        <div className="text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-950">
            Tailor-Made Wellness Programs
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto font-medium">
            Every organization and team has different needs. Therefore, YogSaathi offers customized wellness modules designed specifically for your employees, leadership teams, departments, or work culture requirements.
          </p>
        </div>
        <div>
        
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wellnessModules.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.5 }}
              className={`p-2! rounded-2xl border ${item.color} shadow-sm text-center flex flex-col justify-center items-center min-h-[70px]`}
            >
              <h3 className="font-bold text-gray-900 text-sm! md:text-base">
                {item.title}
              </h3>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Wellness in Rishikesh Retreats Section ─── */}
      <section className="px-6 py-12 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="backdrop-blur-md bg-white/70 border border-white/80 rounded-3xl p-8 md:p-12 shadow-xl flex flex-col md:flex-row items-center gap-8 relative overflow-hidden"
        >
          <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-emerald-500 to-teal-500" />
          <div className="space-y-4 flex-1">
            <h3 className="text-xl md:text-2xl font-extrabold text-gray-950 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-emerald-600" />
              <span>Wellness in the Serene Environment of Rishikesh</span>
            </h3>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed font-medium">
              Our Corporate Yoga Programs can be conducted as exclusive physical retreats in the peaceful and spiritual environment of Rishikesh — allowing employees to disconnect from daily stress and reconnect with health, clarity, and inner balance.
            </p>
            <p className="text-gray-500 text-sm leading-relaxed">
              The retreats are thoughtfully designed to combine wellness, relaxation, team engagement, and rejuvenation in a natural and inspiring setting.
            </p>
          </div>
        </motion.div>
      </section>

      {/* ─── Corporate Wellness with Purpose & Tagline Section ─── */}
      <section className="px-6 py-12 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-r from-emerald-900 to-teal-800 rounded-[32px] text-white p-8 md:p-12 shadow-2xl text-center space-y-6 overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/5 rounded-full blur-3xl transform translate-x-1/2 pointer-events-none" />
          
          <h3 className="text-2xl md:text-3xl text-white font-extrabold">
            Corporate Wellness with Purpose
          </h3>
          
          <p className="text-emerald-100 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            At YogSaathi, we believe that healthier and happier employees create stronger organizations. Our mission is to support companies in building a culture of wellness, positivity, and sustainable performance through authentic Yoga and holistic well-being practices.
          </p>

          <div className="flex justify-center pt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white text-emerald-800 rounded-full font-bold text-lg hover:bg-emerald-50 hover:shadow-xl transition-all duration-300 inline-block cursor-pointer"
            >
              Show Interest
            </a>
          </div>

          <div className="pt-6 border-t border-white/10 max-w-xs mx-auto">
            <span className="great-vibes-regular text-2xl text-emerald-300 tracking-wide block">
              YogSaathi
            </span>
            <span className="great-vibes-regular text-2xl text-emerald-300 tracking-wide block">
              Together in Every Asana 🧘‍♀️
            </span>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default CorporateRetreats;