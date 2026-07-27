import React, { useRef } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Sparkles,
  Brain,
  Smile,
  Moon,
  Shield,
  Award,
  CheckCircle2,
  Heart,
  Sun,
  Clock,
  Compass,
  HeartPulse
} from "lucide-react";
import heroImg from "../assets/womens_yoga_hero.png";

const WomensProgram = () => {
  const benefitsSectionRef = useRef(null);

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Why Women Yoga Is Important - 14 key benefits list
  const benefits = [
    { text: "Improved flexibility and mobility", icon: <Activity className="w-5 h-5 text-emerald-600" />, bg: "bg-emerald-50/70 border-emerald-100" },
    { text: "Better balance", icon: <Compass className="w-5 h-5 text-amber-600" />, bg: "bg-amber-50/70 border-amber-100" },
    { text: "Increased strength", icon: <Award className="w-5 h-5 text-blue-600" />, bg: "bg-blue-50/70 border-blue-100" },
    { text: "Pain management and relief", icon: <HeartPulse className="w-5 h-5 text-rose-600" />, bg: "bg-rose-50/70 border-rose-100" },
    { text: "Improved circulation", icon: <Activity className="w-5 h-5 text-red-600" />, bg: "bg-red-50/70 border-red-100" },
    { text: "Better posture", icon: <CheckCircle2 className="w-5 h-5 text-indigo-600" />, bg: "bg-indigo-50/70 border-indigo-100" },
    { text: "Improved bone health", icon: <Shield className="w-5 h-5 text-orange-600" />, bg: "bg-orange-50/70 border-orange-100" },
    { text: "Stress reduction", icon: <Smile className="w-5 h-5 text-pink-600" />, bg: "bg-pink-50/70 border-pink-100" },
    { text: "Weight management", icon: <Sparkles className="w-5 h-5 text-purple-600" />, bg: "bg-purple-50/70 border-purple-100" },
    { text: "emotional well-being", icon: <Sun className="w-5 h-5 text-yellow-600" />, bg: "bg-yellow-50/70 border-yellow-100" },
    { text: "Improved sleep quality", icon: <Moon className="w-5 h-5 text-violet-600" />, bg: "bg-violet-50/70 border-violet-100" },
    { text: "Increased body awareness", icon: <Brain className="w-5 h-5 text-teal-600" />, bg: "bg-teal-50/70 border-teal-100" },
    { text: "Menstrual symptom relief", icon: <Heart className="w-5 h-5 text-red-500" />, bg: "bg-red-50/70 border-red-100" },
    { text: "Healthy aging", icon: <Clock className="w-5 h-5 text-cyan-600" />, bg: "bg-cyan-50/70 border-cyan-100" }
  ];

  // WhatsApp Link targeting updated contact number
  const whatsappUrl = "https://wa.me/+919971714091?text=Hi%20YogSaathi!%20I%20am%20interested%20in%20enrolling%20in%20your%20Women%20Yoga%20Program.%20Can%20you%20provide%20more%20details?";

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F8F2] via-white to-[#EEF5EB] overflow-x-hidden text-gray-800 pb-20">
      {/* Background Blobs for Atmosphere */}
      <div className="absolute top-0 right-0 w-[45vw] h-[45vw] rounded-full bg-emerald-200/20 blur-[100px] -z-10 pointer-events-none" />
      <div className="absolute top-[40%] left-0 w-[35vw] h-[35vw] rounded-full bg-amber-100/30 blur-[90px] -z-10 pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-teal-200/25 blur-[120px] -z-10 pointer-events-none" />

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
              Women Wellness
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-3xl sm:text-3xl lg:text-4xl font-extrabold text-gray-950 leading-tight"
          >
            Empowering & Joyful <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
              Yoga for Women
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium"
          >
            Welcome to YogSaathi’s Women Yoga Program — a joyful blend of movement, mindfulness, and fun specially designed for Ladies. Through engaging yoga activities, breathing exercises, and relaxation practices, women develop strength, focus, confidence, and healthy habits in a positive and nurturing environment.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
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
              onClick={() => scrollToSection(benefitsSectionRef)}
              className="px-8 py-4 bg-white text-emerald-700 border-2 border-emerald-100 rounded-full font-bold text-lg hover:border-emerald-600 hover:bg-emerald-50/50 transition-all duration-300 shadow-sm cursor-pointer"
            >
              Explore Benefits
            </button>
          </motion.div>
        </div>

        {/* Right side Image illustration */}
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
              alt="Women Yoga Illustration"
              className="w-full h-auto rounded-[36px] shadow-2xl object-cover border border-white/50"
            />
          </motion.div>
        </div>
      </section>

      {/* ─── Philosophy Section ─── */}
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
            <p className="text-gray-600 text-lg md:text-xl leading-relaxed font-medium">
              “At YogSaathi, we believe yoga is a beautiful journey of growth, balance, and happiness — and every women deserves to experience it in a joyful and encouraging environment.”
            </p>
          </div>
          <div className="flex-shrink-0 bg-emerald-50 p-5 rounded-full border border-emerald-100">
            <Heart className="w-10 h-10 text-emerald-600 animate-pulse" />
          </div>
        </motion.div>
      </section>

      {/* ─── Why Women Yoga Is Important Section ─── */}
      <section ref={benefitsSectionRef} className="px-6 py-16 md:py-24 max-w-6xl mx-auto space-y-12 scroll-mt-24">
        <div className="text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-950">
            Why Women Yoga Is Important
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto font-medium">
            In today’s fast-paced and screen-oriented lifestyle, yoga helps ladies stay balanced, focused, and emotionally healthy. Yoga’s key benefits for women include:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {benefits.map((item, idx) => (
           <div key={idx} className="h-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05, duration: 0.5 }}
                whileHover={{ y: -5, scale: 1.01 }}
                className={`h-full p-[0.8px] rounded-2xl border ${item.bg} shadow-sm backdrop-blur-sm transition-all duration-300 flex items-center text-left space-x-4`}
              >
                <div className="bg-white p-3 rounded-xl w-fit shadow-sm border border-gray-100 flex-shrink-0">
                  {item.icon}
                </div>
                <p className="font-bold text-gray-900 text-sm sm:text-base leading-snug">
                  {item.text}
                </p>
              </motion.div>
           </div>
          ))}
        </div>
      </section>

      {/* ─── Call to Action / Tagline Section ─── */}
      <section className="px-6 py-12 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-r from-emerald-900 to-teal-800 rounded-[32px] text-white p-8 md:p-12 shadow-2xl text-center space-y-6 overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/5 rounded-full blur-3xl transform translate-x-1/2 pointer-events-none" />
          
          <h3 className="text-2xl md:text-3xl text-white! font-extrabold">
            Ready to begin your journey of growth and happiness?
          </h3>
          
          <div className="flex justify-center">
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
              Together in Every Asana
            </span>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default WomensProgram;
