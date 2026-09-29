import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { fetchPlans, getActiveOffer } from "../services/api";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const planHighlights = {
  12: [
    "Daily Yoga classes (6 times a day)",
    "Flexible Timing",
    "3 Dietician Interactive Webinars",
    "3 Yoga Demo on Zoom",
    "Exclusive Whats App Groups",
  ],
  6: [
    "Daily Yoga classes (6 times a day)",
    "Flexible Timing",
    "1 Dietician Interactive Webinars",
    "2 Yoga Demo on Zoom",
    "Exclusive Whats App Groups",
  ],
  3: [
    "Daily Yoga classes (6 times a day)",
    "Flexible Timing",
    "1 Dietician Interactive Webinars",
    "1 Yoga Demo on Zoom",
    "Exclusive Whats App Groups",
  ],
  1: [
    "Daily Yoga classes (6 times a day)",
    "Flexible Timing",
    "Exclusive Whats App Groups",
  ],
};

const planFeatures = [
  {
    duration: 12,
    badge: "Most Value",
    features: [
      { main: "Daily Yoga classes (6 times a day)", sub: "6 sessions per day" },
      { main: "Flexible Timing", sub: "Join any slot at your convenience" },
      { main: "3 Dietician Interactive Webinars", sub: "Interactive nutrition guidance" },
      { main: "3 Yoga Demo on Zoom", sub: "Posture correction & live demo" },
      { main: "Exclusive Whats App Groups", sub: "Daily access & community support" },
    ],
  },
  {
    duration: 6,
    badge: null,
    features: [
      { main: "Daily Yoga classes (6 times a day)", sub: "6 sessions per day" },
      { main: "Flexible Timing", sub: "Join any slot at your convenience" },
      { main: "1 Dietician Interactive Webinars", sub: "Interactive nutrition guidance" },
      { main: "2 Yoga Demo on Zoom", sub: "Posture correction & live demo" },
      { main: "Exclusive Whats App Groups", sub: "Daily access & community support" },
    ],
  },
  {
    duration: 3,
    badge: null,
    features: [
      { main: "Daily Yoga classes (6 times a day)", sub: "6 sessions per day" },
      { main: "Flexible Timing", sub: "Join any slot at your convenience" },
      { main: "1 Dietician Interactive Webinars", sub: "Interactive nutrition guidance" },
      { main: "1 Yoga Demo on Zoom", sub: "Posture correction & live demo" },
      { main: "Exclusive Whats App Groups", sub: "Daily access & community support" },
    ],
  },
  {
    duration: 1,
    badge: null,
    features: [
      { main: "Daily Yoga classes (6 times a day)", sub: "6 sessions per day" },
      { main: "Flexible Timing", sub: "Join any slot at your convenience" },
      { main: "Exclusive Whats App Groups", sub: "Daily access & community support" },
    ],
  },
];

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
    <path d="M2 6.5l3 3 5-5" stroke="#639922" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CircleCheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
    <circle cx="8" cy="8" r="7" stroke="#3b6d11" strokeWidth="1.2" />
    <path d="M5 8.5l2 2 4-4" stroke="#3b6d11" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PlanFeatureTrays = () => (
  <div
    style={{
      maxWidth: 1100, // FIXED (was too restrictive)
      margin: "32px auto 0",
      padding: "0 12px 40px",
    }}
  >
    <h4
      style={{
        textAlign: "center",
        color: "#3b6d11",
        fontWeight: 700,
        fontSize: 18,
        marginBottom: 24,
      }}
    >
      What's Included
    </h4>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", // FIXED
        gap: 16,
      }}
    >
      {planFeatures.map((plan) => {
        const label = `${plan.duration} ${plan.duration === 1 ? "Month" : "Months"
          }`;

        return (
          <div
            key={plan.duration}
            style={{
              position: "relative",
              borderRadius: 24,
              background:
                "linear-gradient(160deg, #eaf3de 0%, #d4edbc 100%)",
              border: "1px solid #a3c97a",
              padding: "18px 14px 44px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {plan.badge && (
              <div
                style={{
                  position: "absolute",
                  top: -13,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "#3b6d11",
                  color: "#eaf3de",
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "3px 14px",
                  borderRadius: 999,
                  whiteSpace: "nowrap",
                  letterSpacing: "0.04em",
                }}
              >
                {plan.badge}
              </div>
            )}

            {/* Plan Title */}
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#27500a",
                textAlign: "center",
                marginBottom: 12,
              }}
            >
              {label} Plan
            </div>

            {/* Features */}
            {plan.features.map((feat, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 7,
                  marginBottom: 8,
                }}
              >
                <CircleCheckIcon />
                <div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "#3b6d11",
                      lineHeight: 1.4,
                    }}
                  >
                    {feat.main}
                  </div>
                  <div
                    style={{
                      fontSize: 10.5,
                      color: "#639922",
                      marginTop: 2,
                    }}
                  >
                    {feat.sub}
                  </div>
                </div>
              </div>
            ))}

            {/* Divider */}
            <hr
              style={{
                border: "none",
                borderTop: "1px dashed #97c459",
                margin: "12px 0",
              }}
            />

            {/* Static Features */}
            {[
              "Diet Suggestions & Nutrition Guidance",
              "Live Query Support & Guidance",
            ].map((item) => (
              <div
                key={item}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 6,
                }}
              >
                <CheckIcon />
                <span
                  style={{
                    fontSize: 11,
                    color: "#3b6d11",
                    fontWeight: 500,
                  }}
                >
                  {item}
                </span>
              </div>
            ))}

            {/* Bottom Label */}
            <div
              style={{
                position: "absolute",
                bottom: 10,
                left: "50%",
                transform: "translateX(-50%)",
                background: "#c0dd97",
                color: "#27500a",
                fontSize: 10,
                fontWeight: 700,
                padding: "3px 12px",
                borderRadius: 999,
                whiteSpace: "nowrap",
                letterSpacing: "0.03em",
                border: "1px solid #97c459",
              }}
            >
              {label}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);


