import React, { useState } from "react";
import { bookClass } from "../services/api";
import "./CSS/ClassBooking.css"; // Optional: your styles

const ClassBooking = () => {
  const [form, setForm] = useState({
    user_id: JSON.parse(localStorage.getItem("user"))?.id || "",
    class_id: "", // assuming you have a class ID
    name: "",
    email: "",
    phone: "",
    preferred_date: "",
    preferred_time: "",
    notes: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await bookClass(form);
      alert("✅ Class booked successfully!");
      setForm({
        ...form,
        class_id: "",
        name: "",
        email: "",
        phone: "",
        preferred_date: "",
        preferred_time: "",
        notes: "",
      });
    } catch (error) {
      console.error("❌ Booking failed:", error.message);
      alert("❌ Booking failed. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="class-booking-form">
      <input
        type="text"
        name="class_id"
        value={form.class_id}
        onChange={handleChange}
        placeholder="Class ID"
        required
      />
      <input
        type="text"
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Name"
        required
      />
      <input
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        required
      />
      <input
        type="tel"
        name="phone"
        value={form.phone}
        onChange={handleChange}
        placeholder="Phone"
        required
      />
      <input
        type="date"
        name="preferred_date"
        value={form.preferred_date}
        onChange={handleChange}
        required
      />
      <input
        type="time"
        name="preferred_time"
        value={form.preferred_time}
        onChange={handleChange}
        required
      />
      <textarea
        name="notes"
        value={form.notes}
        onChange={handleChange}
        placeholder="Any Notes (optional)"
      />
      <button type="submit">Book Class</button>
    </form>
  );
};

export default ClassBooking;
