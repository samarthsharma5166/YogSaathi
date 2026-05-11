import { Link } from "react-router-dom";
import { ImageWithFallback } from "../components/ ImageWithFallback";
import { FaWhatsapp } from "react-icons/fa";

export default function RetreatEvent() {
    const handleClick = () => {
        const phoneNumber = "919971714091"; // country code + number
        const message = "Hi, I want to know more about your retreat event.";
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank");
    };
    return (
        <div className="h-[100dvh] w-full overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-3 sm:p-4 md:p-6">
            <div className="w-full max-w-7xl h-full max-h-[95vh] md:max-h-[90vh] lg:max-h-[85vh] bg-white/95 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
                {/* Left side - Image */}
                <div className="w-full h-48 sm:h-64 lg:h-auto lg:w-[40%] shrink-0 relative">
                    <ImageWithFallback
                        src="/events.jpeg"
                        alt="Yoga in Rishikesh"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Right side - Content */}
                <div className="flex-1 flex flex-col h-full min-h-0">
                    {/* Scrollable content area */}
                    <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-10 py-4 sm:py-6 space-y-4 sm:space-y-6">
                        {/* Header */}
                        <div className="text-center space-y-1.5 sm:space-y-2">
                            <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-emerald-800 leading-tight">
                                Where Yoga, Wellness & Hospitality Come Together
                            </h1>
                            <p className="text-sm sm:text-base text-gray-700">A 3 Nights / 4 Days Premium Residential Yoga Retreat</p>
                            <p className="text-xs sm:text-sm text-gray-600">Rishikesh, Uttarakhand</p>
                            <p className="text-[10px] sm:text-xs text-gray-500">Curated by YogSaathi | Hosted at Panambi Resort & Spa</p>
                            <p className="text-base sm:text-lg text-emerald-700 font-medium mt-1">📅 21-May-2026 to 24-May-2026</p>
                        </div>

                        {/* What to Expect */}
                        <div className="bg-emerald-50 rounded-2xl p-4 sm:p-5 space-y-2 sm:space-y-3">
                            <h2 className="text-base sm:text-lg font-medium text-emerald-900">🧘‍♂️ What to Expect</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs sm:text-sm text-gray-700">
                                <p className="flex items-start gap-2"><span className="text-emerald-600 mt-0.5">✔</span> Structured Yoga & Meditation</p>
                                <p className="flex items-start gap-2"><span className="text-emerald-600 mt-0.5">✔</span> Surya Namaskar & Conscious Breathwork</p>
                                <p className="flex items-start gap-2"><span className="text-emerald-600 mt-0.5">✔</span> Full-Body Mobility & Core Strengthening</p>
                                <p className="flex items-start gap-2"><span className="text-emerald-600 mt-0.5">✔</span> Guided Relaxation & Mindfulness Practices</p>
                                <p className="flex items-start gap-2"><span className="text-emerald-600 mt-0.5">✔</span> Nourishing Vegetarian Group Meals</p>
                                <p className="flex items-start gap-2"><span className="text-emerald-600 mt-0.5">✔</span> Calm, Luxury Resort Living in Rishikesh</p>
                            </div>
                            <p className="text-xs text-gray-600 italic pt-1">
                                Designed for modern seekers looking to reconnect—with the body, the breath, and the self.
                            </p>
                        </div>

                        {/* Pricing */}
                        <div className="bg-amber-50 rounded-2xl p-4 sm:p-5 space-y-3">
                            <h2 className="text-base sm:text-lg font-medium text-amber-900">😊 PRICING</h2>

                            <div className="space-y-2">
                                <div className="bg-white rounded-xl p-3">
                                    <p className="text-sm text-gray-800 mb-2">🏷️ Superior / Premiere Room</p>
                                    <div className="text-xs text-gray-700 space-y-1 ml-4">
                                        <p>• Twin Sharing: <span className="font-medium">₹16,000 per person</span></p>
                                        <p>• Single Occupancy: <span className="font-medium">₹22,000 per person</span></p>
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl p-3">
                                    <p className="text-sm text-gray-800 mb-2">🏷️ Jacuzzi Room</p>
                                    <div className="text-xs text-gray-700 space-y-1 ml-4">
                                        <p>• Twin Sharing: <span className="font-medium">₹28,000 per person</span></p>
                                        <p>• Single Occupancy: <span className="font-medium">₹48,000 per person</span></p>
                                    </div>
                                </div>
                            </div>

                            <p className="text-xs text-gray-600 italic text-center pt-1">
                                (Prices are inclusive of all applicable taxes)
                            </p>
                        </div>

                        {/* Inclusions & Exclusions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                            <div className="bg-green-50 rounded-xl p-3 sm:p-4 space-y-1.5 sm:space-y-2">
                                <h3 className="text-sm font-medium text-green-900">🎁 What's Included</h3>
                                <p className="text-xs text-gray-700 leading-relaxed">
                                    Accommodation, all group meals, guided Yoga, Pranayama and Meditation sessions, retreat kit,
                                    and special discounts on YogSaathi online programs.
                                </p>
                            </div>

                            <div className="bg-red-50 rounded-xl p-3 sm:p-4 space-y-1.5 sm:space-y-2">
                                <h3 className="text-sm font-medium text-red-900">❌ Exclusions</h3>
                                <p className="text-xs text-gray-700 leading-relaxed">
                                    Travel to/from Rishikesh, meals apart from group meals, room service charges, and personal expenses.
                                </p>
                            </div>
                        </div>

                        {/* Overseas Note */}
                        <div className="bg-blue-50 rounded-xl p-3 text-center">
                            <p className="text-xs text-gray-700">
                                🌍 Overseas participants may write to us at{' '}
                                <a href="mailto:yogsaathi.26@gmail.com" className="text-blue-600 hover:underline">
                                    📧 yogsaathi.26@gmail.com
                                </a>
                            </p>
                        </div>
                    </div>

                    {/* Fixed Bottom Buttons */}
                    <div className="border-t border-gray-200 bg-white p-3 sm:p-4 lg:p-6 shrink-0">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                            <Link
                                to="/retreat/registration"
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl text-center text-sm sm:text-base md:text-lg font-medium flex items-center justify-center"
                            >
                                Register Now / Make Payment
                            </Link>
                            {/* <button
                                type="button"
                                onClick={() => window.open('/retreat.pdf', '_blank')}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base md:text-lg font-medium flex items-center justify-center"
                            >
                                Retreat Brochure
                            </button> */}
                            <button
                                type="button"
                                onClick={handleClick}
                                className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base md:text-lg font-medium flex items-center justify-center gap-2"
                            >
                                <FaWhatsapp className="size-5 sm:size-6"/> WhatsApp
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
