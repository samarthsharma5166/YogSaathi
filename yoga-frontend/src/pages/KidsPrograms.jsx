import React, { useRef } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Sparkles,
  Brain,
  Smile,
  Moon,
  Apple,
  Award,
  CheckCircle2,
  Heart,
  ChevronRight,
  Compass,
  Laptop
} from "lucide-react";
import heroImg from "../assets/kids_yoga_hero.png";

const KidsPrograms = () => {
  const teachSectionRef = useRef(null);

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Why Kids Yoga is Important items
  const importanceItems = [
    { text: "Improves flexibility, balance & posture", icon: <Activity className="w-5 h-5 text-emerald-600" /> },
    { text: "Builds strength & body awareness", icon: <Award className="w-5 h-5 text-amber-600" /> },
    { text: "Enhances concentration & memory", icon: <Brain className="w-5 h-5 text-blue-600" /> },
    { text: "Reduces stress, anxiety & hyperactivity", icon: <Smile className="w-5 h-5 text-rose-600" /> },
    { text: "Promotes better sleep", icon: <Moon className="w-5 h-5 text-indigo-600" /> },
    { text: "Helps prevent childhood obesity", icon: <Apple className="w-5 h-5 text-green-600" /> },
    { text: "Boosts self-esteem & confidence", icon: <Sparkles className="w-5 h-5 text-violet-600" /> },
    { text: "Encourages discipline & healthy habits", icon: <CheckCircle2 className="w-5 h-5 text-teal-600" /> }
  ];

  // What We Teach items
  const teachItems = [
    {
      title: "Fun Yoga Asanas",
      description: "Animal poses, balance poses, and stretching exercises taught through games and stories.",
      color: "border-emerald-100 bg-emerald-50/50"
    },
    {
      title: "Yoga for Focus & Confidence",
      description: "Activities designed to improve attention span, self-confidence, and emotional balance.",
      color: "border-blue-100 bg-blue-50/50"
    },
    {
      title: "Breathing Exercises (Pranayama)",
      description: "Simple breathing techniques to calm the mind and improve focus.",
      color: "border-amber-100 bg-amber-50/50"
    },
    {
      title: "Mindfulness & Relaxation",
      description: "Short guided relaxation and meditation to help kids feel calm and happy.",
      color: "border-teal-100 bg-teal-50/50"
    }
    
  ];

  // WhatsApp Link Helper
    const whatsappUrl = "https://wa.me/+919971714091?text=Hi%20YogSaathi!%20I%20am%20interested%20in%20enrolling%20my%20child%20in%20your%20Kids%20Yoga%20classes.%20Can%20you%20provide%20more%20details?";

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
              Mindfulness for Kids
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-3xl sm:text-3xl lg:text-4xl font-extrabold text-gray-950 leading-tight"
          >
            Fun, Safe & Healthy <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
              Yoga for Kids
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-lg md:text-xl text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium"
          >
            Our Kids Yoga <span className="font-bold text-emerald-600">offline</span> classes are specially designed to help children grow stronger, calmer, and more confident through fun and engaging yoga practices. Using playful movements, breathing exercises, and simple meditation, kids learn healthy habits while enjoying every session.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-sm md:text-base text-emerald-800 bg-emerald-50/80 border border-emerald-100 rounded-2xl p-4 max-w-xl mx-auto lg:mx-0 font-semibold shadow-sm leading-relaxed"
          >
            Perfect for children aged 6–14 years, our kids’ yoga programs support both physical fitness and mental well-being – divided in two Sub-Groups (6-9 Years and 10-14 Years).
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-2"
          >
            {/* <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-emerald-600 text-white rounded-full font-bold text-lg hover:bg-emerald-700 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 shadow-md text-center cursor-pointer"
            >
              Book a Free Trial
            </a> */}
            <button
              onClick={() => scrollToSection(teachSectionRef)}
              className="px-8 py-4 bg-white text-emerald-700 border-2 border-emerald-100 rounded-full font-bold text-lg hover:border-emerald-600 hover:bg-emerald-50/50 transition-all duration-300 shadow-sm cursor-pointer"
            >
              Explore Programs
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
              alt="Kids Yoga Illustration"
              className="w-full h-auto rounded-[36px] shadow-2xl object-cover border border-white/50"
            />
          </motion.div>
        </div>
      </section>

      {/* ─── About Section ─── */}
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
            <p className="text-gray-600 text-lg leading-relaxed font-medium">
              Welcome to a world of joy, movement, and mindfulness designed especially for your little ones by YogSaathi. Our Kids’ Yoga classes are more than just a form of exercise; they are playful adventures that nurture both the bodies and minds of your children.
            </p>
          </div>
          <div className="flex-shrink-0 bg-emerald-50 p-5 rounded-full border border-emerald-100">
            <Heart className="w-10 h-10 text-emerald-600 animate-pulse" />
          </div>
        </motion.div>
      </section>

      {/* ─── Why Kids Yoga Is Important Section ─── */}
      <section className="px-6 py-16 md:py-24 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-950">
            Why Kids Yoga Is Important
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto font-medium">
            In today’s screen-heavy and stressful lifestyle, yoga helps children stay balanced and focused-
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {importanceItems.map((item, idx) => (
            <div key={idx} className="h-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08, duration: 0.5 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="h-full p-[4px] rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex items-center text-left space-x-4"
              >
                <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100 flex-shrink-0">
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

      {/* ─── What We Teach Section ─── */}
      <section ref={teachSectionRef} className="px-6 py-16 md:py-24 max-w-6xl mx-auto space-y-12 scroll-mt-24">
        <div className="text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-950">
            What We Teach in Kids Yoga Classes
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto font-medium">
            Our kids yoga sessions are age-appropriate, safe, and fun:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {teachItems.map((item, idx) => (
            <div>
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                className={`p-6 rounded-3xl border shadow-sm hover:shadow-md transition-all duration-300 ${item.color} flex flex-col justify-between`}
              >
                <div className="space-y-4">
                  <h3 className="text-xl font-extrabold text-gray-900">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed font-medium">
                    {item.description}
                  </p>
                </div>
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
            Ready to give your child the gift of mindfulness?
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

export default KidsPrograms;
