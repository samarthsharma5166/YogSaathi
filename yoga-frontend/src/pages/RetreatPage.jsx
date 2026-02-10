import React, { useState } from "react";
import axios from "axios";
import { User, Mail, Phone, MapPin, Shirt, Check, ChevronRight, Sparkles, Bed, Users } from "lucide-react";
import { useRef } from "react";

const RetreatPage = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "MALE",
    age: "",
    mobileNumber: "",
    email: "",
    city: "",
    tShirtSize: "M",
    plan: "TWIN_SHARING_SUPERIOR",
  });
  const [errors, setErrors] = useState({});
  const eventRegistrationId = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleNextStep = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = "Full name is required";
    if (!formData.age) {
      newErrors.age = "Age is required";
    } else if (formData.age <= 10) {
      newErrors.age = "Age must be greater than 10";
    }
    if (!formData.mobileNumber) {
      newErrors.mobileNumber = "Mobile number is required";
    }
    else if(formData.mobileNumber.length<10){
      newErrors.mobileNumber = "Mobile number must be of 10 digits";
    }
    else if (!/^\d+$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = "Mobile number must be a number";
    }
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.city) newErrors.city = "City is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
      setStep(2);
    }
  };

  const handleBackStep = () => {
    setStep(1);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/event/register`,
        formData
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
                eventRegistrationId:eventRegistrationId.current,
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
          name: formData.fullName,
          email: formData.email,
          contact: formData.mobileNumber,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp1 = new Razorpay(options);

      rzp1.on("payment.failed", function (response) {
        alert(response.error.code);
        alert(response.error.description);
        alert(response.error.source);
        alert(response.error.step);
        alert(response.error.reason);
        alert(response.error.metadata.order_id);
        alert(response.error.metadata.payment_id);
        setLoading(false)
      });

      rzp1.open();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
      setLoading(false);
    }
  };

  const plans = [
    {
      id: "TWIN_SHARING_SUPERIOR",
      title: "Twin Sharing – Superior/ Premiere Room",
      price: "₹16,000",
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
      price: "₹22,000",
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
      price: "₹28,000",
      icon: Sparkles,
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
      price: "₹48,000",
      icon: Sparkles,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Hero Section */}
      <div className="relative h-[400px] bg-cover bg-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1731171060382-0ed37122ad60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwbWVkaXRhdGlvbiUyMG5hdHVyZSUyMHJpc2hpa2VzaHxlbnwxfHx8fDE3NzA0NTI2OTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/80 to-teal-900/70" />
        <div className="relative h-full flex flex-col items-center justify-center text-white px-4">
          <h1 className="text-5xl md:text-6xl mb-4 text-center">
            YogSaathi Rishikesh Retreat
          </h1>
          <p className="text-xl md:text-2xl text-center text-emerald-100 max-w-2xl">
            Transform your mind, body, and soul in the yoga capital of the world
          </p>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${step === 1
                  ? "bg-emerald-600 text-white"
                  : "bg-emerald-500 text-white"
                }`}
            >
              {step > 1 ? <Check className="w-5 h-5" /> : "1"}
            </div>
            <span className="ml-2 hidden sm:inline">Your Details</span>
          </div>
          <div className="w-16 h-0.5 bg-emerald-200">
            <div
              className={`h-full bg-emerald-600 transition-all duration-500 ${step > 1 ? "w-full" : "w-0"
                }`}
            />
          </div>
          <div className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${step === 2
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-200 text-gray-600"
                }`}
            >
              2
            </div>
            <span className="ml-2 hidden sm:inline">Select Plan</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        {step === 1 &&
         (
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6">
              <h2 className="text-3xl mb-2">Step 1: Your Details</h2>
              <p className="text-emerald-50">
                Please provide your information to complete the registration
              </p>
            </div>
            <div className="p-8">
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label htmlFor="fullName" className="flex items-center gap-2 text-gray-700">
                      <User className="w-4 h-4 text-emerald-600" />
                      <span>Full Name</span>
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    />
                    {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
                  </div>

                  {/* Gender */}
                  <div className="space-y-2">
                    <label htmlFor="gender" className="block text-gray-700">
                      Gender
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white"
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                    </select>
                  </div>

                  {/* Age */}
                  <div className="space-y-2">
                    <label htmlFor="age" className="block text-gray-700">
                      Age (Years)
                    </label>
                    <input
                      id="age"
                      name="age"
                      type="number"
                      placeholder="Enter your age"
                      value={formData.age}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    />
                    {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
                  </div>

                  {/* Mobile Number */}
                  <div className="space-y-2">
                    <label htmlFor="mobileNumber" className="flex items-center gap-2 text-gray-700">
                      <Phone className="w-4 h-4 text-emerald-600" />
                      <span>Mobile Number</span>
                    </label>
                    <input
                      id="mobileNumber"
                      name="mobileNumber"
                      type="tel"
                      placeholder="Enter your mobile number"
                      value={formData.mobileNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    />
                    {errors.mobileNumber && <p className="text-red-500 text-sm">{errors.mobileNumber}</p>}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="flex items-center gap-2 text-gray-700">
                      <Mail className="w-4 h-4 text-emerald-600" />
                      <span>E-mail Address</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                  </div>

                  {/* City */}
                  <div className="space-y-2">
                    <label htmlFor="city" className="flex items-center gap-2 text-gray-700">
                      <MapPin className="w-4 h-4 text-emerald-600" />
                      <span>City of Stay</span>
                    </label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      placeholder="Enter your city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    />
                    {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
                  </div>

                  {/* T-Shirt Size */}
                  <div className="space-y-2">
                    <label htmlFor="tShirtSize" className="flex items-center gap-2 text-gray-700">
                      <Shirt className="w-4 h-4 text-emerald-600" />
                      <span>T-Shirt Size</span>
                    </label>
                    <select
                      id="tShirtSize"
                      name="tShirtSize"
                      value={formData.tShirtSize}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white"
                    >
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                      <option value="XXL">XXL</option>
                    </select>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg text-lg flex items-center gap-2 transition-all shadow-lg hover:shadow-xl"
                  >
                    Next Step
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-4xl mb-2">Choose Your Perfect Retreat Plan</h2>
              <p className="text-gray-600 text-lg">Select the accommodation that suits you best</p>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {plans.map((plan) => {
                  const Icon = plan.icon;
                  const isSelected = formData.plan === plan.id;
                  return (
                    <label
                      key={plan.id}
                      htmlFor={plan.id}
                      className={`cursor-pointer transition-all ${isSelected ? "scale-[1.02]" : "hover:scale-[1.01]"
                        }`}
                    >
                      <div
                        className={`relative bg-white rounded-lg overflow-hidden transition-all ${isSelected
                            ? "border-2 border-emerald-500 shadow-2xl"
                            : "border border-gray-200 hover:border-emerald-300 shadow-lg"
                          }`}
                      >
                        {plan.popular && (
                          <div className="absolute top-4 right-4">
                            <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm">
                              Most Popular
                            </span>
                          </div>
                        )}
                        <div
                          className={`p-6 ${isSelected
                              ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                              : "bg-gradient-to-r from-gray-50 to-gray-100"
                            }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <Icon className={`w-6 h-6 ${isSelected ? "text-white" : "text-emerald-600"}`} />
                                <h3 className="text-xl">{plan.title}</h3>
                              </div>
                              <div className="flex items-baseline gap-2">
                                <span className="text-4xl">{plan.price}</span>
                                <span className={`text-sm ${isSelected ? "text-emerald-100" : "text-gray-500"}`}>
                                  / person
                                </span>
                              </div>
                            </div>
                            <input
                              type="radio"
                              id={plan.id}
                              name="plan"
                              value={plan.id}
                              checked={isSelected}
                              onChange={handleInputChange}
                              className="mt-2 w-5 h-5 text-emerald-600 focus:ring-2 focus:ring-emerald-500"
                            />
                          </div>
                        </div>
                        <div className="p-6">
                          <ul className="space-y-3">
                            {plan.features.map((feature, index) => (
                              <li key={index} className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-700">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>

              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={handleBackStep}
                  className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-8 py-4 rounded-lg text-lg transition-all"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-4 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span className="ml-2">Processing...</span>
                    </div>
                  ) : (
                    <>
                      Pay Now
                      <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
      <h1 className="w-5xl mx-auto text-red-500 font-bold text-lg">Declaration</h1>
        <p className="w-5xl mx-auto text-sm mb-10 text-green-500">Declaration I hereby declare that the information provided above is true and correct to the best of my knowledge. I confirm that I am participating in the YogSaathi × Panambi Yoga Retreat voluntarily and understand that yoga involves physical activity. I take full responsibility for my health and well-being during the retreat and shall not hold the organizers, instructors, or the resort responsible for any injury, loss, or discomfort arising during the program.ˀ</p>
    </div>
  );
};

export default RetreatPage;
