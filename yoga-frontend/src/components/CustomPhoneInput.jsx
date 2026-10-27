import React from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "../pages/CSS/phoneinput.css";

const PhoneInputComponent =
    typeof PhoneInput === "function" ? PhoneInput : PhoneInput.default || PhoneInput;

function CustomPhoneInput({
    value = "",
    onChange,
    placeholder = "Enter phone number",
    disabled = false,
    className = "",
    required = false,
}) {
    const handlePhoneChange = (phone, countryData) => {
        if (!onChange) return;
        if (!phone) {
            onChange("");
            return;
        }
        // Ensure standard E.164-style string with leading '+'
        const formatted = phone.startsWith("+") ? phone : `+${phone}`;
        onChange(formatted);
    };

    return (
        <div className={`custom-phone-input-container w-full relative ${className}`}>
            <PhoneInputComponent
                country="in"
                preferredCountries={["in", "us", "gb", "ae", "ca", "au"]}
                enableSearch={true}
                searchPlaceholder="Search country..."
                searchNotFound="No country found"
                value={value ? (value.startsWith("+") ? value.slice(1) : value) : ""}
                onChange={handlePhoneChange}
                disabled={disabled}
                placeholder={placeholder}
                inputProps={{
                    name: "phoneNumber",
                    required: required,
                    autoComplete: "tel",
                }}
                containerClass="!w-full !font-sans"
                inputClass="!w-full !h-10 !text-xs sm:!text-sm !text-gray-800 !bg-white !border !border-gray-300 !rounded-lg focus:!border-[#3B6D11] focus:!ring-2 focus:!ring-[#3B6D11]/20 !transition-all !pl-[58px]"
                buttonClass="!w-[48px] !bg-gray-50/80 !border-gray-300 !rounded-l-lg hover:!bg-gray-100"
                dropdownClass="!text-xs !shadow-2xl !rounded-xl !border !border-gray-200 !z-50"
            />
        </div>
    );
}

export default CustomPhoneInput;
