import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { fetchPlans } from "../services/api";
import { useNavigate } from 'react-router-dom';


const Pricing = () => {
  const [plans, setPlans] = useState([]);
  const navigate = useNavigate();
  async function getPlans(){
    const res = await fetchPlans();
    setPlans(res.data.plans);
  }

  useEffect(()=>{
   getPlans();
  },[]);

  function handleClick(id,currency){
    // const token = localStorage.getItem("token");
    // const user = localStorage.getItem("user")
    // if (token && user && id){
    //   navigate(`/checkout/${id}`);
    // }else{
    //   navigate("/auth/login");
    // }
    navigate(`/checkout/${id}?currency=${currency}`);

  }

  return (
    <div className="min-h-screen py-14 px-4 text-white">
      <h2 className="text-3xl font-bold text-center text-green-600 mb-5">
        Yog Saathi Packages
      </h2>
      <p className="text-red-600 animate-bounce text-center mb-10">Special Diwali Offer - One Month Extra In Each Subscription Plan (valid till 23-Oct-25).</p>

      {/* INR Section */}
      <h3 className="text-2xl text-center font-semibold mb-6">INR Pricing</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-14">
        {plans && plans.length > 0 && plans.map((plan) => (
          !plan.isFreeTrial && <div
            key={plan.name}
            className="bg-white rounded-2xl border border-green-500 shadow-lg hover:scale-105 transition transform p-6 space-y-4"
          >
            <h4 className="text-xl font-bold text-green-600">{plan.name}</h4>
            <p className="text-lg text-gray-500">{`${plan.duration} Months`}</p>
            <div className="text-3xl font-extrabold text-gray-800">
              ₹{plan.inrPrice}
            </div>
            <p className="text-green-600 font-semibold">{`${plan.discount}% OFF`}</p>
            <p className="text-lg text-gray-500 line-through">
              ₹{plan.orignalPriceInInr}
            </p>
            <Button
              variant="contained"
              color="success"
              fullWidth
              className="!mt-4"
              onClick={()=>handleClick(plan.id, 'INR')}
            >
              Buy Now
            </Button>
          </div>
        ))}
      </div>

      {/* USD Section */}
      <h3 className="text-2xl text-center font-semibold mb-6">USD Pricing</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {plans && plans.length > 0 && plans.map((plan) => (
          <div
            key={plan.name}
            className="bg-white rounded-2xl border border-green-500 shadow-lg hover:scale-105 transition transform p-6 space-y-4"
          >
            <h4 className="text-xl font-bold text-green-600">{plan.name}</h4>
            <p className="text-lg text-gray-500">{`${plan.duration} Months`}</p>
            <div className="text-3xl font-extrabold text-gray-800">
              ${plan.usdPrice}
            </div>
            
            <Button
              variant="contained"
              color="success"
              fullWidth
              className="!mt-4"
              onClick={() => handleClick(plan.id,'USD')}
            >
              Buy Now
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
