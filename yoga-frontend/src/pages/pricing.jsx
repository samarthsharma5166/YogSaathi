import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { fetchPlans, getActiveOffer } from "../services/api";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const Pricing = () => {
  const [plans, setPlans] = useState([]);
  const [offer, setOffer] = useState(null);
  const navigate = useNavigate();
  async function getPlans(){
    const res = await fetchPlans();
    setPlans(res.data.plans);
  }

  const fetchActiveOffer = async () => {
    try {
      const response = await getActiveOffer();
        // const response = await axios.get('http://localhost:8000/api/offers/active');
        setOffer(response.data.offer);
    } catch (error) {
        console.error('Error fetching active offer:', error);
    }
  };

  useEffect(()=>{
   getPlans();
   fetchActiveOffer();
  },[]);

  function handleClick(id,currency){
    navigate(`/checkout/${id}?currency=${currency}`);
  }

  return (
    <div className="min-h-screen py-8 px-4 text-white">
      <h2 className="text-2xl font-bold text-center text-green-600 mb-1 mt-3">
        Yog Saathi Packages
      </h2>
      {offer && <p className="text-red-600 animate-pulse font-semibold text-center mb-4">{offer.text}</p>}

      {/* INR Section */}
      <h4 className="text-lg text-gray-600 text-center font-semibold mb-4">INR Pricing</h4>
      <div className="flex flex-row flex-wrap justify-center gap-4 max-w-6xl mx-auto mb-4">
        {plans && plans.length > 0 && plans.map((plan) => (
          !plan.isFreeTrial && <div
            key={plan.name}
            className="bg-white rounded-2xl border border-green-500 shadow-lg hover:scale-105 transition transform p-3 w-80 h-47"
          >
            <h4 className="text-lg font-bold text-green-600">{plan.name}</h4>
            <p className="text-sm text-gray-500">{`${plan.duration} Months`}</p>
            <div className="text-lg font-extrabold text-gray-800">
              ₹{plan.inrPrice}
            </div>
            <p className="text-green-600 font-semibold">{`${plan.discount}% OFF`}</p>
            <p className="text-sm text-gray-500 line-through">
              ₹{plan.orignalPriceInInr}
            </p>
            <Button
            size="small"
              variant="contained"
              color="success"
              fullWidth
              className="!mt-2"
              onClick={()=>handleClick(plan.id, 'INR')}
            >
              Buy Now
            </Button>
          </div>
        ))}
      </div>

      {/* USD Section */}
      <h4 className="text-lg text-gray-600 text-center font-semibold mb-4">USD Pricing</h4>
      <div className="flex flex-row flex-wrap justify-center gap-4 max-w-6xl mx-auto mb-8 ">
        {plans && plans.length > 0 && plans.map((plan) => (
          <div
            key={plan.name}
            className="bg-white rounded-2xl border border-green-500 shadow-lg hover:scale-105 transition transform p-3 w-80 h-35"
          >
            <h4 className="text-lg font-bold text-green-600">{plan.name}</h4>
            <p className="text-sm text-gray-500">{`${plan.duration} Months`}</p>
            <div className="text-lg font-extrabold text-gray-800">
              ${plan.usdPrice}
            </div>
            
            <Button
              size="small"
              variant="contained"
              color="success"
              fullWidth
              className="!mt-2"
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
