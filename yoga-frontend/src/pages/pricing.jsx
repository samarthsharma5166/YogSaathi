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


const Pricing = () => {
  const [plans, setPlans] = useState([]);
  const [offer, setOffer] = useState(null);
  const navigate = useNavigate();

  async function getPlans() {
    const res = await fetchPlans();
    setPlans(res.data.plans);
  }

  const fetchActiveOffer = async () => {
    try {
      const response = await getActiveOffer();
      // const response = await axios.get('http://localhost:8000/api/offers/active');
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
    <div className="min-h-screen py-8 px-4 text-white">
      <h2 className="text-2xl font-bold text-center text-green-600 mb-1 mt-3">
        Yog Saathi Packages
      </h2>
      {offer && <p className="text-red-600 animate-pulse font-semibold text-center mb-4">{offer.text}</p>}

      {/* INR Section */}
      <h4 className="text-lg text-gray-600 text-center font-semibold mb-4">INR Pricing</h4>
      <div className="flex flex-row flex-wrap justify-center gap-4 max-w-6xl mx-auto mb-4">
        {plans && plans.length > 0 && plans.map((plan) => (
          !plan.isFreeTrial && <div
            key={plan.name}
            className="bg-white rounded-2xl border border-green-500 shadow-lg hover:scale-105 transition transform p-3 w-65 h-47"
          >
            <h4 className="text-lg font-bold text-green-600">{plan.name}</h4>
            <p className="text-sm text-gray-500">{`${plan.duration} ${plan.duration === 1 ? 'Month' : 'Months'}`}</p>
            <div className="text-lg font-extrabold text-gray-800">
              ₹{plan.inrPrice}
            </div>
            <p className="text-green-600 font-semibold">{`${plan.discount}% OFF`}</p>
            <p className="text-sm text-gray-500 line-through">
              ₹{plan.orignalPriceInInr}
            </p>
            <Button
              size="small"
              variant="contained"
              color="success"
              fullWidth
              className="!mt-2"
              onClick={() => handleClick(plan.id, 'INR')}
            >
              Buy Now
            </Button>
          </div>
        ))}
      </div>

      {/* USD Section */}
      <h4 className="text-lg text-gray-600 text-center font-semibold mb-4">USD Pricing</h4>
      <div className="flex flex-row flex-wrap justify-center gap-4 max-w-6xl mx-auto mb-8">
        {plans && plans.length > 0 && plans.map((plan) => (
          <div
            key={plan.name}
            className="bg-white rounded-2xl border border-green-500 shadow-lg hover:scale-105 transition transform p-3 w-65 h-35"
          >
            <h4 className="text-lg font-bold text-green-600">{plan.name}</h4>
            <p className="text-sm text-gray-500">{`${plan.duration} ${plan.duration === 1 ? 'Month' : 'Months'}`}</p>
            <div className="text-lg font-extrabold text-gray-800">
              ${plan.usdPrice}
            </div>
            <Button
              size="small"
              variant="contained"
              color="success"
              fullWidth
              className="!mt-2"
              onClick={() => handleClick(plan.id, 'USD')}
            >
              Buy Now
            </Button>
          </div>
        ))}
      </div>

      {/* Plan Feature Trays — below all pricing cards */}
      <PlanFeatureTrays />
    </div>
  );
};

export default Pricing;