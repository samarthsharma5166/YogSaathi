import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { ArrowRight, Sparkles, User, Phone, Mail, Clock, Calendar, CheckCircle2, ShieldCheck, Heart, Flame } from "lucide-react";
import { getDieticianConfig, createDieticianRegistration, verifyDieticianPayment, validateDieticianPromo } from "../services/api";

export default function DieticianSession() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    promocode: ""
  });
  
  const [selectedChallenge, setSelectedChallenge] = useState("");
  const [config, setConfig] = useState({ price: 149, slotsLeft: 10 });
  const [displayPrice, setDisplayPrice] = useState(149);
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await getDieticianConfig();
        setConfig(res.data);
        setDisplayPrice(res.data.price);
      } catch (err) {
        console.error("Error loading config:", err);
      }
    }
    loadConfig();
  }, []);

  useEffect(() => {
    const validatePromo = async () => {
      if (!formData.promocode) {
        setDisplayPrice(config.price);
        setIsPromoApplied(false);
        return;
      }
      try {
        const res = await validateDieticianPromo({ promocode: formData.promocode });
        setDisplayPrice(res.data.price);
        setIsPromoApplied(res.data.isValid);
      } catch (err) {
        console.error("Error validating promo:", err);
      }
    };

    const timer = setTimeout(() => {
      validatePromo();
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.promocode, config.price]);

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

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.email) {
      toast.error("Please fill in all details to secure your spot!");
      return;
    }

    if (formData.phone.length < 10) {
      toast.error("Please enter a valid phone number!");
      return;
    }

    setLoading(true);
    try {
      const { data } = await createDieticianRegistration({
        name: formData.name,
        phone: formData.phone.startsWith("+91") ? formData.phone : "+91" + formData.phone.replace(/^0+/, ""),
        email: formData.email,
        promocode: formData.promocode,
        challenge: selectedChallenge,
      });

      const { order, registrationId, keyId } = data;

      const options = {
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        name: "YogSaathi Dietician Session",
        description: "Registration for Weight Loss Masterclass",
        order_id: order.id,
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
        handler: async (response) => {
          setLoading(true);
          try {
            await verifyDieticianPayment({
              ...response,
              registrationId,
            });
            toast.success("Registration Successful! WhatsApp confirmation sent.", {
              duration: 5000,
            });
            // Refresh config to update slotsLeft count
            const confRes = await getDieticianConfig();
            setConfig(confRes.data);
          } catch (error) {
            console.error(error);
            toast.error("Something went wrong during payment verification.");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: { color: "#3B6D11" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        toast.error(response.error.description || "Payment failed");
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to initiate registration");
      setLoading(false);
    }
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
              🔥   Weight Loss & Sustainable Fat Reduction Masterclass (12-Jul-2026) • Early Bird Offer ₹{displayPrice} Active • Only {config.slotsLeft} Slots Left! 🔥
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 mt-6">
        
        {/* 🌟 Giant Elegant Serif Header */}
        <div className="mb-8 text-center max-w-4xl mx-auto">
          <div className="inline-flex  items-center gap-2 bg-[#EAF3DE] text-[#3B6D11] px-4 py-1.5 rounded-full text-xl font-bold uppercase tracking-wider mb-3">
            {/* <Sparkles className="w-3.5 h-3.5" /> */}
            Special Interactive Dietician Session
          </div>
          
          <h1 className="font-display text-3xl sm:text-4xl md:text-[36px] mt-2 font-medium tracking-tight text-[#12211d] leading-none mb-3">
             <span className="italic text-[#3B6D11]">Weight Loss</span> & Sustainable Fat Reduction
          </h1>
          
          <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Stop crash dieting and counting crumbs. Join YogSaathi’s clinical dietician for a premium 60 to 70 minute masterclass to unlock the science of permanent fat loss, metabolic resets, and healthy weight management.
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
                  <span className="text-3xl font-normal mt-2 mr-1">₹</span>{displayPrice}
                </div>
                <div className="mb-2">
                  <div className="text-gray-500 font-medium text-base line-through">
                    Regular: ₹299
                  </div>
                  <div className="text-[#3B6D11] font-bold text-xs tracking-wide mt-0.5 animate-pulse">
                    {isPromoApplied ? "Promo Applied! Save ₹200 (67% OFF)" : `Save ₹${299 - displayPrice} (${Math.round(((299 - displayPrice) / 299) * 100)}% OFF)`}
                  </div>
                </div>
              </div>

              <p className="text-gray-600 text-xs sm:text-sm mt-4 max-w-md leading-relaxed">
                Take advantage of our introductory rate for this weight-loss masterclass. Early bird registration is capped at 10 candidates to ensure our dietician can answer personalized nutrition queries.
              </p>
            </div>

            <div className="border-t border-[#d4edbc] pt-4 mt-6">
              <div className="flex items-center gap-2.5 bg-white border border-[#d4edbc] px-4 py-2 rounded-full w-fit shadow-sm">
                <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
                <span className="font-bold text-[#12211d] text-xs uppercase tracking-wider">
                  Only {config.slotsLeft} Early-Bird Slots Left!
                </span>
              </div>
              <p className="text-gray-500 text-[11px] mt-2">
                *The price will increase to ₹299/- once the early bird capacity of 10 is reached.
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
                disabled={loading}
                className="w-full bg-[#3B6D11] hover:bg-[#2d540d] disabled:bg-gray-400 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-1.5 mt-1 cursor-pointer"
              >
                {loading ? "Processing..." : "Secure your Slot"}<ArrowRight className="w-4 h-4" />
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
              <div className="font-extrabold text-[#12211d] text-base">Sunday, 19 July 2026</div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 p-6 py-2 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="bg-[#EAF3DE] p-3 rounded-xl">
              <Clock className="w-5 h-5 text-[#3B6D11]" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Timing</div>
              <div className="font-extrabold text-[#12211d] text-base">11:30 AM - 12:30 PM IST</div>
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

        {/* 📚 Masterclass Curriculums Section */}
        {/* <div className="mb-20">
          <h2 className="font-display text-4xl text-center text-[#12211d] mb-12">
            Masterclass Syllabus
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="font-display text-5xl font-light text-[#a3c97a] border-b border-gray-100 pb-3 mb-5">01</div>
              <h4 className="text-lg font-bold text-[#12211d] mb-2">Hormonal Fat Storage</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Discover how insulin spikes, cortisol (stress), and thyroid health govern where your body stores fat. Learn to structure meals to balance these key hormones naturally.
              </p>
            </div>

            <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="font-display text-5xl font-light text-[#a3c97a] border-b border-gray-100 pb-3 mb-5">02</div>
              <h4 className="text-lg font-bold text-[#12211d] mb-2">Sustainable Deficits</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Design a realistic, nourishing caloric deficit using Indian whole foods. Keep your energy levels high, protect muscle tone, and stop late-night cravings permanently.
              </p>
            </div>

            <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="font-display text-5xl font-light text-[#a3c97a] border-b border-gray-100 pb-3 mb-5">03</div>
              <h4 className="text-lg font-bold text-[#12211d] mb-2">Metabolism Resets</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Break through fat-loss plateaus. Understand the concept of reverse dieting and learn how to maintain your target weight long-term without rebound weight gain.
              </p>
            </div>
          </div>
        </div> */}

        {/* 👩‍⚕️ Clinical Dietician Panel */}
        {/* <div className="bg-[#EAF3DE]/40 border border-[#d4edbc] p-8 md:p-10 rounded-3xl flex flex-col md:flex-row items-center gap-8 md:gap-10">
          <div className="w-28 h-28 rounded-2xl overflow-hidden shrink-0 bg-[#EAF3DE] flex items-center justify-center font-display font-semibold text-3xl text-[#3B6D11] border border-[#d4edbc]">
            YS
          </div>
          <div>
            <span className="inline-block bg-[#3B6D11] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded mb-3">
              Session Facilitators by yogsaathi
            </span>
            <h3 className="font-display text-2xl font-semibold text-[#12211d]">YogSaathi Clinical Experts</h3>
            <p className="text-gray-600 text-sm mt-3 leading-relaxed">
              Our clinical nutritionists and weight management dieticians work alongside yoga therapists to bring you the best synergy of sustainable fat loss, metabolism activation, and daily wellness. With years of experience guiding 1000+ candidates globally to shed weight permanently without restrictive diets, we make fat reduction simple, healthy, and lasting.
            </p>
          </div>
        </div> */}

      </div>
    </div>
  );
}