const planThemeConfig = {
  12: {
    badge: "⭐ Best Value Offers",
    badgeClass: "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-xs",
    cardBorder: "border-2 border-[#27500a] shadow-xl shadow-[#27500a]/10 ring-4 ring-[#EAF3DE]/80 scale-[1.01] lg:scale-[1.03]",
    cardBg: "bg-gradient-to-b from-[#F2F8EC] via-white to-white",
    titleColor: "text-[#27500a]",
    perMonthBox: "bg-gradient-to-r from-[#EAF3DE] to-[#d8eebe] border-[#97c459]",
    btnGradient: "bg-gradient-to-r from-[#27500a] to-[#3B6D11] hover:from-[#1b3807] hover:to-[#27500a] text-white shadow-md shadow-[#27500a]/25",
    ribbon: "bg-gradient-to-r from-[#27500a] via-[#3B6D11] to-[#4c8c14] text-white",
    discountTag: "bg-gradient-to-r from-rose-600 to-red-600 text-white",
  },
  6: {
    badge: "🌿 Super Offer",
    badgeClass: "bg-emerald-100 text-emerald-900 border border-emerald-300",
    cardBorder: "border border-emerald-200/90 shadow-md hover:shadow-xl hover:border-emerald-400 hover:-translate-y-1",
    cardBg: "bg-gradient-to-b from-[#FAFDF7] via-white to-white",
    titleColor: "text-emerald-950",
    perMonthBox: "bg-emerald-50/80 border-emerald-200",
    btnGradient: "bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm hover:shadow-md",
    ribbon: null,
    discountTag: "bg-emerald-700 text-white",
  },
  3: {
    badge: "🧘 Big Offer",
    badgeClass: "bg-teal-100 text-teal-900 border border-teal-300",
    cardBorder: "border border-teal-200/90 shadow-md hover:shadow-xl hover:border-teal-400 hover:-translate-y-1",
    cardBg: "bg-gradient-to-b from-[#F7FCFC] via-white to-white",
    titleColor: "text-teal-950",
    perMonthBox: "bg-teal-50/80 border-teal-200",
    btnGradient: "bg-teal-700 hover:bg-teal-800 text-white shadow-sm hover:shadow-md",
    ribbon: null,
    discountTag: "bg-emerald-700 text-white",
  },
  1: {
    badge: "🎯 Starter Offer",
    badgeClass: "bg-slate-100 text-slate-900 border border-slate-300",
    cardBorder: "border border-gray-200/80 shadow-sm hover:shadow-lg hover:border-gray-300 hover:-translate-y-1",
    cardBg: "bg-white",
    titleColor: "text-gray-900",
    perMonthBox: "bg-gray-50 border-gray-200",
    btnGradient: "bg-white text-[#27500a] border-2 border-[#27500a] hover:bg-[#EAF3DE]",
    ribbon: null,
    discountTag: "bg-emerald-700 text-white",
  },
};

