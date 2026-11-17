import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";

const WhatsAppButton = () => {
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);

  // Only show the floating WhatsApp button on the home screen ("/")
  if (location.pathname !== "/") {
    return null;
  }

  const phoneNumber = "919971714091";
  const defaultMessage = "Hello YogSaathi, I would like to know more about your yoga classes and programs.";
  
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <div className="fixed bottom-6 left-6 z-[9999] flex items-center group">
      {/* WhatsApp Floating Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full shadow-[0_4px_20px_rgba(37,211,102,0.4)] hover:shadow-[0_6px_25px_rgba(37,211,102,0.6)] transform hover:scale-110 active:scale-95 transition-all duration-300 ease-out cursor-pointer"
      >
        {/* Pulsing radar animation rings */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-30 animate-ping -z-10" />
        <span className="absolute -inset-2 rounded-full bg-[#25D366]/20 animate-pulse -z-10" />

        {/* WhatsApp Icon */}
        <FaWhatsapp className="w-8 h-8 text-white drop-shadow-sm" />
      </a>

      {/* Tooltip text badge */}
      <div
        className={`hidden sm:flex items-center ml-3 px-3.5 py-1.5 bg-white text-gray-800 text-xs font-semibold rounded-full shadow-lg border border-gray-100 transition-all duration-300 transform ${
          isHovered
            ? "opacity-100 translate-x-0 pointer-events-auto"
            : "opacity-0 -translate-x-2 pointer-events-none"
        }`}
      >
        <div className="w-2 h-2 bg-white transform rotate-45 absolute -left-1 border-b border-l border-gray-100" />
        <span>Chat with us on WhatsApp</span>
      </div>
    </div>
  );
};

export default WhatsAppButton;
