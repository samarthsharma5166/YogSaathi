import React, { useState } from "react";

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

    const handleChange = (e) => {
        const phone = e.target.value;
        setNumber(phone);
        onChange(`${countryCode}${phone}`);
    };

    const handleCountryChange = (e) => {
        setCountryCode(e.target.value);
        onChange(`${e.target.value}${number}`);
    };

    return (
        <div className="flex w-full items-center border border-gray-300 rounded-lg bg-white focus-within:border-[#3B6D11] focus-within:ring-2 focus-within:ring-[#3B6D11]/15 transition-all duration-200 overflow-hidden shadow-sm">
            {/* Country Code Dropdown */}
            <select
                value={countryCode}
                onChange={handleCountryChange}
                className="p-2 h-10 bg-white text-gray-700 focus:outline-none w-20 sm:w-24 text-xs font-semibold border-r border-gray-200 cursor-pointer"
            >
                {countries.map((c) => (
                    <option key={c.code} value={c.code}>
                        {c.name} {c.code}
                    </option>
                ))}
            </select>

            {/* Phone Number Input */}
            <input
                type="tel"
                value={number}
                onChange={handleChange}
                placeholder={placeholder || "Enter Whatsapp number"}
                className="w-full h-10 px-3 bg-transparent focus:outline-none text-gray-800 text-xs placeholder:text-gray-400"
            />
        </div>
    );
}

export default CustomPhoneInput;
