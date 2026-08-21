import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { fetchPlans, getActiveOffer } from "../services/api";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const planFeatures = [
  {
    duration: 12,
    badge: "Most Value",
    features: [
      { main: "Daily Online Sessions (45 min)", sub: "6 sessions per day" },
      { main: "3 Live Yoga Online Consultations", sub: "Posture correction & queries" },
      { main: "2 Dietician Online Consultations", sub: "Certified dietician" },
    ],
  },
  {
    duration: 6,
    badge: null,
    features: [
      { main: "Daily Online Sessions (45 min)", sub: "6 sessions per day" },
      { main: "2 Live Yoga Online Consultations", sub: "Posture correction & queries" },
      { main: "1 Dietician Online Consultation", sub: "Certified dietician" },
    ],
  },
  {
    duration: 3,
    badge: null,
    features: [
      { main: "Daily Online Sessions (45 min)", sub: "6 sessions per day" },
      { main: "1 Live Yoga Online Consultation", sub: "Posture correction & queries" },
      { main: "1 Dietician Online Consultation", sub: "Certified dietician" },
    ],
  },
  {
    duration: 1,
    badge: null,
    features: [
      { main: "Daily Online Sessions (45 min)", sub: "6 sessions per day" },
      { main: "1 Dietician Online Consultation", sub: "Certified dietician" },
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
              "Diet Suggestions",
              "Support for Queries",
              "Exclusive WhatsApp Group",
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


const durationOfferDetails = {
  12: { originalSale: 3099, extraOff: 1100, label: "Bumper Offer", usdOriginal: 180, usdSavings: "52%" },
  6: { originalSale: 2499, extraOff: 1100, label: "Super Offer", usdOriginal: 90, usdSavings: "38%" },
  3: { originalSale: 1399, extraOff: 600, label: "Big Offer", usdOriginal: 45, usdSavings: "22%" },
  1: { originalSale: 499, extraOff: 200, label: "Basic Offer", usdOriginal: 15, usdSavings: "0%" }
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
          <span className="inline-block bg-[#EAF3DE] text-[#3B6D11] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            Membership Plans
          </span>
          <h2 className="text-3xl font-extrabold text-[#27500a] tracking-tight mb-1.5">
            Protect Your Bond, Nurture Your Health: Rakshabandhan Special
          </h2>
          <p className="text-gray-600 text-sm max-w-xl mx-auto">
            Choose a plan that fits your lifestyle. Get daily guidance, personalized postures, and holistic wellness support.
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

        <div>
          <p className="text-center text-red-500 text-lg animate-pulse tracking-wider" style={{fontWeight:500}} >Limited Time Offer! Get extra discount on each plan!</p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-7xl mx-auto mb-6">
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

              return (
                <div
                  key={plan.name}
                  className={`bg-white rounded-2xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden p-5 md:p-6 border ${
                    isPopular
                      ? "border-[#3B6D11] border-2 shadow-lg scale-[1.01] lg:scale-[1.02]"
                      : "border-gray-200/80 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                  }`}
                >
                  {/* Highlight Ribbon */}
                  {isPopular && (
                    <div className="absolute top-0 right-0 left-0 bg-[#3B6D11] text-white text-center py-1 text-[10px] font-bold tracking-widest uppercase">
                      Best Value & Savings
                    </div>
                  )}

                  {/* Plan Badge */}
                  <div className="mb-4 pt-3 text-center">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      isPopular 
                        ? "bg-[#EAF3DE] text-[#3B6D11]" 
                        : "bg-gray-100 text-gray-500"
                    }`}>
                      {offerInfo.label}
                    </span>
                    <h3 className="text-xl font-extrabold text-gray-900 mt-2">{plan.name}</h3>
                    <p className="text-xs text-gray-500 font-semibold mt-0.5">
                      {plan.duration} {plan.duration === 1 ? 'Month' : 'Months'} Membership
                    </p>
                  </div>

                  {/* Pricing Stack */}
                  <div className="my-3 py-2.5 border-t border-b border-gray-100 flex flex-col justify-center min-h-[120px] text-center">
                    {currency === "INR" ? (
                      <>
                        {/* Strikethrough MRP and Regular Sale Price */}
                        <div className="flex flex-col gap-0.5 mb-1.5">
                          <div className="text-[11px] text-gray-400 font-semibold">
                            MRP: <span className="line-through">₹{plan.orignalPriceInInr}</span>
                          </div>
                          <div className="text-xs text-gray-500 font-semibold flex items-center justify-center gap-1">
                            Regular: <span className="line-through font-bold text-gray-600">₹{offerInfo.originalSale}</span>
                          </div>
                        </div>

                        {/* Extra Discount Tag */}
                        <div className="inline-flex items-center justify-center gap-1 bg-[#EAF3DE] border border-[#a3c97a] rounded-md px-2 py-0.5 text-[#3B6D11] text-[12px] font-extrabold mx-auto mb-2">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581a1.125 1.125 0 0 0 1.59 0l6.198-6.198a1.125 1.125 0 0 0 0-1.59L11.16 3.659A2.25 2.25 0 0 0 9.568 3Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 7.5h.008v.008H6V7.5Z" />
                          </svg>
                          Save ₹{offerInfo.extraOff} Extra!
                        </div>

                        {/* Current Final Price */}
                        <div className="flex items-baseline justify-center gap-0.5">
                          <span className="text-3xl font-black text-gray-900">₹{plan.inrPrice}</span>
                          <span className="text-gray-500 text-[10px] font-semibold">only</span>
                        </div>

                        {/* Percentage Off MRP */}
                        <div className="text-[10px] font-black text-[#3B6D11] mt-1">
                          {plan.discount}% Total Savings Off MRP
                        </div>
                      </>
                    ) : (
                      <>
                        {/* USD Pricing representation */}
                        <div className="flex flex-col gap-0.5 mb-1.5">
                          <div className="text-[11px] text-gray-400 font-semibold">
                            Standard: <span className="line-through">${offerInfo.usdOriginal}</span>
                          </div>
                        </div>

                        {plan.duration > 1 && (
                          <div className="inline-flex items-center justify-center gap-1 bg-amber-50 border border-amber-200 rounded-md px-2 py-0.5 text-amber-700 text-[10px] font-extrabold mx-auto mb-2">
                            Save {offerInfo.usdSavings} vs Monthly!
                          </div>
                        )}

                        <div className="flex items-baseline justify-center gap-0.5">
                          <span className="text-3xl font-black text-gray-900">${plan.usdPrice}</span>
                          <span className="text-gray-500 text-[10px] font-semibold">/ pack</span>
                        </div>

                        <div className="text-[10px] font-bold text-gray-500 mt-1">
                          Billed once
                        </div>
                      </>
                    )}
                  </div>

                  {/* Highlights included in this card */}
                  <div className="space-y-1.5 mb-5 text-left text-xs">
                    <div className="text-[10px] font-bold uppercase text-gray-400 tracking-wider mb-0.5">Highlights</div>
                    <div className="flex items-center gap-1.5 text-gray-700">
                      <CircleCheckIcon />
                      <span>Daily live classes (6x a day)</span>
                    </div>
                    {plan.duration >= 3 && (
                      <div className="flex items-center gap-1.5 text-gray-700">
                        <CircleCheckIcon />
                        <span>
                          {plan.duration === 12 ? '3' : plan.duration === 6 ? '2' : '1'} Yoga Consultations
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 text-gray-700">
                      <CircleCheckIcon />
                      <span>
                        {plan.duration === 1 ? '1' : plan.duration === 12 ? '2' : '1'} Dietician Consultations
                      </span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Button
                    size="medium"
                    variant="contained"
                    fullWidth
                    onClick={() => handleClick(plan.id, currency)}
                    sx={{
                      backgroundColor: isPopular ? "#3B6D11" : "#ffffff",
                      color: isPopular ? "#ffffff" : "#3B6D11",
                      border: isPopular ? "none" : "2px solid #3B6D11",
                      borderRadius: "12px",
                      padding: "8px 16px",
                      fontWeight: "bold",
                      textTransform: "none",
                      fontSize: "0.85rem",
                      boxShadow: isPopular ? "0 2px 6px rgba(59, 109, 17, 0.15)" : "none",
                      "&.MuiButton-root": {
                        marginTop: "auto"
                      },
                      "&:hover": {
                        backgroundColor: isPopular ? "#2d540d" : "#EAF3DE",
                        borderColor: "#3B6D11",
                        boxShadow: isPopular ? "0 4px 10px rgba(59, 109, 17, 0.2)" : "none",
                      }
                    }}
                  >
                    Buy Now
                  </Button>
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