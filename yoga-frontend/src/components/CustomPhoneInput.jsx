import React, { useState, useEffect } from "react";

const countries = [
    { code: "+91", name: "🇮🇳" },
    { code: "+1", name: "🇺🇸" },
    { code: "+44", name: "🇬🇧" },
    { code: "+61", name: "🇦🇺" },
    { code: "+971", name: "🇦🇪" },
];

function CustomPhoneInput({ value, onChange, placeholder }) {
    const [countryCode, setCountryCode] = useState("+91");
    const [number, setNumber] = useState("");

    // Sync state if value is passed from outside
    useEffect(() => {
        if (value) {
            const matchedCountry = countries.find((c) => value.startsWith(c.code));
            if (matchedCountry) {
                setCountryCode(matchedCountry.code);
                setNumber(value.slice(matchedCountry.code.length));
            } else if (!value.startsWith("+")) {
                setNumber(value);
            }
        }
    }, [value]);

    const handleChange = (e) => {
        const phone = e.target.value.replace(/\D/g, "");
        setNumber(phone);
        onChange(`${countryCode}${phone}`);
    };

    const handleCountryChange = (e) => {
        const newCode = e.target.value;
        setCountryCode(newCode);
        onChange(`${newCode}${number}`);
    };

    return (
        <div className="flex w-full items-center h-10 border border-gray-300 rounded-lg bg-white focus-within:border-[#3B6D11] focus-within:ring-2 focus-within:ring-[#3B6D11]/20 transition-all duration-200 overflow-hidden shadow-2xs">
            {/* Country Code Dropdown */}
            <div className="relative flex items-center shrink-0 border-r border-gray-200 bg-gray-50/80 h-full">
                <select
                    value={countryCode}
                    onChange={handleCountryChange}
                    aria-label="Select Country Code"
                    className="h-full pl-2.5 pr-5 bg-transparent text-gray-700 focus:outline-none text-xs font-semibold cursor-pointer appearance-none"
                >
                    {countries.map((c) => (
                        <option key={c.code} value={c.code}>
                            {c.name} {c.code}
                        </option>
                    ))}
                </select>
                <div className="absolute right-1.5 pointer-events-none text-gray-400 text-[8px]">
                    ▼
                </div>
            </div>

            {/* Phone Number Input */}
            <input
                type="tel"
                value={number}
                onChange={handleChange}
                maxLength={15}
                placeholder={placeholder || "Enter 10-digit number"}
                className="w-full h-full px-3 bg-transparent focus:outline-none text-gray-800 text-xs sm:text-sm placeholder:text-gray-400"
            />
        </div>
    );
}

export default CustomPhoneInput;
