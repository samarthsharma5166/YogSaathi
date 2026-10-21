import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
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
  Globe,
  Users,
  AlertCircle,
  Calendar,
  Briefcase,
  FileText,
  FileCheck2,
  Sparkles,
  Download,
  Info,
  Sun,
  Activity,
  Layers,
  Moon,
  Wind,
  Eye,
  Flame
} from "lucide-react";
import indianAshtangaSeated from "../assets/indian_ashtanga_seated.jpg";
import indianAshtangaStanding from "../assets/indian_ashtanga_standing.jpg";
import CustomPhoneInput from "../components/CustomPhoneInput";
import { ASHTANGA_PLANS, ASHTANGA_TERMS } from "../config/ashtangaPlans.js";
import {
  createAshtangaRegistration,
  verifyAshtangaPayment,
  handleDownloadInvoice
} from "../services/api.js";

const Ashtanga = () => {
  const navigate = useNavigate();

  // Wizard Steps:
  // 0: Plan & Package Selection
  // 1: Participant Information Form
  // 2: Terms of Service & Payment
  // 3: Success Screen with Invoice Download
  const [step, setStep] = useState(0);

  // Package Type & Plan Selection
  const [sessionType, setSessionType] = useState("individual"); // "individual" | "group"
  const [selectedPlanId, setSelectedPlanId] = useState("1_month");

  // Participant Form Data (as specified in Participant Information sheet)
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    countryOfResidence: "",
    citizenship: "",
    occupation: "",
    jobType: "Desk job", // "Desk job", "Touring", "Other", "Not employed"
    email: "",
    phone: "",
    timezone: "UTC-5 (EST / New York)",
    hasHealthLimitation: "no", // "no" | "yes"
    healthDetails: ""
  });

  // Terms and Conditions Acceptance
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Payment & Submission States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [paymentDetails, setPaymentDetails] = useState(null);

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const currentGroupConfig = ASHTANGA_PLANS[sessionType];
  const activePlan = currentGroupConfig.plans[selectedPlanId];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Step 0 -> Step 1 Validation
  const proceedToStep1 = () => {
    if (!selectedPlanId || !activePlan) {
      toast.error("Please select a package plan to continue.");
      return;
    }
    setStep(1);
  };

  // Step 1 -> Step 2 Validation
  const proceedToStep2 = () => {
    if (!formData.fullName.trim()) {
      toast.error("Please enter your full name.");
      return;
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!formData.phone || formData.phone.length < 8) {
      toast.error("Please enter a valid WhatsApp or mobile number with country code.");
      return;
    }
    if (!formData.countryOfResidence.trim()) {
      toast.error("Please enter your country of residence.");
      return;
    }
    if (formData.hasHealthLimitation === "yes" && !formData.healthDetails.trim()) {
      toast.error("Please provide brief health details relevant to safe practice.");
      return;
    }

    setStep(2);
  };

  // Checkout and Razorpay Integration
  const handleCheckout = async () => {
    if (!termsAccepted) {
      toast.error("Please confirm your acceptance of the Participant Consent & Terms of Service.");
      return;
    }

    setIsSubmitting(true);
    setPaymentStatus("creating_order");

    try {
      const payload = {
        customerName: formData.fullName,
        dateOfBirth: formData.dateOfBirth,
        countryOfResidence: formData.countryOfResidence,
        citizenship: formData.citizenship,
        occupation: formData.occupation,
        jobType: formData.jobType,
        email: formData.email,
        phone: formData.phone,
        timezone: formData.timezone,
        sessionType: sessionType,
        hasHealthLimitation: formData.hasHealthLimitation,
        healthDetails: formData.healthDetails,
        planId: selectedPlanId,
        termsAccepted: true
      };

      const response = await createAshtangaRegistration(payload);
      if (!response.data || !response.data.success) {
        throw new Error(response.data?.error || "Failed to initialize registration order.");
      }

      const orderData = response.data;
      setPaymentStatus("awaiting_payment");

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency || "USD",
        name: "YogSaathi YogaCare",
        description: `Ashtanga Primary Series – ${activePlan.name} (${sessionType === "individual" ? "One to One" : "Group"})`,
        order_id: orderData.orderId,
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: "#27500A"
        },
        handler: async function (paymentResponse) {
          setPaymentStatus("verifying");
          try {
            const verifyRes = await verifyAshtangaPayment({
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_signature: paymentResponse.razorpay_signature
            });

            if (verifyRes.data && verifyRes.data.success) {
              setPaymentDetails(verifyRes.data.registration);
              setPaymentStatus("success");
              setStep(3);
              toast.success("Payment verified and slot booked successfully!");
            } else {
              setPaymentStatus("failed");
              toast.error("Payment verification failed.");
            }
          } catch (err) {
            console.error(err);
            setPaymentStatus("failed");
            toast.error("Error verifying payment.");
          } finally {
            setIsSubmitting(false);
          }
        },
        modal: {
          ondismiss: function () {
            setPaymentStatus("failed");
            setIsSubmitting(false);
            toast.error("Payment window closed.");
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      const errMsg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Failed to initiate payment. Please try again.";
      toast.error(errMsg);
      setIsSubmitting(false);
      setPaymentStatus("failed");
    }
  };

  const todayFormatted = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1C2623] font-sans pt-20 pb-16 px-4 md:px-8">
      <Toaster position="top-right" />

      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              if (step > 0 && step < 3) {
                setStep(step - 1);
              } else {
                navigate("/");
              }
            }}
            className="inline-flex items-center gap-2 text-xs md:text-sm font-bold text-gray-600 hover:text-[#27500A] bg-white border border-gray-200 px-3.5 py-2 rounded-xl transition shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#3B6D11]" />
            {step === 0 ? "Back to Home" : "Previous Step"}
          </button>

          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            YogSaathi YogaCare Ashtanga
          </span>
        </div>

        {/* ================= STEP 0: OVERVIEW, STRUCTURE & PACKAGES ================= */}
        {step === 0 && (
          <div className="space-y-10">
            {/* Hero Introduction with Indian Practitioner Image */}
            <div className="bg-white rounded-3xl p-6 md:p-10 border border-gray-100 shadow-sm overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <div className="inline-flex items-center gap-2 bg-[#EAF3DE] text-[#27500A] text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-[#a3c97a]/40 shadow-2xs">
                    <Sparkles className="w-3.5 h-3.5 text-[#3B6D11]" /> Authentic Ashtanga Practice
                  </div>
                  <h1 className="text-3xl md:text-5xl font-black text-[#1C2623] tracking-tight leading-tight">
                    Ashtanga Yoga – Primary Series
                  </h1>
                  <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                    The Ashtanga Yoga Primary Series is a structured sequence of postures designed to cleanse, strengthen, and align the body. It follows four broad sections: Opening Sequence, Standing Poses, Seated Poses, and Finishing Sequence. The practice coordinates postures with breathing and movement, following a systematic progression at an individual’s own pace.
                  </p>
                  
                  <div className="flex flex-wrap gap-2.5 pt-2">
                    <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-900 border border-amber-200/80 rounded-xl px-3.5 py-1.5 text-xs font-bold">
                      <Clock className="w-4 h-4 text-amber-600" />
                      <span>Class Duration: 1 Hour (60 Minutes)</span>
                    </div>
                    <div className="inline-flex items-center gap-2 bg-[#EAF3DE] text-[#27500A] border border-[#a3c97a]/50 rounded-xl px-3.5 py-1.5 text-xs font-bold">
                      <Globe className="w-4 h-4 text-[#3B6D11]" />
                      <span>Live 1-on-1 & Small Group Sessions</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <a
                      href="#pricing-section"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#27500A] text-white text-xs md:text-sm font-bold hover:bg-[#1f3f08] transition shadow-sm hover:shadow-md cursor-pointer"
                    >
                      View Class Packages <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                <div className="lg:col-span-5 relative">
                  <div className="relative rounded-2xl overflow-hidden shadow-lg border-2 border-[#27500A]/10 group">
                    <img
                      src={indianAshtangaSeated}
                      alt="Indian yoga practitioner practicing Ashtanga Primary Series seated pose"
                      className="w-full h-72 md:h-84 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent flex items-end p-4">
                      <div className="text-white">
                        <p className="text-xs font-bold tracking-wide uppercase text-green-300">Traditional Shala Practice</p>
                        <p className="text-sm font-semibold">Guided by Certified Indian Ashtanga Masters</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Structure of the Primary Series */}
            <div className="bg-white rounded-3xl p-6 md:p-10 border border-gray-100 shadow-sm space-y-6">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#3B6D11] bg-[#EAF3DE] px-3.5 py-1 rounded-full">
                  Systematic Progression
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-[#1C2623] tracking-tight">
                  Structure of the Primary Series
                </h2>
                <p className="text-gray-600 text-xs md:text-sm">
                  The Primary Series flows continuously through four main parts:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Part 1 */}
                <div className="bg-[#FAF8F5] rounded-2xl p-5 border border-gray-200/80 flex flex-col justify-between hover:shadow-md hover:border-[#3B6D11]/40 transition-all duration-200">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                        <Sun className="w-5 h-5 text-amber-600" />
                      </div>
                      <span className="text-[11px] font-black text-gray-400 uppercase tracking-wider">Part 01</span>
                    </div>
                    <h3 className="font-extrabold text-sm md:text-base text-gray-900">
                      Opening Sun Salutations
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Surya Namaskara A and Surya Namaskara B to generate internal heat.
                    </p>
                  </div>
                  <div className="pt-4 border-t border-gray-200/60 mt-3 text-[11px] font-bold text-[#3B6D11]">
                    Internal Heat & Vital Energy
                  </div>
                </div>

                {/* Part 2 */}
                <div className="bg-[#FAF8F5] rounded-2xl p-5 border border-gray-200/80 flex flex-col justify-between hover:shadow-md hover:border-[#3B6D11]/40 transition-all duration-200">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                        <Activity className="w-5 h-5 text-emerald-600" />
                      </div>
                      <span className="text-[11px] font-black text-gray-400 uppercase tracking-wider">Part 02</span>
                    </div>
                    <h3 className="font-extrabold text-sm md:text-base text-gray-900">
                      Standing Sequence
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      A set of forward folds, hip openers, and triangle/twist variations to build physical stability and core tone.
                    </p>
                  </div>
                  <div className="pt-4 border-t border-gray-200/60 mt-3 text-[11px] font-bold text-[#3B6D11]">
                    Stability & Core Tone
                  </div>
                </div>

                {/* Part 3 */}
                <div className="bg-[#FAF8F5] rounded-2xl p-5 border border-gray-200/80 flex flex-col justify-between hover:shadow-md hover:border-[#3B6D11]/40 transition-all duration-200">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                        <Layers className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="text-[11px] font-black text-gray-400 uppercase tracking-wider">Part 03</span>
                    </div>
                    <h3 className="font-extrabold text-sm md:text-base text-gray-900">
                      Seated Sequence
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      A long progression of seated forward bends, hip-opening lotuses, twists, arm balances, and backbends.
                    </p>
                  </div>
                  <div className="pt-4 border-t border-gray-200/60 mt-3 text-[11px] font-bold text-[#3B6D11]">
                    Detoxification & Flexibility
                  </div>
                </div>

                {/* Part 4 */}
                <div className="bg-[#FAF8F5] rounded-2xl p-5 border border-gray-200/80 flex flex-col justify-between hover:shadow-md hover:border-[#3B6D11]/40 transition-all duration-200">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                        <Moon className="w-5 h-5 text-indigo-600" />
                      </div>
                      <span className="text-[11px] font-black text-gray-400 uppercase tracking-wider">Part 04</span>
                    </div>
                    <h3 className="font-extrabold text-sm md:text-base text-gray-900">
                      Finishing Sequence
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Inversions (such as headstand and shoulderstand), closing backbends (wheel pose), seated meditation poses, and final relaxation in Savasana.
                    </p>
                  </div>
                  <div className="pt-4 border-t border-gray-200/60 mt-3 text-[11px] font-bold text-[#3B6D11]">
                    Integration & Deep Calm
                  </div>
                </div>
              </div>
            </div>

            {/* Core Technique Elements with Indian Practitioner Image */}
            <div className="bg-white rounded-3xl p-6 md:p-10 border border-gray-100 shadow-sm overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 order-2 lg:order-1 relative">
                  <div className="relative rounded-2xl overflow-hidden shadow-lg border-2 border-[#27500A]/10 group">
                    <img
                      src={indianAshtangaStanding}
                      alt="Indian yoga teacher practicing Ashtanga standing asana with Drishti gaze"
                      className="w-full h-80 lg:h-96 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent flex items-end p-4">
                      <div className="text-white">
                        <p className="text-xs font-bold tracking-wide uppercase text-green-300">The Tristana Method</p>
                        <p className="text-sm font-semibold">Breath, Energy Lock & Focused Gaze</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7 order-1 lg:order-2 space-y-5">
                  <div className="space-y-2">
                    <span className="text-xs font-extrabold uppercase tracking-widest text-[#3B6D11] bg-[#EAF3DE] px-3.5 py-1 rounded-full">
                      Essential Foundations
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-[#1C2623] tracking-tight">
                      Core Technique Elements
                    </h2>
                    <p className="text-gray-600 text-xs md:text-sm">
                      Ashtanga practice coordinates postures with breathing and movement through three central pillars:
                    </p>
                  </div>

                  <div className="space-y-3.5">
                    {/* Ujjayi Breath */}
                    <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-gray-200/80 hover:border-[#3B6D11]/40 transition">
                      <div className="flex items-start gap-3.5">
                        <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                          <Wind className="w-4 h-4 text-teal-700" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-extrabold text-sm text-gray-900">Ujjayi Breath</h4>
                          <p className="text-xs text-gray-600 leading-relaxed">
                            A deep, audible throat breathing pattern that maintains internal temperature and rhythm.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Bandhas */}
                    <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-gray-200/80 hover:border-[#3B6D11]/40 transition">
                      <div className="flex items-start gap-3.5">
                        <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                          <Lock className="w-4 h-4 text-emerald-700" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-extrabold text-sm text-gray-900">Bandhas</h4>
                          <p className="text-xs text-gray-600 leading-relaxed">
                            Internal muscular contractions—specifically Mula Bandha (root lock) and Uddiyana Bandha (lower belly lock)—to support posture and direct energy.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Drishti */}
                    <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-gray-200/80 hover:border-[#3B6D11]/40 transition">
                      <div className="flex items-start gap-3.5">
                        <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                          <Eye className="w-4 h-4 text-amber-700" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-extrabold text-sm text-gray-900">Drishti</h4>
                          <p className="text-xs text-gray-600 leading-relaxed">
                            A specific focal point for the eyes during each asana to stabilize concentration and meditative intent.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Progress Stepper */}
        {step < 3 && (
          <div id="pricing-section" className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm scroll-mt-24">
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div
                className={`py-2 px-1 rounded-xl font-bold flex items-center justify-center gap-1.5 transition ${
                  step === 0
                    ? "bg-[#27500A] text-white shadow-sm"
                    : step > 0
                    ? "text-[#27500A] bg-[#EAF3DE]"
                    : "text-gray-400"
                }`}
              >
                <span>1. Select Package</span>
              </div>
              <div
                className={`py-2 px-1 rounded-xl font-bold flex items-center justify-center gap-1.5 transition ${
                  step === 1
                    ? "bg-[#27500A] text-white shadow-sm"
                    : step > 1
                    ? "text-[#27500A] bg-[#EAF3DE]"
                    : "text-gray-400"
                }`}
              >
                <span>2. Participant Info</span>
              </div>
              <div
                className={`py-2 px-1 rounded-xl font-bold flex items-center justify-center gap-1.5 transition ${
                  step === 2
                    ? "bg-[#27500A] text-white shadow-sm"
                    : "text-gray-400"
                }`}
              >
                <span>3. Consent & Pay</span>
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 0: PLAN & PACKAGE SELECTION ================= */}
        {step === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8"
          >
            {/* Session Type Switcher */}
            <div className="bg-white rounded-2xl p-4 md:p-6 border border-gray-100 shadow-sm max-w-2xl mx-auto space-y-3">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block text-center">
                Select Your Class Format
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#FAF8F5] p-2 rounded-xl border border-gray-200">
                <button
                  type="button"
                  onClick={() => setSessionType("individual")}
                  className={`py-3 px-4 rounded-xl text-xs md:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                    sessionType === "individual"
                      ? "bg-[#27500A] text-white shadow-md"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <User className="w-4 h-4" /> Single Individual (1-on-1)
                </button>
                <button
                  type="button"
                  onClick={() => setSessionType("group")}
                  className={`py-3 px-4 rounded-xl text-xs md:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                    sessionType === "group"
                      ? "bg-[#27500A] text-white shadow-md"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Users className="w-4 h-4" /> 2 or More People (Group)
                </button>
              </div>
              <p className="text-[11px] text-gray-500 text-center font-medium">
                {currentGroupConfig.subtitle}
              </p>
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.keys(currentGroupConfig.plans).map((planKey) => {
                const plan = currentGroupConfig.plans[planKey];
                const isSelected = selectedPlanId === planKey;

                return (
                  <div
                    key={planKey}
                    onClick={() => setSelectedPlanId(planKey)}
                    className={`bg-white rounded-3xl p-6 border-2 transition-all duration-300 flex flex-col justify-between relative cursor-pointer ${
                      isSelected
                        ? "border-[#27500A] ring-4 ring-[#27500A]/10 shadow-xl scale-[1.02]"
                        : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#27500A] text-white text-[10px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-sm">
                        Best Value
                      </div>
                    )}

                    <div className="space-y-4">
                      {/* Card Header */}
                      <div className="border-b border-gray-100 pb-3 text-center">
                        <span className="text-[11px] font-bold text-[#3B6D11] uppercase tracking-wider">
                          {plan.durationLabel}
                        </span>
                        <h3 className="text-xl font-black text-gray-900 mt-1">{plan.name}</h3>
                        <div className="inline-flex items-center gap-1 text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md mt-1 font-semibold">
                          <Clock className="w-3 h-3 text-amber-600" /> 1 Hour Duration
                        </div>
                      </div>

                      {/* Price Box */}
                      <div className="bg-[#FAFDF6] border border-[#a3c97a]/40 rounded-2xl p-4 text-center space-y-1">
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="text-4xl font-black text-[#27500A]">
                            ${plan.amount}
                          </span>
                          <span className="text-xs text-gray-500 font-bold uppercase">USD</span>
                        </div>
                        <p className="text-[11px] text-gray-500 font-medium">
                          {sessionType === "group" ? "Per person (Group class)" : "Per person (One-to-One)"}
                        </p>
                      </div>

                      {/* Features */}
                      <ul className="space-y-2 text-xs text-gray-600 pt-2">
                        {plan.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-[#3B6D11] shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-6">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPlanId(planKey);
                          proceedToStep1();
                        }}
                        className={`w-full py-3 px-4 rounded-xl font-bold text-xs md:text-sm transition flex items-center justify-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? "bg-[#27500A] text-white shadow-md hover:bg-[#1a3806]"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        Select & Continue <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Note & Guidelines Box */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm max-w-3xl mx-auto space-y-3">
              <h4 className="font-extrabold text-sm text-[#27500A] flex items-center gap-2">
                <Info className="w-4 h-4 text-[#3B6D11]" /> Important Ashtanga Class Notes
              </h4>
              <ul className="space-y-1.5 text-xs text-gray-600 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-[#3B6D11] font-bold">•</span>
                  <span><strong>Class Duration:</strong> Every class is a 1 Hour live interactive session.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#3B6D11] font-bold">•</span>
                  <span><strong>Teacher Approval:</strong> You may take a Trial Class with a teacher before booking full packages. The teacher approved by you will be allotted for your subsequent sessions.</span>
                </li>
                {/* <li className="flex items-start gap-2">
                  <span className="text-[#3B6D11] font-bold">•</span>
                  <span><strong>Frequency:</strong> Monthly packages include 12 live classes per month (~3 classes per week).</span>
                </li> */}
              </ul>
            </div>
          </motion.div>
        )}

        {/* ================= STEP 1: PARTICIPANT INFORMATION ================= */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-white rounded-3xl p-6 md:p-10 border border-gray-100 shadow-xl space-y-8 max-w-3xl mx-auto"
          >
            <div>
              <div className="inline-flex items-center gap-1.5 bg-[#EAF3DE] text-[#27500A] text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                <FileText className="w-3.5 h-3.5" /> Participant Information Form
              </div>
              <h2 className="text-2xl font-black text-gray-900">
                1. Personal Details & Health Information
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Selected Plan: <strong className="text-gray-900">{activePlan.name} (${activePlan.amount} USD)</strong> • {currentGroupConfig.name}
              </p>
            </div>

            {/* Section 1: Personal Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-[#3B6D11]" /> 1. Personal Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="e.g. John Doe"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:border-[#27500A] focus:ring-2 focus:ring-[#27500A]/10 outline-none transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700">Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:border-[#27500A] focus:ring-2 focus:ring-[#27500A]/10 outline-none transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:border-[#27500A] focus:ring-2 focus:ring-[#27500A]/10 outline-none transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700">WhatsApp / Mobile with Country Code *</label>
                  <CustomPhoneInput
                    value={formData.phone}
                    onChange={(val) => setFormData((prev) => ({ ...prev, phone: val }))}
                    placeholder="Mobile number"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700">Country of Residence *</label>
                  <input
                    type="text"
                    name="countryOfResidence"
                    value={formData.countryOfResidence}
                    onChange={handleInputChange}
                    placeholder="e.g. United States, United Kingdom, Singapore..."
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:border-[#27500A] focus:ring-2 focus:ring-[#27500A]/10 outline-none transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700">Citizenship</label>
                  <input
                    type="text"
                    name="citizenship"
                    value={formData.citizenship}
                    onChange={handleInputChange}
                    placeholder="e.g. American, British, Indian..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:border-[#27500A] focus:ring-2 focus:ring-[#27500A]/10 outline-none transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700">Occupation</label>
                  <input
                    type="text"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleInputChange}
                    placeholder="e.g. Software Engineer, Consultant, Student..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:border-[#27500A] focus:ring-2 focus:ring-[#27500A]/10 outline-none transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700">If Employed, Type of Job</label>
                  <select
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:border-[#27500A] focus:ring-2 focus:ring-[#27500A]/10 outline-none transition bg-white"
                  >
                    <option value="Desk job">Desk job (Sitting / Computer)</option>
                    <option value="Touring">Touring / Frequent Travel</option>
                    <option value="Physical / Standing">Physical / Standing</option>
                    <option value="Self-Employed">Self-Employed / Business</option>
                    <option value="Not employed / Retired">Not employed / Retired / Student</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-bold text-gray-700">Preferred Time Zone</label>
                <input
                  type="text"
                  name="timezone"
                  value={formData.timezone}
                  onChange={handleInputChange}
                  placeholder="e.g. EST (US East), PST (California), GMT / BST (UK), CET (Europe), AEST..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:border-[#27500A] focus:ring-2 focus:ring-[#27500A]/10 outline-none transition"
                />
              </div>
            </div>

            {/* Section 2: Health & Safety Information */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#3B6D11]" /> 2. Health & Safety Information
              </h3>

              <div className="bg-[#FAFDF6] border border-[#a3c97a]/40 rounded-2xl p-4 md:p-5 space-y-3">
                <p className="text-xs text-gray-700 font-medium leading-relaxed">
                  Please indicate whether you have any existing injury, persistent pain, significant medical condition, recent surgery, mobility limitation or medical restriction that could affect your participation:
                </p>

                <div className="space-y-2">
                  <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-gray-800">
                    <input
                      type="radio"
                      name="hasHealthLimitation"
                      value="no"
                      checked={formData.hasHealthLimitation === "no"}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-[#27500A] focus:ring-[#27500A]"
                    />
                    <span>No relevant limitation known to me</span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-gray-800">
                    <input
                      type="radio"
                      name="hasHealthLimitation"
                      value="yes"
                      checked={formData.hasHealthLimitation === "yes"}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-[#27500A] focus:ring-[#27500A]"
                    />
                    <span>Yes / Not sure — details relevant to safe practice</span>
                  </label>
                </div>

                {formData.hasHealthLimitation === "yes" && (
                  <div className="pt-2">
                    <label className="text-[11px] font-bold text-gray-600 block mb-1">
                      Details relevant to safe practice:
                    </label>
                    <textarea
                      name="healthDetails"
                      rows={3}
                      value={formData.healthDetails}
                      onChange={handleInputChange}
                      placeholder="Please mention any back, knee, shoulder injury, hypertension, surgery, or other limitations..."
                      className="w-full p-3 rounded-xl border border-gray-300 text-xs font-medium focus:border-[#27500A] focus:ring-2 focus:ring-[#27500A]/10 outline-none transition bg-white"
                    />
                  </div>
                )}

                <p className="text-[11px] text-gray-500 italic">
                  Note: You may contact YogSaathi to discuss sensitive health information in private.
                </p>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setStep(0)}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
              >
                Back to Plans
              </button>

              <button
                type="button"
                onClick={proceedToStep2}
                className="px-6 py-3 rounded-xl bg-[#27500A] hover:bg-[#1a3806] text-white text-xs md:text-sm font-bold shadow-md transition cursor-pointer flex items-center gap-1.5"
              >
                Continue to Consent & Terms <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* ================= STEP 2: TERMS OF SERVICE & PAYMENT ================= */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6 max-w-4xl mx-auto"
          >
            {/* Booking Summary Card */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#EAF3DE] text-[#27500A] px-2.5 py-0.5 rounded-md">
                  Package Summary
                </span>
                <h3 className="text-xl font-black text-gray-900 mt-1">
                  {activePlan.name}
                </h3>
                <p className="text-xs text-gray-600 mt-0.5">
                  Format: <strong className="text-gray-800">{currentGroupConfig.name}</strong> • Duration: <strong className="text-gray-800">1 Hour per class</strong> ({activePlan.classesCount} classes)
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Participant: <strong className="text-gray-800">{formData.fullName}</strong> ({formData.email}, {formData.phone})
                </p>
              </div>

              <div className="text-right shrink-0 bg-[#FAFDF6] border border-[#a3c97a]/40 p-4 rounded-2xl w-full md:w-auto">
                <div className="text-xs text-gray-500 font-bold uppercase">Total Payable</div>
                <div className="text-3xl font-black text-[#27500A]">${activePlan.amount} USD</div>
                <div className="text-[10px] text-gray-400">Secure Online Checkout</div>
              </div>
            </div>

            {/* Terms & Conditions Container */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-xl space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                  <FileCheck2 className="w-3.5 h-3.5 text-amber-600" /> Terms & Conditions
                </div>
                <h2 className="text-xl md:text-2xl font-black text-gray-900">
                  {ASHTANGA_TERMS.title}
                </h2>
                <p className="text-xs text-gray-500">
                  {ASHTANGA_TERMS.subtitle} • Service Provider: {ASHTANGA_TERMS.provider}
                </p>
              </div>

              {/* Scrollable Terms Box */}
              <div className="bg-[#FAF8F5] border border-gray-200 rounded-2xl p-4 md:p-6 max-h-96 overflow-y-auto space-y-6 text-xs text-gray-700 leading-relaxed shadow-inner">
                
                {/* Part A1 */}
                <div className="space-y-3">
                  <h4 className="font-extrabold text-sm text-[#27500A] border-b border-gray-200 pb-1.5 uppercase tracking-wide">
                    {ASHTANGA_TERMS.partA.title}
                  </h4>
                  <p className="text-gray-500 italic text-[11px]">Please read the following statements carefully.</p>
                  <div className="space-y-3">
                    {ASHTANGA_TERMS.partA.points.map((pt, i) => (
                      <div key={i} className="space-y-0.5">
                        <strong className="text-gray-900 block font-bold">{pt.heading}</strong>
                        <p className="text-gray-600">{pt.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Part B2 */}
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <h4 className="font-extrabold text-sm text-[#27500A] border-b border-gray-200 pb-1.5 uppercase tracking-wide">
                    {ASHTANGA_TERMS.partB.title}
                  </h4>
                  <div className="space-y-3">
                    {ASHTANGA_TERMS.partB.points.map((pt, i) => (
                      <div key={i} className="space-y-0.5">
                        <strong className="text-gray-900 block font-bold">{pt.heading}</strong>
                        <p className="text-gray-600">{pt.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Part C */}
                <div className="space-y-3 pt-4 border-t border-gray-200 bg-white p-4 rounded-xl border border-gray-200/80">
                  <h4 className="font-extrabold text-sm text-[#27500A] uppercase tracking-wide">
                    {ASHTANGA_TERMS.partC.title}
                  </h4>
                  <p className="text-gray-600 font-medium">
                    Please confirm the following before commencing YogSaathi YogaCare Ashtanga Primary Series sessions:
                  </p>
                  <ul className="space-y-1.5 pl-4 list-disc text-gray-600">
                    {ASHTANGA_TERMS.partC.acknowledgements.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>

                  <div className="pt-3 border-t border-gray-100 text-[11px] text-gray-500 space-y-1">
                    <div>Participant's Full Name: <strong className="text-gray-800">{formData.fullName}</strong></div>
                    <div>Country of Residence: <strong className="text-gray-800">{formData.countryOfResidence}</strong></div>
                    <div>Date: <strong className="text-gray-800">{todayFormatted}</strong></div>
                    <div>Service Provider: <strong className="text-gray-800">{ASHTANGA_TERMS.provider}</strong> ({ASHTANGA_TERMS.website})</div>
                  </div>
                </div>

              </div>

              {/* Mandatory Checkbox */}
              <div className="bg-[#FAFDF6] border-2 border-[#3B6D11]/40 rounded-2xl p-4 md:p-5 space-y-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="w-5 h-5 rounded text-[#27500A] focus:ring-[#27500A] mt-0.5 cursor-pointer shrink-0"
                  />
                  <span className="text-xs font-bold text-gray-900 leading-relaxed select-none">
                    Participant confirmation: I Agree. I confirm that I am aged 18 years or above, have read, understood, and accept Part A1 (Participant Consent & Safety Declaration), Part B2 (Service & Payment Terms), and Part C (Participant Acceptance) including Point 14 recording & privacy provisions.
                  </span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer disabled:opacity-50"
                >
                  Edit Information
                </button>

                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={!termsAccepted || isSubmitting}
                  className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-extrabold text-xs md:text-sm shadow-lg transition flex items-center justify-center gap-2 cursor-pointer ${
                    termsAccepted && !isSubmitting
                      ? "bg-[#27500A] hover:bg-[#1a3806] text-white shadow-[#27500A]/20"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  {isSubmitting
                    ? paymentStatus === "creating_order"
                      ? "Preparing Order..."
                      : paymentStatus === "verifying"
                      ? "Verifying Payment..."
                      : "Processing..."
                    : `Pay $${activePlan.amount} USD & Book Slot`}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ================= STEP 3: SUCCESS SCREEN ================= */}
        {step === 3 && paymentDetails && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-6 md:p-10 border border-gray-100 shadow-xl max-w-2xl mx-auto text-center space-y-6"
          >
            <div className="w-16 h-16 bg-[#EAF3DE] text-[#27500A] rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#3B6D11]">
                Booking Confirmed
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900">
                Welcome to Ashtanga Primary Series!
              </h2>
              <p className="text-gray-600 text-xs md:text-sm max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{paymentDetails.customerName}</strong>. Your slot has been booked successfully. A confirmation message and your joining details will be sent via WhatsApp and email.
              </p>
            </div>

            {/* Details Card */}
            <div className="bg-[#FAF8F5] rounded-2xl p-5 border border-gray-200 text-left text-xs space-y-2.5">
              <div className="flex justify-between items-center border-b border-gray-200/80 pb-2">
                <span className="text-gray-500 font-medium">Program</span>
                <strong className="text-gray-900 font-bold">{paymentDetails.planName}</strong>
              </div>
              <div className="flex justify-between items-center border-b border-gray-200/80 pb-2">
                <span className="text-gray-500 font-medium">Session Format</span>
                <strong className="text-gray-900 capitalize">
                  {paymentDetails.sessionType === "individual" ? "Single Individual (1-on-1)" : "Group Class"}
                </strong>
              </div>
              <div className="flex justify-between items-center border-b border-gray-200/80 pb-2">
                <span className="text-gray-500 font-medium">Duration</span>
                <strong className="text-gray-900">{paymentDetails.classesCount} Live Classes (1 Hour each)</strong>
              </div>
              <div className="flex justify-between items-center border-b border-gray-200/80 pb-2">
                <span className="text-gray-500 font-medium">Amount Paid</span>
                <strong className="text-[#27500A] font-black text-sm">${paymentDetails.amount} USD</strong>
              </div>
              <div className="flex justify-between items-center border-b border-gray-200/80 pb-2">
                <span className="text-gray-500 font-medium">Payment ID</span>
                <span className="text-gray-700 font-mono text-[11px]">{paymentDetails.paymentId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">Validity Period</span>
                <span className="text-gray-700 font-semibold">
                  {paymentDetails.startDate ? new Date(paymentDetails.startDate).toLocaleDateString() : "Starting Tomorrow"} – {paymentDetails.expiresAt ? new Date(paymentDetails.expiresAt).toLocaleDateString() : ""}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              {paymentDetails.invoice && (
                <button
                  type="button"
                  onClick={() => handleDownloadInvoice(paymentDetails.invoice)}
                  className="inline-flex items-center justify-center gap-2 bg-[#27500A] hover:bg-[#1a3806] text-white text-xs font-bold py-3 px-6 rounded-xl shadow-md transition cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Download Official Invoice
                </button>
              )}

              <button
                type="button"
                onClick={() => navigate("/")}
                className="inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold py-3 px-6 rounded-xl transition cursor-pointer"
              >
                Back to Home
              </button>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default Ashtanga;
