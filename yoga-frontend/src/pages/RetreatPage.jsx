import React, { useState } from "react";
import axios from "axios";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shirt,
  Check,
  ChevronRight,
  Bed,
  Users,
  Plus,
  Trash2,
} from "lucide-react";
import { useRef } from "react";

/* ─── Early Bird helpers ─────────────────────────────────────── */
// Valid till 15 April 2026 23:59:59 IST  (UTC+5:30 → UTC 18:29:59)
const EARLY_BIRD_DEADLINE = new Date("2026-04-15T18:29:59Z");
const isEarlyBirdActive = () => new Date() <= EARLY_BIRD_DEADLINE;

/* ─── Plans ──────────────────────────────────────────────────── */
const plans = [
  {
    id: "TWIN_SHARING_SUPERIOR",
    title: "Twin Sharing – Superior/ Premiere Room",
    price: 16000,
    EarlyBird: 800,
    icon: Users,
    popular: false,
    features: [
      "3 Nights Twin Sharing Accommodation",
      "All Group Meals",
      "Yoga, Meditation & Breathing Sessions - Min 8 Nos",
      "Retreat Materials (Yoga Mat, T-Shirt)",
      "Special 25% Discount on YogSaathi On-Line Sessions (3, 6 & 12 Months)",
    ],
  },
  {
    id: "SINGLE_OCCUPANCY_SUPERIOR",
    title: "Single Occupancy – Superior/ Premiere Room",
    price: 22000,
    EarlyBird: 1000,
    icon: Bed,
    popular: false,
    features: [
      "3 Nights Single Occupancy Accommodation",
      "All Group Meals",
      "Yoga, Meditation & Breathing Sessions - Min. 8 Nos",
      "Retreat Materials (Yoga Mat, T-Shirt)",
      "Special 25% Discount on YogSaathi On-Line Sessions (3, 6 & 12 Months)",
    ],
  },
  {
    id: "TWIN_SHARING_JACUZZI",
    title: "Twin Sharing – Jacuzzi Room",
    price: 28000,
    EarlyBird: 1200,
    icon: Users,
    popular: true,
    features: [
      "3 Nights Twin Sharing Accommodation",
      "All Group Meals",
      "Yoga, Meditation & Breathing Sessions – Min 8 Nos",
      "Retreat Materials (Yoga Mat, T-Shirt)",
      "Special 35% Discount on YogSaathi On-Line Sessions (3, 6 & 12 Months)",
    ],
  },
  {
    id: "SINGLE_OCCUPANCY_JACUZZI",
    title: "Single Occupancy – Jacuzzi Room",
    price: 48000,
    EarlyBird: 1500,
    icon: Bed,
    popular: false,
    features: [
      "3 Nights Single Occupancy Accommodation",
      "All Group Meals",
      "Yoga, Meditation & Breathing Sessions – Min. 8 Nos",
      "Retreat Materials (Yoga Mat, T-Shirt)",
      "Special 50% Discount on YogSaathi On-Line Sessions (3, 6 & 12 Months)",
    ],
  },
];

/* ─── Empty participant template ─────────────────────────────── */
const emptyParticipant = () => ({
  fullName: "",
  gender: "MALE",
  age: "",
  mobileNumber: "",
  email: "",
  city: "",
  tShirtSize: "",
});

/* ─── Format price ───────────────────────────────────────────── */
const fmt = (n) =>
  "₹" + Number(n).toLocaleString("en-IN");

