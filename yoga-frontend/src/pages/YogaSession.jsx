import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { ArrowRight, Sparkles, User, Phone, Mail, Clock, Calendar, CheckCircle2, ShieldCheck, Heart, Flame } from "lucide-react";

export default function YogaSession() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    promocode: ""
  });
  
  const [selectedChallenge, setSelectedChallenge] = useState("");
  const [slotsLeft, setSlotsLeft] = useState(3); // Mock remaining slots for early bird

  const challenges = [
    { id: "cravings", label: "Stubborn Cravings", icon: "🍽️" },
    { id: "metabolism", label: "Slow Metabolism", icon: "⚡" },
    { id: "hormones", label: "Hormonal Plateaus", icon: "⚖️" },
    { id: "consistency", label: "Lack of Consistency", icon: "🏃" }
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.email) {
      toast.error("Please fill in all details to secure your spot!");
      return;
    }

    if (formData.phone.length < 10) {
      toast.error("Please enter a valid phone number!");
      return;
    }

    // Success notification
    toast.success("Details captured! Redirecting to secure early-bird pricing...", {
      duration: 4000
    });

    // Reduce slot count just for client simulation
    if (slotsLeft > 1) {
      setSlotsLeft(prev => prev - 1);
    }

    // Redirect to WhatsApp with prefilled message
    setTimeout(() => {
      const waNumber = "919971714091";
      const challengeStr = selectedChallenge ? `\n• Primary Challenge: ${selectedChallenge}` : "";
      const promoStr = formData.promocode ? `\n• Promo Code: ${formData.promocode.toUpperCase()}` : "";
      const message = `Hi YogSaathi! I want to register for the Weight Loss & Sustainable Fat Burning Yoga Session on 12-Jul-2026.\n\nMy Details:\n• Name: ${formData.name}\n• Phone: ${formData.phone}\n• Email: ${formData.email}${challengeStr}${promoStr}\n\nPlease secure my early bird slot at ₹99!`;
      const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
      window.open(url, "_blank");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#12211d] font-sans overflow-x-hidden relative pb-24 !pt-5">
      <Toaster position="top-center" reverseOrder={false} />
      
      {/* 🚀 Fonts & Marquee Animation */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        
        .font-display {
          font-family: 'Cormorant Garamond', serif;
        }
        
        @keyframes marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .animate-marquee {
          display: inline-flex;
          white-space: nowrap;
          animation: marquee 28s linear infinite;
        }
      `}</style>

      {/* 📣 Elegant Announcement Sliding Banner */}
      <div className="ticker-wrap w-full bg-[#EAF3DE] border-b border-[#d4edbc] text-[#3B6D11] py-3 overflow-hidden font-bold uppercase tracking-wider text-xs">
        <div className="animate-marquee">
          {[...Array(6)].map((_, i) => (
            <span key={i} className="inline-block px-8">
              🔥 Lifestyle Disorders (Diabetes, BP & Heart Health) Session • Early Bird Offer ₹99 Active for First 10 Candidates • Only {slotsLeft} Slots Left! 🔥
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 mt-6">
        
        {/* 🌟 Giant Elegant Serif Header */}
        <div className="mb-8 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#EAF3DE] text-[#3B6D11] px-4 py-1.5 rounded-full text-xl font-bold uppercase tracking-wider mb-3">
            Special Interactive Yoga Session
          </div>
          
          <h1 className="font-display text-3xl sm:text-4xl md:text-[36px] mt-2 font-bold tracking-tight text-[#12211d] leading-none mb-3">
            Lifestyle Disorders <span className="font-display font-medium italic text-[#3B6D11]">{"(Diabetes, BP & Heart Health)"}</span>
          </h1>
          
          <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Reclaim your health and vitality. Join YogSaathi’s master yoga therapist for a premium 60 to 70 minute live session to discover therapeutic yoga sequences, breath regulation, and stress-reduction secrets scientifically structured to manage Diabetes, stabilize blood pressure, and boost cardiovascular wellness.
          </p>
        </div>

        {/* ⚡ Split Hero Booking Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-8">
          
          {/* LEFT COLUMN: Large Pricing Stack (Soft Green Card) */}
          <div className="lg:col-span-7 bg-[#EAF3DE]/60 border border-[#d4edbc] p-6 rounded-3xl flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center gap-1.5 text-[#3B6D11] text-xs font-bold uppercase tracking-wider mb-3">
                <Flame className="w-4 h-4 fill-currentColor" /> Early Bird Offer
              </div>
              
              <div className="flex items-baseline gap-6 flex-wrap">
                <div className="text-[70px] md:text-[90px] font-semibold leading-none text-[#12211d] tracking-tighter flex items-start">
                  <span className="text-3xl font-normal mt-2 mr-1">₹</span>99
                </div>
                <div className="mb-2">
                  <div className="text-gray-500 font-medium text-base line-through">
                    Regular: ₹149
                  </div>
                  <div className="text-[#3B6D11] font-bold text-xs tracking-wide mt-0.5">
                    Save ₹50 (33% OFF)
                  </div>
                </div>
              </div>

              <p className="text-gray-600 text-xs sm:text-sm mt-4 max-w-md leading-relaxed">
                Invest in your health with this live session. This yoga online class is designed to lock in introductory pricing and help you start a structured journey towards controlling Diabetes, stabilizing blood pressure, and improving heart health.
              </p>
            </div>

            <div className="border-t border-[#d4edbc] pt-4 mt-6">
              <div className="flex items-center gap-2.5 bg-white border border-[#d4edbc] px-4 py-2 rounded-full w-fit shadow-sm">
                <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
                <span className="font-bold text-[#12211d] text-xs uppercase tracking-wider">
                  Only {slotsLeft} Early-Bird Slots Left!
                </span>
              </div>
              <p className="text-gray-500 text-[11px] mt-2">
                *The price will increase to ₹149/- once the early bird capacity of 10 is reached.
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: Booking Form (White Card) */}
          <div className="lg:col-span-5 bg-white border border-gray-100 p-6 py-3 rounded-3xl shadow-xl shadow-[#12211d]/5 flex flex-col justify-center">
            <h3 className="text-xl font-bold tracking-tight text-[#12211d] mb-1">
              Secure Your Seat
            </h3>

            <form onSubmit={handleRegister} className="space-y-1">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-0.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    style={{ paddingLeft: "42px" }}
                    className="w-full pr-4 p-1 bg-gray-50/50 border border-gray-200 rounded-xl font-semibold placeholder:text-gray-400 focus:outline-none focus:border-[#3B6D11] focus:bg-white transition-all text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 ">WhatsApp Mobile Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="9876543210"
                      style={{ paddingLeft: "42px" }}
                      className="w-full pr-4 py-2 bg-gray-50/50 border border-gray-200 rounded-xl font-semibold placeholder:text-gray-400 focus:outline-none focus:border-[#3B6D11] focus:bg-white transition-all text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 ">Promo Code</label>
                  <div className="relative">
                    <Sparkles className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      name="promocode"
                      value={formData.promocode}
                      onChange={handleInputChange}
                      placeholder="Optional"
                      style={{ paddingLeft: "42px" }}
                      className="w-full pr-4 py-2 bg-gray-50/50 border border-gray-200 rounded-xl font-semibold placeholder:text-gray-400 focus:outline-none focus:border-[#3B6D11] focus:bg-white transition-all text-sm uppercase"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 ">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    style={{ paddingLeft: "42px" }}
                    className="w-full pr-4 py-2 bg-gray-50/50 border border-gray-200 rounded-xl font-semibold placeholder:text-gray-400 focus:outline-none focus:border-[#3B6D11] focus:bg-white transition-all text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#3B6D11] hover:bg-[#2d540d] text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-1.5 mt-1 cursor-pointer"
              >
                Secure your Slot<ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

        {/* 📅 Date/Time Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-gray-100 p-6 py-2 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="bg-[#EAF3DE] p-3 rounded-xl">
              <Calendar className="w-5 h-5 text-[#3B6D11]" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Date</div>
              <div className="font-extrabold text-[#12211d] text-base">Sunday, 12 July 2026</div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 p-6 py-2 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="bg-[#EAF3DE] p-3 rounded-xl">
              <Clock className="w-5 h-5 text-[#3B6D11]" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Timing</div>
              <div className="font-extrabold text-[#12211d] text-base">11:00 AM - 12:30 PM IST</div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 py-2 p-6 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="bg-[#EAF3DE] p-3 rounded-xl">
              <CheckCircle2 className="w-5 h-5 text-[#3B6D11]" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Venue</div>
              <div className="font-extrabold text-[#12211d] text-base">Live Interactive Session</div>
            </div>
          </div>
        </div>

        {/* 👩‍⚕️ Clinical Yoga Panel */}
        <div className="bg-[#EAF3DE]/40 border border-[#d4edbc] p-8 md:p-10 rounded-3xl flex flex-col md:flex-row items-center gap-8 md:gap-10">
          <div className="w-28 h-28 rounded-2xl overflow-hidden shrink-0 bg-[#EAF3DE] flex items-center justify-center font-display font-semibold text-3xl text-[#3B6D11] border border-[#d4edbc]">
            YS
          </div>
          <div>
            <span className="inline-block bg-[#3B6D11] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded mb-3">
              Session Facilitators by yogsaathi
            </span>
            <h3 className="font-display text-2xl font-semibold text-[#12211d]">YogSaathi Yoga Experts</h3>
            <p className="text-gray-600 text-sm mt-3 leading-relaxed">
              Our master yoga therapists work alongside clinical experts to bring you the best synergy of restorative yoga postures (asanas), targeted breathwork (pranayama), and stress-management techniques. With years of experience guiding 1000+ candidates globally to regulate blood sugar, stabilize blood pressure, and restore cardiovascular vitality, we make holistic wellness simple, healthy, and lasting.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
