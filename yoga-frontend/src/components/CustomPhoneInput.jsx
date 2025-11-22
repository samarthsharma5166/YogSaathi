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
        <div className="flex w-full">
            {/* Country Code Dropdown */}
            <select
                value={countryCode}
                onChange={handleCountryChange}
                className="p-2 border border-gray-300 rounded-l-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400 w-16 sm:w-26"
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
                placeholder={placeholder || "Enter phone number"}
                className="w-full  p-3 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-green-400"
            />
        </div>
    );
}

export default CustomPhoneInput;