const RetreatPage = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Array of participant objects
  const [participants, setParticipants] = useState([emptyParticipant()]);
  const [errors, setErrors] = useState([{}]);

  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(false);
  const [promoError, setPromoError] = useState("");

  const validPromoCodes = ["PSU", "AAMANTRAN", "DISC"];

  const handleApplyPromo = () => {
    if (!validPromoCodes.includes(promoCode.trim().toUpperCase())) {
      setAppliedPromo(false);
      setPromoError("Invalid Promo Code");
      return;
    }
    if (selectedPlan !== "TWIN_SHARING_SUPERIOR" && selectedPlan !== "SINGLE_OCCUPANCY_SUPERIOR") {
      setAppliedPromo(false);
      setPromoError("Promo code is only applicable for Superior/Premiere Rooms");
      return;
    }
    setAppliedPromo(true);
    setPromoError("");
  };

  const removePromo = () => {
    setPromoCode("");
    setAppliedPromo(false);
    setPromoError("");
  };

  // Selected plan (single plan for all participants)
  const [selectedPlan, setSelectedPlan] = useState("TWIN_SHARING_SUPERIOR");

  const eventRegistrationId = useRef(null);
  const earlyBird = isEarlyBirdActive();

  /* ── Participant field change ── */
  const handleParticipantChange = (index, e) => {
    const { name, value } = e.target;
    const updated = participants.map((p, i) =>
      i === index ? { ...p, [name]: value } : p
    );
    setParticipants(updated);
    const updatedErrors = errors.map((err, i) =>
      i === index ? { ...err, [name]: "" } : err
    );
    setErrors(updatedErrors);
  };

  /* ── Add participant ── */
  const handleAddParticipant = () => {
    setParticipants([...participants, emptyParticipant()]);
    setErrors([...errors, {}]);
  };

  /* ── Remove participant ── */
  const handleRemoveParticipant = (index) => {
    if (participants.length === 1) return; // keep at least one
    setParticipants(participants.filter((_, i) => i !== index));
    setErrors(errors.filter((_, i) => i !== index));
  };

  /* ── Validation ── */
  const validateParticipants = () => {
    let valid = true;
    const newErrors = participants.map((p) => {
      const err = {};
      if (!p.fullName) err.fullName = "Full name is required";
      if (!p.age) {
        err.age = "Age is required";
      } else if (Number(p.age) <= 10) {
        err.age = "Age must be greater than 10";
      }
      if (!p.mobileNumber) {
        err.mobileNumber = "Mobile number is required";
      } else if (p.mobileNumber.length < 10) {
        err.mobileNumber = "Mobile number must be 10 digits";
      } else if (!/^\d+$/.test(p.mobileNumber)) {
        err.mobileNumber = "Mobile number must be numeric";
      }
      if (!p.email) {
        err.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(p.email)) {
        err.email = "Email is invalid";
      }
      if (!p.city) err.city = "City is required";
      if (!p.tShirtSize) err.tShirtSize = "T-Shirt size is required";
      if (Object.keys(err).length > 0) valid = false;
      return err;
    });
    setErrors(newErrors);
    return valid;
  };

  const handleNextStep = () => {
    if (validateParticipants()) {
      setStep(2);
    }
  };

  const handleBackStep = () => {
    setStep(1);
  };

  /* ── Price helpers ── */
  const getPlanById = (id) => plans.find((p) => p.id === id);

  const getPromoDiscountPerPerson = (plan) => {
    if (!appliedPromo) return 0;
    if (plan.id === "SINGLE_OCCUPANCY_SUPERIOR") {
      return plan.price * 0.10;
    } else if (plan.id === "TWIN_SHARING_SUPERIOR") {
      return participants.length === 1 ? 1600 : 2400;
    }
    return 0;
  };

  const getEffectivePrice = (plan) => {
    let p = earlyBird ? plan.price - plan.EarlyBird : plan.price;
    p -= getPromoDiscountPerPerson(plan);
    return p;
  };

  const getTotalAmount = () => {
    const plan = getPlanById(selectedPlan);
    if (!plan) return 0;
    return getEffectivePrice(plan) * participants.length;
  };

  /* ── Form submit ── */
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Send all participants + selected plan
      const payload = {
        participants,
        plan: selectedPlan,
        earlyBirdApplied: earlyBird,
        promoCode: appliedPromo ? promoCode.toUpperCase() : "",
        promoApplied: appliedPromo,
        totalAmount: getTotalAmount(),
      };

      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/event/register`,
        payload
      );
      eventRegistrationId.current = data.eventRegistrationId;

      const { order, keyId } = data;

      const options = {
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        name: "YogSaathi Rishikesh Retreat",
        description: "Payment for the retreat",
        order_id: order.id,
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
        handler: async (response) => {
          try {
            const { data } = await axios.post(
              `${import.meta.env.VITE_BACKEND_URL}/event/verify`,
              {
                ...response,
                eventRegistrationId: eventRegistrationId.current,
              }
            );
            window.location.href = `${import.meta.env.VITE_BACKEND_URL}/invoices/${data.invoicePath}`;
          } catch (error) {
            console.error(error);
            alert("Something went wrong during verification");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: participants[0].fullName,
          email: participants[0].email,
          contact: participants[0].mobileNumber,
        },
        theme: { color: "#3399cc" },
      };

      const rzp1 = new Razorpay(options);
      rzp1.on("payment.failed", function (response) {
        alert(response.error.description);
        setLoading(false);
      });
      rzp1.open();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
      setLoading(false);
    }
  };

  /* ─── Shared input / select styles ─── */
  const inputCls =
    "w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm";
  const labelCls = "flex items-center gap-2 text-gray-700 text-sm font-medium";

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* ── Hero ────────────────────────────────────────────── */}
      <div className="relative h-[320px] sm:h-[400px] bg-cover bg-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1731171060382-0ed37122ad60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwbWVkaXRhdGlvbiUyMG5hdHVyZSUyMHJpc2hpa2VzaHxlbnwxfHx8fDE3NzA0NTI2OTN8MA&ixlib=rb-4.1.0&q=80&w=1080')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/80 to-teal-900/70" />
        <div className="relative h-full flex flex-col items-center justify-center text-white px-4 text-center">
          <h1 className="text-3xl sm:text-5xl md:text-6xl mb-4">
            YogSaathi Rishikesh Retreat
          </h1>
          <p className="text-base sm:text-xl md:text-2xl text-emerald-100 max-w-2xl">
            Transform your mind, body, and soul in the yoga capital of the world
          </p>
        </div>
      </div>

      {/* ── Progress ─────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8">
        <div className="flex items-center justify-center gap-3 sm:gap-4">
          <div className="flex items-center">
            <div
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all text-sm sm:text-base ${
                step === 1 ? "bg-emerald-600 text-white" : "bg-emerald-500 text-white"
              }`}
            >
              {step > 1 ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : "1"}
            </div>
            <span className="ml-2 hidden sm:inline text-sm font-medium text-gray-700">
              Participant Details
            </span>
          </div>
          <div className="w-12 sm:w-16 h-0.5 bg-emerald-200">
            <div
              className={`h-full bg-emerald-600 transition-all duration-500 ${
                step > 1 ? "w-full" : "w-0"
              }`}
            />
          </div>
          <div className="flex items-center">
            <div
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all text-sm sm:text-base ${
                step === 2
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              2
            </div>
            <span className="ml-2 hidden sm:inline text-sm font-medium text-gray-700">
              Select Plan
            </span>
          </div>
        </div>
      </div>

      {/* ── Main content ─────────────────────────────────────── */}
      <div className="max-w-screen-xl mx-auto px-4 pb-16">

        {/* ════ STEP 1 ════ */}
        {step === 1 && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-5 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-semibold mb-1">
                  Step 1: Participant Details
                </h2>
                <p className="text-emerald-50 text-sm">
                  Add details for each person registering. You can add multiple
                  participants.
                </p>
              </div>

              <div className="p-4 sm:p-8 space-y-6">
                {participants.map((p, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-200 rounded-xl p-4 sm:p-6 relative bg-gray-50"
                  >
                    {/* Participant header */}
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-emerald-700 text-sm sm:text-base">
                        Participant {idx + 1}
                      </h3>
                      {participants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveParticipant(idx)}
                          className="flex items-center gap-1 text-red-500 hover:text-red-700 text-xs sm:text-sm transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Full Name */}
                      <div className="space-y-1">
                        <label className={labelCls}>
                          <User className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          Full Name
                        </label>
                        <input
                          id={`fullName-${idx}`}
                          name="fullName"
                          type="text"
                          placeholder="Enter full name"
                          value={p.fullName}
                          onChange={(e) => handleParticipantChange(idx, e)}
                          className={inputCls}
                        />
                        {errors[idx]?.fullName && (
                          <p className="text-red-500 text-xs">{errors[idx].fullName}</p>
                        )}
                      </div>

                      {/* Gender */}
                      <div className="space-y-1">
                        <label className={labelCls}>Gender</label>
                        <select
                          id={`gender-${idx}`}
                          name="gender"
                          value={p.gender}
                          onChange={(e) => handleParticipantChange(idx, e)}
                          className={inputCls + " bg-white"}
                        >
                          <option value="MALE">Male</option>
                          <option value="FEMALE">Female</option>
                        </select>
                      </div>

                      {/* Age */}
                      <div className="space-y-1">
                        <label className={labelCls}>Age (Years)</label>
                        <input
                          id={`age-${idx}`}
                          name="age"
                          type="number"
                          placeholder="Enter age"
                          value={p.age}
                          onChange={(e) => handleParticipantChange(idx, e)}
                          className={inputCls}
                        />
                        {errors[idx]?.age && (
                          <p className="text-red-500 text-xs">{errors[idx].age}</p>
                        )}
                      </div>

                      {/* Mobile */}
                      <div className="space-y-1">
                        <label className={labelCls}>
                          <Phone className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          Mobile Number
                        </label>
                        <input
                          id={`mobileNumber-${idx}`}
                          name="mobileNumber"
                          type="tel"
                          placeholder="10-digit mobile number"
                          value={p.mobileNumber}
                          onChange={(e) => handleParticipantChange(idx, e)}
                          className={inputCls}
                        />
                        {errors[idx]?.mobileNumber && (
                          <p className="text-red-500 text-xs">{errors[idx].mobileNumber}</p>
                        )}
                      </div>

                      {/* Email */}
                      <div className="space-y-1">
                        <label className={labelCls}>
                          <Mail className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          E-mail Address
                        </label>
                        <input
                          id={`email-${idx}`}
                          name="email"
                          type="email"
                          placeholder="Enter email address"
                          value={p.email}
                          onChange={(e) => handleParticipantChange(idx, e)}
                          className={inputCls}
                        />
                        {errors[idx]?.email && (
                          <p className="text-red-500 text-xs">{errors[idx].email}</p>
                        )}
                      </div>

                      {/* City */}
                      <div className="space-y-1">
                        <label className={labelCls}>
                          <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          City of Stay
                        </label>
                        <input
                          id={`city-${idx}`}
                          name="city"
                          type="text"
                          placeholder="Enter your city"
                          value={p.city}
                          onChange={(e) => handleParticipantChange(idx, e)}
                          className={inputCls}
                        />
                        {errors[idx]?.city && (
                          <p className="text-red-500 text-xs">{errors[idx].city}</p>
                        )}
                      </div>

                      {/* T-Shirt Size */}
                      <div className="space-y-1 sm:col-span-2">
                        <label className={labelCls}>
                          <Shirt className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          T-Shirt Size
                        </label>
                        <select
                          id={`tShirtSize-${idx}`}
                          name="tShirtSize"
                          value={p.tShirtSize}
                          onChange={(e) => handleParticipantChange(idx, e)}
                          className={inputCls + " bg-white max-w-xs"}
                        >
                          <option value="">Select Size</option>
                          <option value="S">S</option>
                          <option value="M">M</option>
                          <option value="L">L</option>
                          <option value="XL">XL</option>
                          <option value="XXL">XXL</option>
                        </select>
                        {errors[idx]?.tShirtSize && (
                          <p className="text-red-500 text-xs">{errors[idx].tShirtSize}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add Participant button */}
                {participants.length < 2 && (
                  <button
                    type="button"
                    onClick={handleAddParticipant}
                    className="flex items-center gap-2 text-emerald-700 border-2 border-dashed border-emerald-400 hover:border-emerald-600 hover:bg-emerald-50 px-5 py-3 rounded-xl w-full justify-center transition-all text-sm font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Add Another Participant
                  </button>
                )}

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-7 py-3 sm:px-8 sm:py-4 rounded-lg text-base sm:text-lg flex items-center gap-2 transition-all shadow-lg hover:shadow-xl"
                  >
                    Next Step
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════ STEP 2 ════ */}
        {step === 2 && (
          <div>
            <div className="text-center mb-8 sm:mb-10 px-2">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
                Choose Your Perfect Retreat Plan
              </h2>
              <p className="text-gray-600 text-base sm:text-lg">
                Select the plan that suits you the best
              </p>
              {earlyBird && (
                <p className="text-red-600 animate-pulse mt-2 text-base sm:text-xl font-medium">
                  🎉 Early Bird Offer Available till 20th April 2026 – Reserve
                  Your Spot Now!
                </p>
              )}
              <p className="text-gray-500 text-sm mt-1">
                {participants.length} participant{participants.length > 1 ? "s" : ""} registered
              </p>
            </div>

            <form onSubmit={handleFormSubmit}>
              {/* ── Plan cards: responsive grid ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
                {plans.map((plan) => {
                  const Icon = plan.icon;
                  const isSelected = selectedPlan === plan.id;
                  const effectivePrice = getEffectivePrice(plan);

                  return (
                    <label
                      key={plan.id}
                      htmlFor={plan.id}
                      style={{
                        cursor: "pointer",
                        transition: "transform 0.15s ease",
                        transform: isSelected ? "scale(1.02)" : "scale(1)",
                        display: "block",
                      }}
                    >
                      {/* Green tray */}
                      <div
                        style={{
                          position: "relative",
                          borderRadius: 24,
                          background: isSelected
                            ? "linear-gradient(160deg, #d4edbc 0%, #c0dd97 100%)"
                            : "linear-gradient(160deg, #eaf3de 0%, #d4edbc 100%)",
                          border: isSelected
                            ? "2px solid #3b6d11"
                            : "1px solid #a3c97a",
                          padding: "6px 6px 32px",
                          boxShadow: isSelected
                            ? "0 8px 32px 0 rgba(59,109,17,0.18), 0 2px 8px 0 rgba(0,0,0,0.08)"
                            : "0 4px 16px 0 rgba(59,109,17,0.08), 0 1px 4px 0 rgba(0,0,0,0.05)",
                          transition: "all 0.2s ease",
                          height: "100%",
                        }}
                      >
                        {/* Most Popular badge */}
                        {plan.popular && (
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
                              zIndex: 2,
                            }}
                          >
                            Most Popular
                          </div>
                        )}

                        {/* Inner white card */}
                        <div
                          style={{
                            background: "#fff",
                            borderRadius: 16,
                            overflow: "hidden",
                            border: isSelected
                              ? "2px solid #10b981"
                              : "1px solid #d1fae5",
                            boxShadow: isSelected
                              ? "0 4px 16px rgba(16,185,129,0.15)"
                              : "0 2px 8px rgba(0,0,0,0.06)",
                          }}
                        >
                          {/* Card header */}
                          <div
                            style={{
                              padding: "16px",
                              background: isSelected
                                ? "linear-gradient(to right, #10b981, #14b8a6)"
                                : "linear-gradient(to right, #f9fafb, #f3f4f6)",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "flex-start",
                                justifyContent: "space-between",
                                gap: 8,
                              }}
                            >
                              <div style={{ flex: 1 }}>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6,
                                    marginBottom: 6,
                                  }}
                                >
                                  <Icon
                                    style={{
                                      width: 18,
                                      height: 18,
                                      flexShrink: 0,
                                      color: isSelected ? "#fff" : "#059669",
                                    }}
                                  />
                                  <span
                                    style={{
                                      fontSize: 15,
                                      fontWeight: 600,
                                      color: isSelected ? "#fff" : "#1f2937",
                                      lineHeight: 1.3,
                                    }}
                                  >
                                    {plan.title}
                                  </span>
                                </div>

                                {/* Price display */}
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "baseline",
                                    gap: 6,
                                    flexWrap: "wrap",
                                  }}
                                >
                                  {/* Always show original price on the card */}
                                  <span
                                    style={{
                                      fontSize: 24,
                                      fontWeight: 800,
                                      color: isSelected ? "#fff" : "#111827",
                                    }}
                                  >
                                    {fmt(plan.price)}
                                  </span>
                                  <span
                                    style={{
                                      fontSize: 13,
                                      color: isSelected ? "#a7f3d0" : "#6b7280",
                                    }}
                                  >
                                    / person
                                  </span>
                                </div>

                                {/* Early Bird badge */}
                                {earlyBird && (
                                  <div
                                    style={{
                                      marginTop: 6,
                                      display: "inline-flex",
                                      alignItems: "center",
                                      background: isSelected
                                        ? "rgba(255,255,255,0.2)"
                                        : "#eaf3de",
                                      border: isSelected
                                        ? "1px solid rgba(255,255,255,0.35)"
                                        : "1px solid #96ce47ff",
                                      borderRadius: 999,
                                      padding: "2px 10px",
                                    }}
                                  >
                                    <span
                                      style={{
                                        fontSize: 12,
                                        fontWeight: 600,
                                        color: isSelected
                                          ? "#eaf3de"
                                          : "#366112ff",
                                      }}
                                    >
                                      🐦 Early Bird – Save ₹{plan.EarlyBird}/person
                                    </span>
                                  </div>
                                )}
                              </div>

                              <input
                                type="radio"
                                id={plan.id}
                                name="plan"
                                value={plan.id}
                                checked={isSelected}
                                onChange={() => setSelectedPlan(plan.id)}
                                style={{
                                  marginTop: 2,
                                  width: 16,
                                  height: 16,
                                  accentColor: "#059669",
                                  flexShrink: 0,
                                }}
                              />
                            </div>
                          </div>

                          {/* Features */}
                          <div style={{ padding: "14px 16px" }}>
                            <ul
                              style={{
                                listStyle: "none",
                                margin: 0,
                                padding: 0,
                                display: "flex",
                                flexDirection: "column",
                                gap: 8,
                              }}
                            >
                              {plan.features.map((feature, index) => (
                                <li
                                  key={index}
                                  style={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: 8,
                                  }}
                                >
                                  <Check
                                    style={{
                                      width: 14,
                                      height: 14,
                                      color: "#059669",
                                      flexShrink: 0,
                                      marginTop: 2,
                                    }}
                                  />
                                  <span
                                    style={{
                                      fontSize: 13,
                                      color: "#374151",
                                      lineHeight: 1.4,
                                    }}
                                  >
                                    {feature}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Tray bottom label */}
                        <div
                          style={{
                            position: "absolute",
                            bottom: 8,
                            left: "50%",
                            transform: "translateX(-50%)",
                            background: "#c0dd97",
                            color: "#27500a",
                            fontSize: 11,
                            fontWeight: 700,
                            padding: "2px 10px",
                            borderRadius: 999,
                            whiteSpace: "nowrap",
                            letterSpacing: "0.04em",
                            border: "1px solid #97c459",
                          }}
                        >
                          {plan.title.split("–")[0].trim()}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>

              {/* ── Order summary ── */}
              {(() => {
                const plan = getPlanById(selectedPlan);
                const effectivePrice = plan ? getEffectivePrice(plan) : 0;
                const total = getTotalAmount();
                return (
                  <div className="flex flex-col items-end mb-6">
                    <div className="bg-white border border-emerald-200 rounded-xl p-4 sm:p-6 mb-4 max-w-md w-full shadow-sm">
                      <h3 className="font-semibold text-gray-800 mb-2 text-base">
                        Promo Code
                      </h3>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => {
                            setPromoCode(e.target.value);
                            setPromoError("");
                          }}
                          disabled={appliedPromo}
                          placeholder="Enter promo code"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm uppercase"
                        />
                        {!appliedPromo ? (
                          <button
                            type="button"
                            onClick={handleApplyPromo}
                            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm transition-all"
                          >
                            Apply
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={removePromo}
                            className="w-full sm:w-auto bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm transition-all"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      {promoError && <p className="text-red-500 text-xs mt-1">{promoError}</p>}
                      {appliedPromo && <p className="text-emerald-600 text-xs mt-1">Promo code applied successfully!</p>}
                    </div>

                    <div className="bg-white border border-emerald-200 rounded-xl p-4 sm:p-6 max-w-md w-full shadow-sm">
                      <h3 className="font-semibold text-gray-800 mb-3 text-base">
                        Order Summary
                      </h3>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Plan</span>
                          <span className="font-medium text-gray-800 text-right max-w-[60%]">
                            {plan?.title}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Participants</span>
                          <span className="font-medium text-gray-800">
                            × {participants.length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Price per person</span>
                          <span className="font-medium text-gray-800">
                            {earlyBird || appliedPromo ? (
                              <>
                                <span className="line-through text-gray-400 mr-1">
                                  {fmt(plan?.price)}
                                </span>
                                {fmt(effectivePrice)}
                              </>
                            ) : (
                              fmt(plan?.price)
                            )}
                          </span>
                        </div>
                        {earlyBird && (
                          <div className="flex justify-between text-emerald-600">
                            <span>Early Bird Discount</span>
                            <span>− {fmt(plan?.EarlyBird)} × {participants.length}</span>
                          </div>
                        )}
                        {appliedPromo && (plan?.id === "TWIN_SHARING_SUPERIOR" || plan?.id === "SINGLE_OCCUPANCY_SUPERIOR") && (
                          <div className="flex justify-between text-emerald-600">
                            <span>Promo Discount</span>
                            <span>− {fmt(getPromoDiscountPerPerson(plan) * participants.length)}</span>
                          </div>
                        )}
                      </div>
                      <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between font-bold text-base text-gray-900">
                        <span>Total Amount</span>
                        <span className="text-emerald-700">{fmt(total)}</span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={handleBackStep}
                  className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-6 py-3 sm:px-8 sm:py-4 rounded-lg text-base sm:text-lg transition-all"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-lg text-base sm:text-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                      <span className="ml-2">Processing...</span>
                    </div>
                  ) : (
                    <>
                      Pay {fmt(getTotalAmount())}
                      <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* ── Declaration ── */}
      <div className="max-w-4xl mx-auto px-4 pb-12">
        <h2 className="text-red-500 font-bold text-lg mb-2">Declaration</h2>
        <p className="text-sm text-green-600 leading-relaxed">
          I hereby declare that the information provided above is true and
          correct to the best of my knowledge. I confirm that I am participating
          in the YogSaathi × Panambi Yoga Retreat voluntarily and understand
          that yoga involves physical activity. I take full responsibility for my
          health and well-being during the retreat and shall not hold the
          organizers, instructors, or the resort responsible for any injury,
          loss, or discomfort arising during the program.
        </p>
      </div>
    </div>
  );
};

export default RetreatPage;