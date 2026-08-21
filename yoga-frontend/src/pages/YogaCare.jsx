import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  User,
  Mail,
  Phone,
  ArrowRight,
  ArrowLeft,
  Lock,
  ShieldCheck,
  CreditCard,
  CheckCircle,
  HelpCircle,
  Clock,
  Home,
  Tv,
  Globe,
  Users
} from "lucide-react";
import CustomPhoneInput from "../components/CustomPhoneInput";
import { YOGA_CARE_PLANS, YOGA_CARE_PROGRAMS } from "../config/yogaCarePlans.js";
import { createYogaCareRegistration, verifyYogaCarePayment } from "../services/api.js";

const YogaCare = () => {
  const navigate = useNavigate();

  // Wizard Steps:
  // 0: Program overview and selections (Hero / Intro / Benefits / Program Selection)
  // 1: User Info
  // 2: Plan Selection and Checkout
  // 3: Success Screen
  const [step, setStep] = useState(0);

  // Form State
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    region: "india", // default based on initial selection or auto-detect if desired
    participantType: "individual" // individual or group_2_5
  });
  const [selectedPlanId, setSelectedPlanId] = useState(null);

  // Loading States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(""); // "creating_order", "awaiting_payment", "verifying", "success", "failed"
  const [paymentDetails, setPaymentDetails] = useState(null);

  // Reset page position on step change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  // Step 1 Validation
  const handleSelectProgram = (program) => {
    setSelectedProgram(program);
  };

  const proceedToStep2 = () => {
    if (!selectedProgram) {
      toast.error("Please select a YogaCare programme to continue.");
      return;
    }
    setStep(1);
  };

  // Step 2 Validation
  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const proceedToStep3 = () => {
    if (!formData.name.trim()) {
      toast.error("Please enter your name.");
      return;
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!formData.phone || formData.phone.length < 10) {
      toast.error("Please enter a valid phone number.");
      return;
    }

    // Auto-detect region based on phone number prefix
    const phoneClean = formData.phone.replace(/\D/g, "");
    const isIndian = phoneClean.startsWith("91") || phoneClean.length === 10;
    const detectedRegion = isIndian ? "india" : "international";

    setFormData((prev) => ({
      ...prev,
      region: detectedRegion
    }));

    setStep(2);
  };

  // Get active plans based on region & group type
  const activePlansConfig = YOGA_CARE_PLANS[formData.region]?.[formData.participantType] || {};

  // Formatted Pricing options
  const planOptions = Object.keys(activePlansConfig).map((key) => {
    const p = activePlansConfig[key];
    return {
      id: key,
      ...p
    };
  });

  const handleCheckout = async () => {
    if (!selectedPlanId) {
      toast.error("Please select a pricing plan.");
      return;
    }

    setIsSubmitting(true);
    setPaymentStatus("creating_order");

    try {
      const payload = {
        programId: selectedProgram.id,
        participantType: formData.participantType,
        region: formData.region,
        planId: selectedPlanId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      };

      const response = await createYogaCareRegistration(payload);
      if (!response.data || !response.data.success) {
        throw new Error(response.data?.message || "Failed to initialize registration order.");
      }

      const orderData = response.data;
      setPaymentStatus("awaiting_payment");

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "YogSaathi YogaCare",
        description: `${selectedProgram.name} - ${selectedPlanId} plan`,
        order_id: orderData.orderId,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: "#3B6D11"
        },
        handler: async function (paymentResponse) {
          setPaymentStatus("verifying");
          try {
            const verifyRes = await verifyYogaCarePayment({
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_signature: paymentResponse.razorpay_signature
            });

            if (verifyRes.data && verifyRes.data.success) {
              setPaymentDetails(verifyRes.data.registration);
              setPaymentStatus("success");
              setStep(3);
              toast.success("Payment successful!");
            } else {
              setPaymentStatus("failed");
              toast.error("Payment verification failed.");
            }
          } catch (err) {
            console.error(err);
            setPaymentStatus("failed");
            toast.error("Error verifying payment.");
          }
        },
        modal: {
          ondismiss: function () {
            setPaymentStatus("failed");
            setIsSubmitting(false);
            toast.error("Payment cancelled.");
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.error || error.response?.data?.message || error.message || "Failed to initiate payment. Please try again.";
      toast.error(errMsg);
      setPaymentStatus("failed");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF8F5] via-[#F4F9EE] to-[#EAF3DE] text-[#1C2623] py-12 px-4 md:px-8 font-sans">
      <div className="max-w-6xl mx-auto">

        {/* Step Indicator */}
        {step < 3 && (
          <div className="mb-8 max-w-xl mx-auto">
            <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
              <span className={step === 0 ? "text-[#3B6D11]" : ""}>1. Select Programme</span>
              <span className={step === 1 ? "text-[#3B6D11]" : ""}>2. Your Details</span>
              <span className={step === 2 ? "text-[#3B6D11]" : ""}>3. Plan & Payment</span>
            </div>
            <div className="w-full bg-gray-200 h-1.5 rounded-full mt-2 relative overflow-hidden">
              <div
                className="bg-[#3B6D11] h-full transition-all duration-300"
                style={{ width: `${(step + 1) * 33.33}%` }}
              ></div>
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* STEP 0: Landing Content & Program Selection */}
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-12"
            >
              {/* Hero Banner */}
              <div className="text-center space-y-4">
                <span className="bg-[#EAF3DE] text-[#3B6D11] text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full">
                  YogSaathi YogaCare
                </span>
                <h1 className="text-4xl md:text-5xl font-black text-[#27500a] leading-tight">
                  YOGSAATHI YOGACARE PROGRAM
                </h1>
                <p className="text-gray-600 italic max-w-2xl mx-auto text-sm md:text-base">
                  💚 Your Personal Yoga Partner for Health & Wellness
                </p>
              </div>

              {/* Benefits Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex gap-4">
                  <div className="w-10 h-10 bg-[#EAF3DE] text-[#3B6D11] rounded-full flex items-center justify-center shrink-0">
                    🧘
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-gray-900">Personalised attention</h3>
                    <p className="text-gray-500 text-xs mt-1">From experienced and certified Yoga Teachers.</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex gap-4">
                  <div className="w-10 h-10 bg-[#EAF3DE] text-[#3B6D11] rounded-full flex items-center justify-center shrink-0">
                    👤
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-gray-900">One-to-One / Small Batches</h3>
                    <p className="text-gray-500 text-xs mt-1">Individual classes or very small interactive groups.</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex gap-4">
                  <div className="w-10 h-10 bg-[#EAF3DE] text-[#3B6D11] rounded-full flex items-center justify-center shrink-0">
                    🎯
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-gray-900">Aligned to Your Goals</h3>
                    <p className="text-gray-500 text-xs mt-1">Practices based on your specific health concerns.</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex gap-4">
                  <div className="w-10 h-10 bg-[#EAF3DE] text-[#3B6D11] rounded-full flex items-center justify-center shrink-0">
                    🏠
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-gray-900">Comfort of Your Home</h3>
                    <p className="text-gray-500 text-xs mt-1">Practice safely and comfortably in your own space.</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex gap-4">
                  <div className="w-10 h-10 bg-[#EAF3DE] text-[#3B6D11] rounded-full flex items-center justify-center shrink-0">
                    ⏰
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-gray-900">Preferred Time Slots</h3>
                    <p className="text-gray-500 text-xs mt-1">Flexible scheduling that fits your lifestyle.</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex gap-4">
                  <div className="w-10 h-10 bg-[#EAF3DE] text-[#3B6D11] rounded-full flex items-center justify-center shrink-0">
                    💻
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-gray-900">Live Online Sessions</h3>
                    <p className="text-gray-500 text-xs mt-1">Highly interactive and convenient video classes.</p>
                  </div>
                </div>
              </div>

              {/* Program Details Callout */}
              <div className="bg-white/80 border border-[#a3c97a]/20 rounded-2xl p-6 md:p-8 space-y-4">
                <h3 className="text-lg font-bold text-[#27500a] flex items-center gap-2">
                  <span>✨</span> The Programme Includes:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 bg-white/50 border border-gray-100 rounded-xl space-y-1">
                    <span className="text-gray-400 text-xs block">Duration</span>
                    <strong className="text-sm font-bold text-gray-800">45-minute live sessions</strong>
                  </div>
                  <div className="p-4 bg-white/50 border border-gray-100 rounded-xl space-y-1">
                    <span className="text-gray-400 text-xs block">Frequency</span>
                    <strong className="text-sm font-bold text-gray-800">3 sessions per week</strong>
                  </div>
                  <div className="p-4 bg-white/50 border border-gray-100 rounded-xl space-y-1">
                    <span className="text-gray-400 text-xs block">Format</span>
                    <strong className="text-sm font-bold text-gray-800">One-to-one / small groups</strong>
                  </div>
                  <div className="p-4 bg-white/50 border border-gray-100 rounded-xl space-y-1">
                    <span className="text-gray-400 text-xs block">Bonus</span>
                    <strong className="text-sm font-bold text-gray-800">Complimentary wellness benefits</strong>
                  </div>
                </div>
                <p className="text-[#3B6D11] italic text-xs font-semibold pt-2">
                  ✨ Personalised Yoga. Individual Attention. Your Wellness Journey.
                </p>
              </div>

              {/* Selector Section */}
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                    🧘‍♀️ Please choose the YogaCare programme that best matches your requirement:
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">Select one focus area to proceed with registration.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {YOGA_CARE_PROGRAMS.map((program) => {
                    const isSelected = selectedProgram?.id === program.id;
                    return (
                      <div
                        key={program.id}
                        onClick={() => handleSelectProgram(program)}
                        className={`cursor-pointer bg-white border-2 rounded-2xl p-5 transition-all shadow-sm flex flex-col justify-between h-40 hover:scale-101 hover:shadow-md ${
                          isSelected ? "border-[#3B6D11] bg-[#FAFDF6] ring-2 ring-[#3B6D11]/10" : "border-gray-100"
                        }`}
                      >
                        <div className="text-3xl">{program.emoji}</div>
                        <h4 className="font-bold text-sm text-gray-900 leading-snug">{program.name}</h4>
                        <div className="flex items-center gap-1.5 text-xs font-semibold self-end mt-2">
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected ? "bg-[#3B6D11] border-[#3B6D11]" : "border-gray-300"
                            }`}
                          >
                            {isSelected && <Check className="w-2.5 h-2.5 text-white" strokeWidth={4} />}
                          </div>
                          <span className={isSelected ? "text-[#3B6D11]" : "text-gray-400"}>
                            {isSelected ? "Selected" : "Select"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="text-center pt-6">
                  <button
                    onClick={proceedToStep2}
                    className="inline-flex items-center gap-2 bg-[#3B6D11] hover:bg-[#2d540d] text-white font-bold py-3 px-8 rounded-full shadow-md shadow-[#3B6D11]/10 hover:shadow-lg transition cursor-pointer text-sm"
                  >
                    Continue to Registration <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 1: Registration Form */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="max-w-xl mx-auto bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                <button
                  onClick={() => setStep(0)}
                  className="flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-gray-700 transition"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
                <h2 className="text-lg font-bold text-gray-900">Your Information</h2>
                <div className="w-6"></div> {/* spacer */}
              </div>

              <div className="space-y-5">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#3B6D11]" /> Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 h-11 border border-gray-300 rounded-lg text-xs bg-white text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#3B6D11] focus:ring-2 focus:ring-[#3B6D11]/15 transition"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#3B6D11]" /> Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 h-11 border border-gray-300 rounded-lg text-xs bg-white text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#3B6D11] focus:ring-2 focus:ring-[#3B6D11]/15 transition"
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#3B6D11]" /> WhatsApp Number *
                  </label>
                  <CustomPhoneInput
                    value={formData.phone}
                    onChange={(phone) => setFormData((prev) => ({ ...prev, phone: `${phone}` }))}
                    placeholder="Enter phone number"
                  />
                </div>


                {/* Group size Select */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#3B6D11]" /> Participant / Batch size *
                  </label>
                  <div className="grid grid-cols-2 gap-3 mt-1">
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, participantType: "individual" }))}
                      className={`py-2.5 px-4 border text-xs font-bold rounded-lg transition ${
                        formData.participantType === "individual"
                          ? "border-[#3B6D11] bg-[#FAFDF6] text-[#3B6D11]"
                          : "border-gray-200 bg-white text-gray-500"
                      }`}
                    >
                      1 Participant (Individual)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, participantType: "group_2_5" }))}
                      className={`py-2.5 px-4 border text-xs font-bold rounded-lg transition ${
                        formData.participantType === "group_2_5"
                          ? "border-[#3B6D11] bg-[#FAFDF6] text-[#3B6D11]"
                          : "border-gray-200 bg-white text-gray-500"
                      }`}
                    >
                      2–5 Participants (Small Group)
                    </button>
                  </div>
                </div>
              </div>

              <div className="text-center pt-6 border-t border-gray-100 mt-6">
                <button
                  onClick={proceedToStep3}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#3B6D11] hover:bg-[#2d540d] text-white font-bold py-3 px-6 rounded-lg shadow-md shadow-[#3B6D11]/10 hover:shadow-lg transition cursor-pointer text-xs"
                >
                  Continue to Plans <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Plan Selection and Payment */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
            >
              {/* Back Link */}
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-gray-800 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to details
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Plans Selection List */}
                <div className="lg:col-span-7 space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Select Membership Plan</h2>
                    <p className="text-xs text-gray-500 mt-1">Choose a duration option below to activate your slot.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {planOptions.map((plan) => {
                      const isSelected = selectedPlanId === plan.id;
                      const formattedPrice = plan.currency === "INR" ? `₹${plan.amount.toLocaleString()}` : `$${plan.amount}`;
                      const formattedOriginal = plan.originalAmount
                        ? (plan.currency === "INR" ? `₹${plan.originalAmount.toLocaleString()}` : `$${plan.originalAmount}`)
                        : null;

                      return (
                        <div
                          key={plan.id}
                          onClick={() => setSelectedPlanId(plan.id)}
                          className={`cursor-pointer bg-white border-2 rounded-2xl p-5 transition-all shadow-sm hover:scale-101 hover:shadow-md flex flex-col justify-between h-44 ${
                            isSelected ? "border-[#3B6D11] bg-[#FAFDF6] ring-2 ring-[#3B6D11]/10" : "border-gray-100"
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-bold text-sm text-gray-900">{plan.label}</h4>
                              <p className="text-[10px] text-gray-400 mt-0.5">12 classes / month</p>
                            </div>
                            {plan.discount && (
                              <span className="bg-[#EAF3DE] text-[#3B6D11] text-[9px] font-bold px-2 py-0.5 rounded-full">
                                {plan.discount}
                              </span>
                            )}
                          </div>

                          <div className="my-2">
                            {formattedOriginal && (
                              <span className="text-[10px] text-gray-400 line-through mr-1.5 block">
                                Regular Price: {formattedOriginal}
                              </span>
                            )}
                            <div className="flex items-baseline gap-0.5">
                              <span className="text-2xl font-black text-gray-900">{formattedPrice}</span>
                              <span className="text-gray-400 text-[10px] font-semibold">
                                {plan.duration === 0 ? "one-time" : `/${plan.duration === 1 ? 'mo' : `${plan.duration} mos`}`}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 text-xs font-semibold self-end mt-2">
                            <div
                              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                isSelected ? "bg-[#3B6D11] border-[#3B6D11]" : "border-gray-300"
                              }`}
                            >
                              {isSelected && <Check className="w-2.5 h-2.5 text-white" strokeWidth={4} />}
                            </div>
                            <span className={isSelected ? "text-[#3B6D11]" : "text-gray-400"}>
                              {isSelected ? "Selected" : "Select"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <p className="text-[10px] text-gray-400 italic">
                    ℹ️ You may book max 2 trail classes with 2 different teachers before subscribing the Plan.
                  </p>
                </div>

                {/* Checkout Summary Box */}
                <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-gray-100 shadow-xl space-y-6">
                  <div>
                    <h3 className="font-extrabold text-sm uppercase text-[#3B6D11] tracking-wider mb-4">
                      Registration Summary
                    </h3>
                    <div className="space-y-3.5 text-xs">
                      <div className="flex justify-between py-1.5 border-b border-gray-100">
                        <span className="text-gray-400">Programme:</span>
                        <strong className="text-gray-800 text-right">{selectedProgram.name}</strong>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-gray-100">
                        <span className="text-gray-400">Participant:</span>
                        <strong className="text-gray-800 capitalize">
                          {formData.participantType === "individual" ? "1 Participant (Individual)" : "2–5 Participants (Group)"}
                        </strong>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-gray-100">
                        <span className="text-gray-400">Customer:</span>
                        <strong className="text-gray-800">{formData.name}</strong>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-gray-100">
                        <span className="text-gray-400">Email:</span>
                        <strong className="text-gray-800">{formData.email}</strong>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-gray-100">
                        <span className="text-gray-400">Phone:</span>
                        <strong className="text-gray-800">{formData.phone}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Payment Checkout triggers */}
                  <div className="pt-4 border-t border-gray-100 space-y-4">
                    {paymentStatus === "creating_order" && (
                      <div className="text-center py-2 text-xs font-semibold text-gray-500 animate-pulse">
                        Preparing secure payment order...
                      </div>
                    )}
                    {paymentStatus === "awaiting_payment" && (
                      <div className="text-center py-2 text-xs font-semibold text-gray-500 animate-pulse">
                        Opening Razorpay payment portal...
                      </div>
                    )}
                    {paymentStatus === "verifying" && (
                      <div className="text-center py-2 text-xs font-semibold text-gray-500 animate-pulse">
                        Confirming payment transaction...
                      </div>
                    )}

                    {!isSubmitting ? (
                      <button
                        onClick={handleCheckout}
                        disabled={!selectedPlanId}
                        className={`w-full bg-[#3B6D11] hover:bg-[#2d540d] text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer text-xs flex items-center justify-center gap-1.5 ${
                          !selectedPlanId ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        <Lock className="w-3.5 h-3.5" />
                        Proceed to Payment
                      </button>
                    ) : (
                      <div className="w-full bg-gray-100 text-gray-400 font-bold py-3 px-6 rounded-lg text-xs text-center">
                        Processing Secure Payment...
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-gray-400 text-[9px] font-semibold pt-2">
                      <span className="flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5 text-gray-400" /> SSL Encrypted
                      </span>
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="w-2.5 h-2.5 text-gray-400" /> Secure Checkout
                      </span>
                      <span className="flex items-center gap-1">
                        <CreditCard className="w-2.5 h-2.5 text-gray-400" /> Razorpay
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Success Screen */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
              className="max-w-xl mx-auto bg-white rounded-3xl p-8 border border-gray-100 shadow-xl text-center space-y-6"
            >
              <div className="w-16 h-16 bg-[#EAF3DE] text-[#3B6D11] rounded-full flex items-center justify-center mx-auto text-3xl">
                ✓
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl font-black text-gray-900">Registration Successful!</h1>
                <p className="text-gray-500 text-xs">
                  Thank you for registering for YogSaathi YogaCare. Your slot is booked successfully.
                </p>
              </div>

              <div className="bg-[#FAF8F5] rounded-2xl p-5 border border-gray-100 text-left space-y-3.5 text-xs max-w-sm mx-auto">
                <div className="flex justify-between border-b border-gray-200/50 pb-2">
                  <span className="text-gray-400">Programme:</span>
                  <strong className="text-gray-800 text-right">{selectedProgram.name}</strong>
                </div>
                <div className="flex justify-between border-b border-gray-200/50 pb-2">
                  <span className="text-gray-400">Selected Plan:</span>
                  <strong className="text-gray-800 capitalize">
                    {selectedPlanId === "trial" ? "Trial Class" : `${selectedPlanId.replace("_", " ")}`}
                  </strong>
                </div>
                <div className="flex justify-between border-b border-gray-200/50 pb-2">
                  <span className="text-gray-400">Customer Name:</span>
                  <strong className="text-gray-800">{formData.name}</strong>
                </div>
                <div className="flex justify-between border-b border-gray-200/50 pb-2">
                  <span className="text-gray-400">Email:</span>
                  <strong className="text-gray-800">{formData.email}</strong>
                </div>
                <div className="flex justify-between pb-1">
                  <span className="text-gray-400">Payment Status:</span>
                  <strong className="text-[#3B6D11] flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Successful
                  </strong>
                </div>
              </div>

              <p className="text-[10px] text-gray-400 max-w-xs mx-auto">
                Our support team will contact you shortly to coordinate scheduling and allot your dedicated trainer.
              </p>

              <div className="pt-4">
                <button
                  onClick={() => navigate("/")}
                  className="bg-[#3B6D11] hover:bg-[#2d540d] text-white font-bold py-2.5 px-6 rounded-lg text-xs transition cursor-pointer"
                >
                  Return to Home
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default YogaCare;
