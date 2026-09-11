import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Sparkles,
  HelpCircle,
  Video,
  Clock,
  Calendar,
  CreditCard,
  Percent,
  ShieldCheck,
  MessageCircle,
  Users,
  User,
  CheckCircle2
} from "lucide-react";

const PRICING_DATA = {
  india: {
    currencySymbol: "₹",
    currencyCode: "INR",
    trial: {
      amount: 199,
      classes: 1,
      description: "1-on-1 trial session via live Zoom with a certified trainer before taking any long-term plan."
    },
    individual: {
      title: "1 Participant (Individual)",
      subtitle: "Personalised 1-on-1 attention with a dedicated Yoga Teacher",
      plans: [
        {
          duration: "1 Month",
          months: 1,
          basePrice: 12000,
          fullPayment: 6000,
          discount: "50% Off",
          monthlyOptionTotal: 7000,
          installments: [
            { month: "Month 1", amount: 7000 }
          ],
          classesCount: 12,
          popular: false
        },
        {
          duration: "3 Months",
          months: 3,
          basePrice: 36000,
          fullPayment: 16500,
          discount: "54% Off",
          monthlyOptionTotal: 18000,
          installments: [
            { month: "Month 1", amount: 9000 },
            { month: "Month 2", amount: 9000 }
          ],
          classesCount: 36,
          popular: true
        },
        {
          duration: "6 Months",
          months: 6,
          basePrice: 72000,
          fullPayment: 30000,
          discount: "58% Off",
          monthlyOptionTotal: 34000,
          installments: [
            { month: "Month 1", amount: 8500 },
            { month: "Month 2", amount: 8500 },
            { month: "Month 3", amount: 8500 },
            { month: "Month 4", amount: 8500 }
          ],
          classesCount: 72,
          popular: false
        }
      ]
    },
    group_2_5: {
      title: "2–5 Participants (Small Group)",
      subtitle: "Interactive small batch for family, friends, or focused peers",
      plans: [
        {
          duration: "1 Month",
          months: 1,
          basePrice: 6000,
          fullPayment: 3000,
          discount: "50% Off",
          monthlyOptionTotal: 3000,
          installments: [
            { month: "Month 1", amount: 3000 }
          ],
          classesCount: 12,
          popular: false
        },
        {
          duration: "3 Months",
          months: 3,
          basePrice: 18000,
          fullPayment: 8000,
          discount: "56% Off",
          monthlyOptionTotal: 9000,
          installments: [
            { month: "Month 1", amount: 4500 },
            { month: "Month 2", amount: 4500 }
          ],
          classesCount: 36,
          popular: true
        },
        {
          duration: "6 Months",
          months: 6,
          basePrice: 36000,
          fullPayment: 15000,
          discount: "58% Off",
          monthlyOptionTotal: 18000,
          installments: [
            { month: "Month 1", amount: 4500 },
            { month: "Month 2", amount: 4500 },
            { month: "Month 3", amount: 4500 },
            { month: "Month 4", amount: 4500 }
          ],
          classesCount: 72,
          popular: false
        }
      ]
    }
  },
  international: {
    currencySymbol: "$",
    currencyCode: "USD",
    trial: {
      amount: 10,
      classes: 1,
      description: "1-on-1 trial session via live Zoom with a certified trainer before taking any long-term plan."
    },
    individual: {
      title: "1 Participant (Individual)",
      subtitle: "Personalised 1-on-1 attention with a dedicated Yoga Teacher",
      plans: [
        {
          duration: "1 Month",
          months: 1,
          basePrice: null,
          fullPayment: 200,
          discount: null,
          monthlyOptionTotal: 200,
          installments: [
            { month: "Month 1", amount: 200 }
          ],
          classesCount: 12,
          popular: false
        },
        {
          duration: "3 Months",
          months: 3,
          basePrice: null,
          fullPayment: 525,
          discount: "Save $35 vs Monthly",
          monthlyOptionTotal: 560,
          installments: [
            { month: "Month 1", amount: 280 },
            { month: "Month 2", amount: 280 }
          ],
          classesCount: 36,
          popular: true
        },
        {
          duration: "6 Months",
          months: 6,
          basePrice: null,
          fullPayment: 950,
          discount: "Save $110 vs Monthly",
          monthlyOptionTotal: 1060,
          installments: [
            { month: "Month 1", amount: 265 },
            { month: "Month 2", amount: 265 },
            { month: "Month 3", amount: 265 },
            { month: "Month 4", amount: 265 }
          ],
          classesCount: 72,
          popular: false
        }
      ]
    },
    group_2_5: {
      title: "2–5 Participants (Small Group)",
      subtitle: "Interactive small batch for family, friends, or focused peers",
      plans: [
        {
          duration: "1 Month",
          months: 1,
          basePrice: null,
          fullPayment: 150,
          discount: null,
          monthlyOptionTotal: 150,
          installments: [
            { month: "Month 1", amount: 150 }
          ],
          classesCount: 12,
          popular: false
        },
        {
          duration: "3 Months",
          months: 3,
          basePrice: null,
          fullPayment: 400,
          discount: "Save $30 vs Monthly",
          monthlyOptionTotal: 430,
          installments: [
            { month: "Month 1", amount: 215 },
            { month: "Month 2", amount: 215 }
          ],
          classesCount: 36,
          popular: true
        },
        {
          duration: "6 Months",
          months: 6,
          basePrice: null,
          fullPayment: 700,
          discount: "Save $100 vs Monthly",
          monthlyOptionTotal: 800,
          installments: [
            { month: "Month 1", amount: 200 },
            { month: "Month 2", amount: 200 },
            { month: "Month 3", amount: 200 },
            { month: "Month 4", amount: 200 }
          ],
          classesCount: 72,
          popular: false
        }
      ]
    }
  }
};

