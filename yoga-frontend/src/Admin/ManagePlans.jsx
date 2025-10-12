import React, { useState, useEffect } from "react";
import {
  fetchPlans,
  createPlan,
  updatePlan,
  deletePlan,
  fetchAdminPlans,
} from "../services/api";
import "./CSS/ManageClasses.css";
import Modal from "../components/Modal";
import { Add, Close, Delete, Edit } from "@mui/icons-material";
import { toast } from "react-hot-toast"; // ✅ Toast import


const initialFormState = {
  name: "",
  description: "demo",
  inrPrice: "",
  usdPrice: "",
  orignalPriceInInr: "",
  discount: "",
  duration: "",
  durationType: "DAYS",
  isFreeTrial: "false",
};

const ManagePlans = () => {
  const [form, setForm] = useState(initialFormState);
  const [plans, setPlans] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const res = await fetchAdminPlans();
      setPlans(res.data.plans);
    } catch (err) {
      toast.error("Failed to fetch plans.");
      console.error("Failed to fetch plans", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      inrPrice: parseInt(form.inrPrice),
      usdPrice: parseInt(form.usdPrice),
      orignalPriceInInr: parseInt(form.orignalPriceInInr),
      duration: parseInt(form.duration),
      isFreeTrial: form.isFreeTrial === "true",
      priceType: form.priceType,
      durationType: form.durationType,
    };

    try {
      if (editingId) {
        await updatePlan(editingId, payload);
        toast.success("Plan updated successfully!");
        setEditingId(null);
      } else {
        await createPlan(payload);
        toast.success("Plan created successfully!");
      }
      setForm(initialFormState);
      setOpen(false);
      loadPlans();
    } catch (err) {
      console.log(err)
      toast.error("Failed to save plan.");
      console.error("Error saving plan:", err);
    }
  };

  const handleEdit = (plan) => {
    setForm({
      ...plan,
      isFreeTrial: plan.isFreeTrial ? "true" : "false",
    });
    setEditingId(plan.id);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this plan?")) {
      try {
        await deletePlan(id);
        toast.success("Plan deleted successfully!");
        loadPlans();
      } catch (err) {
        toast.error("Failed to delete plan.");
        console.error("Failed to delete plan", err);
      }
    }
  };

  return (
    <div className="min-h-screen manage-classes-container bg-white rounded-xl shadow-sm border border-gray-200 !p-6 !mb-6">
      <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent bg-white rounded-xl shadow-sm border border-gray-200 !p-6 !mb-6">Manage Plans</h2>

      {/* 📄 Plan Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="border p-4 rounded-md shadow hover:shadow-lg transition relative"
          >
            <div className="absolute bottom-2 right-2 flex gap-2">
              <button onClick={() => handleEdit(plan)}>
                <Edit className="text-blue-600" />
              </button>
              <button onClick={() => handleDelete(plan.id)}>
                <Delete className="text-red-600" />
              </button>
            </div>
            <h3 className="text-xl font-semibold">{plan.name}</h3>
            <p className="text-gray-600">{plan.description}</p>
            <div className="mt-2 text-sm">
              <p>
                ₹ {plan.inrPrice}{" "}
                <span className="line-through text-gray-400">₹{plan.orignalPriceInInr}</span>
              </p>
              <p>
                $ {plan.usdPrice}{" "}
              </p>
              <p>Discount: {plan.discount || "N/A"}%</p>
              <p>Duration: {plan.duration} {plan.durationType === "DAYS" ? "days" : "months"}</p>
              <p>Free Trial: {plan.isFreeTrial ? "Yes" : "No"}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ➕ Modal Form */}
      {open && (
        <Modal>
          <form onSubmit={handleSubmit}>
            <div className="flex justify-between">
              <h3 className="text-2xl font-semibold mb-4">
                {editingId ? "Edit Plan" : "Add Plan"}
              </h3>
              <div
                onClick={() => {
                  setOpen(false);
                  setEditingId(null);
                  setForm(initialFormState);
                }}
              >
                <span className="p-[0.2] rounded-md cursor-pointer text-gray-600 hover:text-gray-800 border block">
                  <Close />
                </span>
              </div>
            </div>

            <input name="name" value={form.name} onChange={handleChange} placeholder="Plan Name..." required className="form-input" />
            <input name="description" value={form.description} onChange={handleChange} placeholder="Description..." className="form-input" />
            <input name="inrPrice" type="number" value={form.inrPrice} onChange={handleChange} placeholder="Price in INR..." required className="form-input" />
            <input name="usdPrice" type="number" value={form.usdPrice} onChange={handleChange} placeholder="Price in USD..." required className="form-input" />
            <input name="orignalPriceInInr" type="number" value={form.orignalPriceInInr} onChange={handleChange} placeholder="Original Price in INR..." required className="form-input" />
            <input name="discount" value={form.discount} onChange={handleChange} placeholder="Discount (e.g. 20)" className="form-input" />
            <input name="duration" type="number" value={form.duration} onChange={handleChange} placeholder="Duration..." required className="form-input" />

            <select name="durationType" value={form.durationType} onChange={handleChange} className="form-input">
              <option value="DAYS">Duration Type - DAYS</option>
              <option value="MONTH">MONTH</option>
            </select>

            {/* <select name="priceType" value={form.priceType} onChange={handleChange} className="form-input">
              <option value="INR">Price Type - INR</option>
              <option value="US">US</option>
            </select> */}

            <select name="isFreeTrial" value={form.isFreeTrial} onChange={handleChange} className="form-input">
              <option value="false">Free Trial? - No</option>
              <option value="true">Yes</option>
            </select>

            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-300 ease-in-out"
            >
              {editingId ? "Update" : "Submit"}
            </button>
          </form>
        </Modal>
      )}

      {/* Floating Add Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-[9888] hover:scale-[1.08] bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-300 ease-in-out"
      >
        <Add />
      </button>
    </div>
  );
};

export default ManagePlans;
