import { Link } from "react-router-dom";
import { ImageWithFallback } from "../components/ ImageWithFallback";


export default function RetreatEvent() {
    return (
        <div className="h-screen w-full overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
            <div className="w-full max-w-7xl h-full max-h-[80vh] bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden flex">
                {/* Left side - Image */}
                <div className="hidden lg:block lg:w-[40%] relative">
                    <ImageWithFallback
                        src="/event.jpeg"
                        alt="Yoga in Rishikesh"
                        className="w-full h-full"
                    />
                    {/* <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/60 via-transparent to-transparent"></div> */}
                    {/* <div className="absolute bottom-8 left-8 right-8 text-white">
                        <div className="text-4xl mb-2">🌿</div>
                        <p className="text-sm opacity-90">Nestled in the Himalayas</p>
                    </div> */}
                </div>

                {/* Right side - Content */}
                <div className="flex-1 flex flex-col h-full">
                    {/* Scrollable content area */}
                    <div className="flex-1 overflow-y-auto px-6 lg:px-10 py-6 space-y-4">
                        {/* Header */}
                        <div className="text-center space-y-2">
                            <h1 className="text-2xl lg:text-3xl text-emerald-800 leading-tight">
                                Where Yoga, Wellness & Hospitality Come Together
                            </h1>
                            <p className="text-base text-gray-700">A 3 Nights / 4 Days Premium Residential Yoga Retreat</p>
                            <p className="text-sm text-gray-600">Rishikesh, Uttarakhand</p>
                            <p className="text-xs text-gray-500">Curated by YogSaathi | Hosted at Panambi Vacations</p>
                            <p className="text-lg text-emerald-700 font-medium">📅 12.03.2026 to 15.03.2026</p>
                        </div>

                        {/* What to Expect */}
                        <div className="bg-emerald-50 rounded-2xl p-4 space-y-2">
                            <h2 className="text-lg text-emerald-900">🧘‍♂️ What to Expect</h2>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-700">
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
                        <div className="bg-amber-50 rounded-2xl p-4 space-y-3">
                            <h2 className="text-lg text-amber-900">😊 PRICING</h2>

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
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className="bg-green-50 rounded-xl p-4 space-y-2">
                                <h3 className="text-sm text-green-900">🎁 What's Included</h3>
                                <p className="text-xs text-gray-700 leading-relaxed">
                                    Accommodation, all group meals, guided Yoga, Pranayama and Meditation sessions, retreat kit,
                                    and special discounts on YogSaathi online programs.
                                </p>
                            </div>

                            <div className="bg-red-50 rounded-xl p-4 space-y-2">
                                <h3 className="text-sm text-red-900">❌ Exclusions</h3>
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
                    <div className="border-t border-gray-200 bg-white p-4 lg:p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                            <button
                                className="w-full bg-emerald-600  text-lg! hover:bg-emerald-700 text-white py-3 px-6 rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl  lg:text-base"
                            >
                                <Link to={"/retreat/registration"}>
                                
                                Register Now / Make Payment
                                </Link>
                            </button>
                            <button
                                type=""
                                onClick={() => window.open('/retreat.pdf', '_blank')}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl text-lg! lg:text-base"
                            >
                                Retreat Brochure
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