const YogaCarePricing = () => {
  const navigate = useNavigate();
  const [region, setRegion] = useState("india"); // "india" | "international"
  const [participantType, setParticipantType] = useState("individual"); // "individual" | "group_2_5"

  const currentRegionData = PRICING_DATA[region];
  const currentGroupData = currentRegionData[participantType];
  const symbol = currentRegionData.currencySymbol;

  const handleRegisterClick = () => {
    navigate("/yogacare");
  };

  const whatsappInquiryUrl = `https://wa.me/919971714091?text=${encodeURIComponent(
    `Hi YogSaathi! I am inquiring about YogaCare (${region === "india" ? "India" : "International"}, ${
      participantType === "individual" ? "1 Participant" : "2-5 Participants"
    }) monthly installment payment plans.`
  )}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF8F5] via-[#F4F9EE] to-[#EAF3DE] text-[#1C2623] py-10 px-4 md:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Navigation & Back Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() => navigate("/yogacare")}
            className="inline-flex items-center gap-2 text-xs md:text-sm font-bold text-gray-600 hover:text-[#3B6D11] bg-white/80 hover:bg-white border border-gray-200 px-4 py-2 rounded-xl transition shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#3B6D11]" /> Back to YogaCare Registration
          </button>

          <button
            onClick={handleRegisterClick}
            className="inline-flex items-center gap-2 text-xs md:text-sm font-bold text-white bg-[#3B6D11] hover:bg-[#2d540d] px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer"
          >
            Book Your Slot Now <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Hero Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 bg-[#EAF3DE] text-[#3B6D11] text-xs font-extrabold uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-[#a3c97a]/30">
            <Sparkles className="w-3.5 h-3.5" /> Monthly Payment Plans
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-[#27500a] tracking-tight leading-tight">
            YogaCare Monthly Fee Structure & Pricing Plans
          </h1>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            Convenient <strong className="text-gray-900">Monthly Payment Plans</strong> with structured installment schedules. All plans feature 12 live interactive classes per month (45 mins each, 3x per week).
          </p>
        </div>

        {/* Region & Group Switcher Controls */}
        <div className="bg-white rounded-2xl p-4 md:p-6 border border-gray-100 shadow-lg space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Region Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                1. Select Location / Currency
              </label>
              <div className="grid grid-cols-2 gap-2 bg-[#FAF8F5] p-1.5 rounded-xl border border-gray-200">
                <button
                  type="button"
                  onClick={() => setRegion("india")}
                  className={`py-2 px-3 rounded-lg text-xs md:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                    region === "india"
                      ? "bg-[#3B6D11] text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <span>🇮🇳</span> India (₹ INR)
                </button>
                <button
                  type="button"
                  onClick={() => setRegion("international")}
                  className={`py-2 px-3 rounded-lg text-xs md:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                    region === "international"
                      ? "bg-[#3B6D11] text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <span>🌍</span> Out of India ($ USD)
                </button>
              </div>
            </div>

            {/* Participant Type Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                2. Select Group Size
              </label>
              <div className="grid grid-cols-2 gap-2 bg-[#FAF8F5] p-1.5 rounded-xl border border-gray-200">
                <button
                  type="button"
                  onClick={() => setParticipantType("individual")}
                  className={`py-2 px-3 rounded-lg text-xs md:text-sm font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                    participantType === "individual"
                      ? "bg-[#3B6D11] text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <User className="w-3.5 h-3.5" /> 1 Participant (1-on-1)
                </button>
                <button
                  type="button"
                  onClick={() => setParticipantType("group_2_5")}
                  className={`py-2 px-3 rounded-lg text-xs md:text-sm font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                    participantType === "group_2_5"
                      ? "bg-[#3B6D11] text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Users className="w-3.5 h-3.5" /> 2–5 Participants (Group)
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Trial Class Banner */}
        <div className="bg-gradient-to-r from-[#27500a] to-[#3B6D11] text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 bg-white/20 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              <Video className="w-3.5 h-3.5" /> Live Zoom Trial Class
            </div>
            <h3 className="text-2xl md:text-3xl font-black">
              Try a 1-on-1 Trial Class for only {symbol}{currentRegionData.trial.amount}
            </h3>
            <p className="text-white/80 text-xs md:text-sm leading-relaxed">
              Experience the personalized guidance of YogSaathi with a live 1-on-1 session before subscribing to a multi-month plan. Attend via Zoom link directly with your dedicated teacher.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3 items-center">
            <div className="text-center md:text-right">
              <div className="text-3xl md:text-4xl font-black">{symbol}{currentRegionData.trial.amount}</div>
              <div className="text-[11px] text-white/70">1 Single Live Class</div>
            </div>
            <button
              onClick={handleRegisterClick}
              className="bg-white hover:bg-[#FAF8F5] text-[#27500a] font-extrabold text-xs md:text-sm py-3 px-6 rounded-xl shadow-lg transition cursor-pointer flex items-center gap-1.5"
            >
              Book Trial Class <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Pricing Cards Comparison Grid */}
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-black text-gray-900">
              {currentGroupData.title} Membership Options
            </h2>
            <p className="text-xs md:text-sm text-gray-500">
              {currentGroupData.subtitle} • 12 classes per month
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {currentGroupData.plans.map((plan, idx) => {
              const fullAmt = `${symbol}${plan.fullPayment.toLocaleString()}`;
              const baseAmt = plan.basePrice ? `${symbol}${plan.basePrice.toLocaleString()}` : null;
              const monthlyTotalAmt = `${symbol}${plan.monthlyOptionTotal.toLocaleString()}`;

              return (
                <div
                  key={idx}
                  className={`bg-white rounded-3xl p-6 border transition-all duration-300 shadow-md flex flex-col justify-between relative ${
                    plan.popular
                      ? "border-[#3B6D11] ring-2 ring-[#3B6D11]/20 shadow-xl scale-102"
                      : "border-gray-200 hover:shadow-lg"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#3B6D11] text-white text-[10px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-sm">
                      Installment Plan
                    </div>
                  )}

                  <div className="space-y-4">
                    {/* Header */}
                    <div className="border-b border-gray-100 pb-4 text-center">
                      <h3 className="text-xl font-black text-gray-900">{plan.duration}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {plan.classesCount} live classes 45 min duration
                      </p>
                    </div>

                    {/* Monthly Installment Box */}
                    <div className="bg-[#FAFDF6] border border-[#a3c97a]/50 rounded-2xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-extrabold text-[#3B6D11] uppercase tracking-wider flex items-center gap-1">
                          <CreditCard className="w-3.5 h-3.5 text-[#3B6D11]" /> Monthly Payment Plan
                        </span>
                        <span className="bg-[#EAF3DE] text-[#3B6D11] text-[10px] font-black px-2.5 py-0.5 rounded-full border border-[#3B6D11]/20">
                          {plan.months} {plan.months === 1 ? "Month" : "Months"}
                        </span>
                      </div>

                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-[#27500a]">{monthlyTotalAmt}</span>
                        <span className="text-gray-500 text-xs font-semibold">total cost</span>
                      </div>

                      {/* Installment breakdown list */}
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                          Installment Breakdown:
                        </span>
                        {plan.installments.map((inst, i) => (
                          <div
                            key={i}
                            className="flex justify-between items-center text-xs py-1.5 px-3 bg-white rounded-xl border border-gray-200/80 shadow-2xs"
                          >
                            <span className="text-gray-600 font-medium">{inst.month}:</span>
                            <strong className="text-gray-900 font-bold">{symbol}{inst.amount.toLocaleString()}</strong>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Features list */}
                    <div className="space-y-2 pt-2 text-xs text-gray-600">
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#3B6D11] shrink-0" />
                        <span className="font-semibold text-gray-800">{plan.classesCount} live classes 45 min duration</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#3B6D11] shrink-0" />
                        <span>Certified & experienced Yoga expert</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#3B6D11] shrink-0" />
                        <span>Customized postures & health adjustments</span>
                      </div>
                    </div>
                  </div>

                  {/* Plan CTA */}
                  <div className="pt-6">
                    <button
                      onClick={() => navigate("/contact")}
                      className={`w-full py-3 px-4 rounded-xl font-bold text-xs md:text-sm transition flex items-center justify-center gap-1.5 cursor-pointer ${
                        plan.popular
                          ? "bg-[#3B6D11] hover:bg-[#2d540d] text-white shadow-md shadow-[#3B6D11]/20"
                          : "bg-[#EAF3DE] hover:bg-[#d4edbc] text-[#27500a]"
                      }`}
                    >
                      Contact Us <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Comprehensive Comparison Table */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-xl space-y-6 overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-xl font-black text-gray-900">
                Detailed Monthly Fee Structure Matrix
              </h3>
              <p className="text-xs text-gray-500">
                Summary of monthly installment schedules and total costs for {currentGroupData.title}
              </p>
            </div>
            <div className="text-xs font-bold text-[#3B6D11] bg-[#EAF3DE] px-3 py-1 rounded-full self-start sm:self-auto">
              12 Classes / Month
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FAFDF6] border-b border-gray-200 text-gray-700">
                  <th className="py-3.5 px-4 font-bold">Plan Duration</th>
                  <th className="py-3.5 px-4 font-bold">Classes Count</th>
                  <th className="py-3.5 px-4 font-bold">Monthly Installment Schedule</th>
                  <th className="py-3.5 px-4 font-bold text-[#27500a]">Total Plan Cost</th>
                  <th className="py-3.5 px-4 font-bold text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {/* Trial Row */}
                <tr className="hover:bg-gray-50/60 transition">
                  <td className="py-3.5 px-4 font-bold text-gray-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span> Trial Class
                  </td>
                  <td className="py-3.5 px-4 text-gray-600">1 Class (Live Zoom)</td>
                  <td className="py-3.5 px-4 text-gray-500">Single payment of {symbol}{currentRegionData.trial.amount}</td>
                  <td className="py-3.5 px-4 font-black text-[#27500a] text-sm">{symbol}{currentRegionData.trial.amount}</td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={handleRegisterClick}
                      className="bg-gray-100 hover:bg-[#3B6D11] hover:text-white text-gray-700 font-bold px-3 py-1.5 rounded-lg transition text-[11px] cursor-pointer"
                    >
                      Book Trial
                    </button>
                  </td>
                </tr>

                {/* Duration Rows */}
                {currentGroupData.plans.map((p, i) => (
                  <tr key={i} className="hover:bg-gray-50/60 transition">
                    <td className="py-3.5 px-4 font-bold text-gray-900 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#3B6D11]"></span> {p.duration}
                    </td>
                    <td className="py-3.5 px-4 text-gray-700 font-medium">{p.classesCount} live classes 45 min duration</td>
                    <td className="py-3.5 px-4 text-gray-600">
                      <div className="space-y-1">
                        {p.installments.map((inst, idx) => (
                          <div key={idx} className="text-[11px] flex items-center gap-1.5">
                            <span className="text-gray-500 font-medium">{inst.month}:</span>
                            <strong className="text-gray-900 font-bold">{symbol}{inst.amount.toLocaleString()}</strong>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-black text-[#27500a] text-sm">
                      {symbol}{p.monthlyOptionTotal.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => navigate("/contact")}
                        className="bg-[#3B6D11] hover:bg-[#2d540d] text-white font-bold px-3.5 py-1.5 rounded-lg transition text-[11px] cursor-pointer"
                      >
                        Contact Us
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Important Notes & Assistance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-3">
            <h4 className="font-extrabold text-sm text-gray-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#3B6D11]" /> Important Guidelines
            </h4>
            <ul className="space-y-2 text-xs text-gray-600 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-[#3B6D11] font-bold">•</span>
                <span>
                  <strong>Trial Session:</strong> You may take a Trial Class and attend it through a Zoom link with the teacher before officially subscribing to a multi-month plan.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#3B6D11] font-bold">•</span>
                <span>
                  <strong>Monthly Installments:</strong> Easy monthly payments distributed across the initial months of your membership tenure.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#3B6D11] font-bold">•</span>
                <span>
                  <strong>Class Schedule:</strong> 12 live 45-minute interactive sessions per month (3 classes every week) with personalized posture adjustment.
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-[#FAFDF6] rounded-2xl p-6 border border-[#a3c97a]/30 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <h4 className="font-extrabold text-sm text-[#27500a] flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#3B6D11]" /> Need Monthly Installment Assistance?
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                If you prefer paying through monthly installments or need customized payment arrangements, our team is ready to guide you step-by-step.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#3B6D11] hover:bg-[#2d540d] text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs transition"
              >
                <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Support
              </a>
              <button
                onClick={handleRegisterClick}
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs transition cursor-pointer"
              >
                Start Registration <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default YogaCarePricing;