const durationOfferDetails = {
  12: { originalSale: 3099, extraOff: 1100, label: "Bumper Offer", usdOriginal: 180, usdSavings: "61%" },
  6: { originalSale: 2499, extraOff: 1100, label: "Super Offer", usdOriginal: 90, usdSavings: "55%" },
  3: { originalSale: 1399, extraOff: 600, label: "Big Offer", usdOriginal: 45, usdSavings: "44%" },
  1: { originalSale: 499, extraOff: 200, label: "Basic Offer", usdOriginal: 15, usdSavings: "33%" }
};

const Pricing = () => {
  const [plans, setPlans] = useState([]);
  const [offer, setOffer] = useState(null);
  const [currency, setCurrency] = useState("INR");
  const [showCompare, setShowCompare] = useState(false);
  const navigate = useNavigate();

  async function getPlans() {
    try {
      const res = await fetchPlans();
      const sortedPlans = (res.data.plans || [])
        .filter(p => !p.isFreeTrial)
        .sort((a, b) => b.duration - a.duration);
      setPlans(sortedPlans);
    } catch (err) {
      console.error("Error fetching plans:", err);
    }
  }

  const fetchActiveOffer = async () => {
    try {
      const response = await getActiveOffer();
      setOffer(response.data.offer);
    } catch (error) {
      console.error('Error fetching active offer:', error);
    }
  };

  useEffect(() => {
    getPlans();
    fetchActiveOffer();
  }, []);

  function handleClick(id, currency) {
    navigate(`/checkout/${id}?currency=${currency}`);
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-6 px-4 md:px-6 text-[#1C2623] font-sans flex flex-col justify-center">
      <div className="max-w-7xl mx-auto w-full">
        
        {/* Header Section */}
        <div className="text-center mb-6">
          <span className="inline-block text-2xl! bg-[#EAF3DE] text-[#27500a] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            Membership Plans
          </span>
          <h2 className="text-3xl font-extrabold text-[#27500a] tracking-tight mb-1.5">
            <span className="mb-1! text-4xl">YogSaathi Announces Special Offers on Ist Anniversary</span><br /> <span className="text-red-500 text-xl font-bold mt-1">Offers Valid for Limited Time - Hurry Up! Subscribe Now! Special Anniversary Discounts</span>
          </h2>
          <p className="text-gray-600 text-sm max-w-xl mx-auto">
            Choose a plan that fits your lifestyle. Get daily guidance, personalized postures, and holistic wellness support.
          </p>
          <p className="text-3xl max-w-xl mx-auto">
            Thank you very much! <br/><span className="text-green-800 font-semibold">1000+</span> have done <span className="text-green-800 italic">yoga</span> with us.
          </p>
        </div>

        {/* Floating Special Offer Banner */}
        {offer && (
          <div className="max-w-2xl mx-auto bg-gradient-to-r from-[#e8f5e9] to-[#c8e6c9] border border-green-200 rounded-xl p-2.5 text-center shadow-sm mb-6 animate-pulse">
            <p className="text-green-800 font-bold text-xs flex items-center justify-center gap-1.5">
              <span className="bg-green-600 text-white text-[9px] px-2 py-0.5 rounded-full font-extrabold">PROMO</span>
              {offer.text}
            </p>
          </div>
        )}

        {/* Currency Switcher Toggle */}
        <div className="flex justify-center mb-6">
          <div className="bg-white p-0.5 rounded-xl border border-gray-200 shadow-sm flex gap-0.5">
            <button
              onClick={() => setCurrency("INR")}
              className={`px-5 py-2 rounded-lg font-bold text-xs transition-all duration-300 flex items-center gap-1.5 ${
                currency === "INR"
                  ? "bg-[#3B6D11] text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <span>🇮🇳</span> INR (₹)
            </button>
            <button
              onClick={() => setCurrency("USD")}
              className={`px-5 py-2 rounded-lg font-bold text-xs transition-all duration-300 flex items-center gap-1.5 ${
                currency === "USD"
                  ? "bg-[#3B6D11] text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <span>🇺🇸</span> USD ($)
            </button>
          </div>
        </div>

        {/* <div>
          <p className="text-center text-red-500 text-lg animate-pulse tracking-wider" style={{fontWeight:500}} >Limited Time Offer! Get extra discount on each plan!</p>
        </div> */}

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-8 items-stretch">
          {plans && plans.length > 0 ? (
            plans.map((plan) => {
              const offerInfo = durationOfferDetails[plan.duration] || {
                originalSale: plan.orignalPriceInInr,
                extraOff: 0,
                label: "Special Plan",
                usdOriginal: plan.usdPrice,
                usdSavings: "0%"
              };

              const isPopular = plan.duration === 12;
              const theme = planThemeConfig[plan.duration] || planThemeConfig[1];

              const originalPerMonthInr = Math.round(plan.orignalPriceInInr / plan.duration);
              const effectivePerMonthInr = Math.round(plan.inrPrice / plan.duration);

              const originalPerMonthUsd = Math.round(offerInfo.usdOriginal / plan.duration);
              const effectivePerMonthUsd = Math.round(plan.usdPrice / plan.duration);

              return (
                <div
                  key={plan.name}
                  className={`rounded-2xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden p-5 md:p-6 ${theme.cardBg} ${theme.cardBorder}`}
                >
                  {/* Highlight Ribbon */}
                  {/* {theme.ribbon && (
                    <div className={`absolute top-0 right-0 left-0 ${theme.ribbon} text-center py-1 text-[12px] font-black tracking-widest uppercase shadow-xs`}>
                      ★ BEST VALUE & SAVINGS ★
                    </div>
                  )} */}

                  {/* Plan Badge & Header */}
                  <div className={`mb-3 flex flex-col gap-2 text-center ${isPopular ? "pt-4" : "pt-1"}`}>
                    <span className={`inline-block text-[12px] font-extrabold uppercase tracking-wider px-3 py-0.5 rounded-full ${theme.badgeClass}`}>
                      {theme.badge}
                    </span>
                    {/* <h3 className={`text-2xl font-black ${theme.titleColor} mt-2 tracking-tight`}>
                      {plan.name}
                    </h3> */}
                    <div className="inline-block bg-white/90 px-3 py-0.5 rounded-full text-md font-bold text-gray-700 border border-gray-200 shadow-2xs mt-1">
                      {plan.duration} {plan.duration === 1 ? 'Month' : 'Months'} 
                    </div>
                  </div>

                  {/* Pricing Stack */}
                  <div className="my-2 py-3 border-y border-gray-200/70 flex flex-col justify-center text-center">
                    {currency === "INR" ? (
                      <>
                        {/* MRP Line + Discount badge */}
                        <div className="flex items-center justify-center gap-2 mb-1 flex-wrap">
                          <span className="text-sm text-gray-400 font-semibold line-through">
                            MRP: ₹{plan.orignalPriceInInr}
                          </span>
                          <span className={`text-[11px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide shadow-2xs ${theme.discountTag}`}>
                            {plan.discount}% OFF
                          </span>
                        </div>

                        {/* Current Final Price */}
                        <div className="flex items-baseline justify-center gap-1.5 my-0.5">
                          <span className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">
                            ₹{plan.inrPrice}
                          </span>
                          <span className="text-gray-500 text-xs font-semibold italic">
                            total
                          </span>
                        </div>

                        {/* Per Month Secondary Text */}
                        <div className="text-xs text-gray-500 font-medium mt-1">
                          ₹{effectivePerMonthInr} / month
                        </div>
                      </>
                    ) : (
                      <>
                        {/* USD Pricing representation */}
                        <div className="flex items-center justify-center gap-2 mb-1 flex-wrap">
                          <span className="text-xs text-gray-400 font-semibold line-through">
                            Standard: ${offerInfo.usdOriginal}
                          </span>
                          {plan.duration > 1 && (
                            <span className="text-[10px] font-extrabold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                              Save {offerInfo.usdSavings}
                            </span>
                          )}
                        </div>

                        <div className="flex items-baseline justify-center gap-1.5 my-0.5">
                          <span className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">
                            ${plan.usdPrice}
                          </span>
                          <span className="text-gray-500 text-xs font-semibold italic">
                            total
                          </span>
                        </div>

                        {/* USD Per Month Secondary Text */}
                        <div className="text-xs text-gray-500 font-medium mt-1">
                          ${effectivePerMonthUsd} / month
                        </div>
                      </>
                    )}
                  </div>

                  {/* Highlights included in this card */}
                  <div className="space-y-2 mb-5 text-left text-xs min-h-[145px] pt-1">
                    <div className="text-[11px] text-center font-extrabold uppercase bg-amber-400/90 py-1 text-gray-700 rounded-xl px-2 tracking-wider mb-2 flex items-center justify-center gap-1">
                      Plan Includeds
                    </div>
                    {(planHighlights[plan.duration] || ["Exclusive Whats App Groups"]).map((highlight, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-gray-700 font-medium text-[13px] leading-snug">
                        <div className="mt-0.5 bg-[#EAF3DE] text-[#27500a] p-0.5 rounded-full flex-shrink-0 flex items-center justify-center">
                          <CircleCheckIcon />
                        </div>
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleClick(plan.id, currency)}
                    className={`w-full py-3 px-4 rounded-xl font-extrabold text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2 mt-auto cursor-pointer ${theme.btnGradient} hover:scale-[1.02] active:scale-[0.99]`}
                  >
                    <span>Subscribe Now</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </button>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500 font-semibold">
              Loading available membership plans...
            </div>
          )}
        </div>

        {/* Collapsible toggle for detailed comparison */}
        <div className="text-center mt-3 mb-6">
          <button
            onClick={() => setShowCompare(!showCompare)}
            className="text-[#3B6D11] hover:text-[#2d540d] font-bold text-xs inline-flex items-center gap-1.5 transition uppercase tracking-wider bg-[#EAF3DE] hover:bg-[#d4edbc] px-4 py-2 rounded-xl border border-[#a3c97a]"
          >
            {showCompare ? "Hide Detailed Features" : "Compare Detailed Plan Features"}
            <svg
              className={`w-3.5 h-3.5 transition-transform duration-300 ${showCompare ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
        </div>

        {/* Detailed feature comparisons tray */}
        {showCompare && <PlanFeatureTrays />}
      </div>
    </div>
  );
};

export default Pricing;