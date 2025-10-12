import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const contactItems = [
  {
    icon: <Phone className="text-green-600 w-6 h-6" />,
    label: "Phone:",
    value: "9910433340",
    link: "tel:9910433340",
  },
  {
    icon: <Mail className="text-green-600 w-6 h-6" />,
    label: "Email:",
    value: "healthy.horizons111@gmail.com",
    link: "https://mail.google.com/mail/?view=cm&fs=1&to=healthy.horizons111@gmail.com",
  },
  {
    icon: <MapPin className="text-green-600 w-6 h-6" />,
    label: "Address:",
    value: "Yog Saathi, M/s Healthy Horizons Pvt. Ltd., Noida",
  },
];

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-green-50 flex items-center justify-center px-4 py-10">
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="backdrop-blur-lg bg-white/70 border border-green-100 shadow-2xl rounded-3xl px-6 sm:px-10 py-10 w-full max-w-2xl"
      >
        <h2 className="text-4xl font-extrabold text-center text-green-700 mb-10 tracking-tight">
          Contact Us
        </h2>

        <ul className="space-y-6 text-gray-800">
          {contactItems.map((item, index) => (
            <motion.li
              key={index}
              className="flex items-start gap-4 hover:bg-green-100/50 p-4 rounded-xl transition-all duration-300"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              {item.icon}
              <span className="text-lg leading-snug">
                <strong>{item.label}</strong>{" "}
                {item.link ? (
                  <a
                    href={item.link}
                    className="text-green-700 hover:underline break-all"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.value}
                  </a>
                ) : (
                  item.value
                )}
              </span>
            </motion.li>
          ))}
        </ul>
      </motion.section>
    </div>
  );
};

export default Contact;
