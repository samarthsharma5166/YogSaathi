import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity, Sparkles, Brain, Smile, Moon, Award, Users, Compass, CheckCircle2, Calendar, AlertCircle, Check, Globe, Mail, Phone, Clock, Laptop
} from "lucide-react";
import heroImg from "../assets/overseas_yoga_hero.png";
import { createOverseasInquiry } from "../services/api";

const OverseasPrograms = () => {
  const formRef = useRef(null);
  const scrollToSection = (ref) => ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const [formData, setFormData] = useState({
    name: "", country: "", timings: "", whatsapp: "", email: "", joiningDate: "", healthGoal: ""
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.country.trim()) errors.country = "Country of residence is required";
    if (!formData.timings.trim()) errors.timings = "Preferred class timings are required";
    if (!formData.whatsapp.trim()) errors.whatsapp = "WhatsApp number is required";
    if (!formData.email.trim()) {
      errors.email = "E-mail address is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) errors.email = "Please enter a valid e-mail address";
    }
    if (!formData.joiningDate) errors.joiningDate = "Planned joining date is required";
    return errors;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setIsSubmitting(true);
    setSubmitError("");
    try {
      const response = await createOverseasInquiry(formData);
      if (response.data && response.data.success) {
        setIsSubmitted(true);
      } else {
        setSubmitError(response.data.message || "Failed to submit inquiry.");
      }
    } catch (err) {
      setSubmitError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const features = [
    "Live online sessions", "Daily sessions available",
    "Flexible timing as per participant’s convenience and time zone",
    "Sessions can be arranged even for a single participant",
    "Suitable for beginners as well as regular practitioners",
    "Combination of Yoga, Breathing Exercises, Relaxation, and Meditation",
    "Duration of each session: 45 Minutes", "Personalized attention and guidance"
  ];

  const benefits = [
    { text: "Improved flexibility and strength", icon: <Activity className="w-5 h-5 text-emerald-600" /> },
    { text: "Reduction in stress and anxiety", icon: <Smile className="w-5 h-5 text-rose-600" /> },
    { text: "Better posture and body balance", icon: <CheckCircle2 className="w-5 h-5 text-indigo-600" /> },
    { text: "Improved concentration and mental calmness", icon: <Brain className="w-5 h-5 text-blue-600" /> },
    { text: "Enhanced energy levels and sleep quality", icon: <Moon className="w-5 h-5 text-violet-600" /> },
    { text: "Overall physical and emotional well-being", icon: <Sparkles className="w-5 h-5 text-amber-600" /> }
  ];

  return (
    <div className="overseas-programs-page min-h-screen bg-gradient-to-b from-[#F5F8F2] via-white to-[#EEF5EB] overflow-x-hidden text-gray-800 pb-20">
      <style dangerouslySetInnerHTML={{__html: `
        .overseas-programs-page, 
        .overseas-programs-page *:not(.great-vibes-regular) {
          font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif !important;
        }
      `}} />
      <div className="absolute top-0 right-0 w-[45vw] h-[45vw] rounded-full bg-emerald-200/20 blur-[100px] -z-10 pointer-events-none" />
      <div className="absolute top-[45%] left-0 w-[35vw] h-[35vw] rounded-full bg-amber-100/30 blur-[90px] -z-10 pointer-events-none" />

      <section className="relative px-6 py-12 md:py-24 max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center gap-12">
        <div className="flex-1 space-y-8 text-center lg:text-left">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="inline-block">
            <span className="great-vibes-regular text-emerald-600 block text-3xl md:text-4xl mb-1">Balanced Blossoms</span>
            <span className="text-xs tracking-widest text-emerald-800/60 font-semibold uppercase block">Global Online Yoga</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl sm:text-3xl lg:text-4xl font-extrabold text-gray-950 leading-tight">
            Online Live Sessions <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">For Overseas Participants</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
            Experience authentic Yoga, Breathing Practices, and Meditation from the comfort of your home — anywhere in the world. The Session Timings will be fixed as per Participants’ convenience. Please click the button on the bottom to show your interest and tell us what time is convenient for you.
          </motion.p>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-base text-emerald-800 bg-emerald-50/80 border border-emerald-100 rounded-2xl p-5 max-w-2xl mx-auto lg:mx-0 font-semibold leading-relaxed">
            We are pleased to offer Online Live Yoga Sessions specially designed for overseas participants seeking better physical health, mental calmness, flexibility, stress reduction, and overall well-being. These Programs are available at very reasonable rates- please go to SUBSCRIPTION for pricing (Applicable in $).
          </motion.p>
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-2">
            <button onClick={() => scrollToSection(formRef)} className="px-8 py-4 bg-emerald-600 text-white rounded-full font-bold text-lg hover:bg-emerald-700 hover:shadow-xl hover:-translate-y-0.5 transition-all shadow-md cursor-pointer">Show Interest</button>
            <a href="/price" className="px-8 py-4 bg-white text-emerald-700 border-2 border-emerald-100 rounded-full font-bold text-lg hover:border-emerald-600 hover:bg-emerald-50/55 transition-all shadow-sm text-center">View Subscriptions ($)</a>
          </div>
        </div>
        <div className="flex-1 w-full max-w-md lg:max-w-xl">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-100/40 to-teal-100/35 rounded-[40px] rotate-3 scale-105 -z-10" />
            <img src={heroImg} alt="Overseas Yoga" className="w-full h-auto rounded-[36px] shadow-2xl border border-white/50" />
          </div>
        </div>
      </section>

      <section className="px-6 py-16 max-w-5xl mx-auto space-y-12">
        <h2 className="text-2xl text-center font-extrabold text-gray-950">Features of the Program</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((item, idx) => (
            <div key={idx}>
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
                <div className="bg-emerald-50 p-2 rounded-xl text-emerald-600 mt-0.5"><CheckCircle2 className="w-5 h-5" /></div>
                <p className="text-gray-700 font-semibold text-base leading-relaxed">{item}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-16 max-w-6xl mx-auto space-y-12">
        <h2 className="text-2xl text-center font-extrabold text-gray-950">Regular practice may help in:</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((item, idx) => (
            <div key={idx}>
              <div className="p-3 rounded-2xl bg-white border border-gray-100 shadow-sm flex flex-col items-center text-center space-y-4">
                <div className="bg-emerald-50 p-3 rounded-full border border-emerald-100">{item.icon}</div>
                <p className="font-bold text-gray-900 text-base leading-snug">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-8 max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-2 bg-emerald-500" />
          <p className="text-gray-600 text-lg leading-relaxed font-semibold text-center md:text-left">
            Whether you are a working professional, homemaker, senior citizen, student, or someone looking to begin a healthier lifestyle, these sessions are designed to support your wellness journey.
          </p>
        </div>
      </section>

      <section ref={formRef} className="px-6 py-16 max-w-3xl mx-auto scroll-mt-24">
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-2xl p-8 md:p-12 relative overflow-hidden">
          <AnimatePresence>
            {isSubmitted && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-white z-20 flex flex-col items-center justify-center text-center p-8 space-y-6">
                <div className="bg-emerald-100 p-6 rounded-full text-emerald-600"><Check className="w-16 h-16" strokeWidth={3} /></div>
                <h3 className="text-2xl font-bold text-gray-950">Interest Registered!</h3>
                <p className="text-gray-600 text-base">Thank you, {formData.name}! We will contact you at {formData.email} or WhatsApp {formData.whatsapp}.</p>
                <button onClick={() => setIsSubmitted(false)} className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700">Register Another</button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-6">
            <h2 className="text-3xl font-extrabold text-gray-900 text-center">Overseas Session Booking</h2>
            <form onSubmit={handleFormSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Full Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                  {formErrors.name && <p className="text-red-500 text-xs">{formErrors.name}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Country of Residence *</label>
                  <input type="text" name="country" value={formData.country} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                  {formErrors.country && <p className="text-red-500 text-xs">{formErrors.country}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold">Preferred Class Timings (IST) *</label>
                  <input type="text" name="timings" value={formData.timings} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                  {formErrors.timings && <p className="text-red-500 text-xs">{formErrors.timings}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold">WhatsApp Number *</label>
                  <input type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                  {formErrors.whatsapp && <p className="text-red-500 text-xs">{formErrors.whatsapp}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold">E-Mail Address *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                  {formErrors.email && <p className="text-red-500 text-xs">{formErrors.email}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold">Planned Joining Date *</label>
                  <input type="date" name="joiningDate" value={formData.joiningDate} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                  {formErrors.joiningDate && <p className="text-red-500 text-xs">{formErrors.joiningDate}</p>}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold">Specific Health / Wellness Goal (Optional)</label>
                <textarea name="healthGoal" rows="3" value={formData.healthGoal} onChange={handleInputChange} placeholder="maximum 250 words" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm resize-none"></textarea>
              </div>
              {submitError && <p className="text-red-500 text-xs">{submitError}</p>}
              <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold">{isSubmitting ? "Submitting..." : "Submit"}</button>
            </form>
          </div>
        </div>
      </section>

      <section className="px-6 py-6 text-center max-w-xs mx-auto">
        <div className="border-t border-gray-200 pt-6">
          <span className="great-vibes-regular text-2xl text-emerald-600 block">YogSaathi</span>
          <span className="great-vibes-regular text-2xl text-emerald-600 block">Together in Every Asana</span>
        </div>
      </section>
    </div>
  );
};

export default OverseasPrograms;
