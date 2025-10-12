import React, { useEffect, useState } from "react";
import { getSubscriptionforUser, handleDownloadInvoice } from "../services/api";
import "./CSS/ClassBooking.css";

const DemoBooking = () => {
  const [subscriptionData, setSubscriptionData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function getSubscription() {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user"));
      const res = await getSubscriptionforUser(user.id);
      setSubscriptionData(res.data.user);
    } catch (err) {
      setError("Failed to load subscription data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getSubscription();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'expired':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getDaysRemaining = (startDate,expiryDate) => {
    const today = new Date(startDate);
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) ;
    return diffDays;
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 text-lg font-semibold mb-2">Error</div>
          <div className="text-red-600">{error}</div>
          <button
            onClick={getSubscription}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!subscriptionData || !subscriptionData.subscription.length ===  0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <div className="text-gray-600 text-lg font-semibold mb-2">No Subscription Found</div>
          <div className="text-gray-500">You don't have an active subscription.</div>
        </div>
      </div>
    );
  }

  const { subscription } = subscriptionData;
  const { plan } = subscription;

  // const daysRemaining = getDaysRemaining(subscription.expiresAt);

  return (
    <div className="mx-auto bg-white rounded-xl shadow-sm border border-gray-200 !p-6 !mb-6">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent bg-white rounded-xl shadow-sm border border-gray-200 !p-6 !mb-6">My Subscription</h1>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header Section */}
        {
          subscription.map((subscription)=>{
            const daysRemaining = getDaysRemaining(subscription.startDate,subscription.expiresAt);
            return(
              <div>
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8 text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">{subscription.plan?.name}</h2>
                      <p className="text-blue-100">{subscription.plan?.description}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(subscription.status)}`}>
                      {subscription.status?.toUpperCase()}
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Subscription Details */}
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Subscription Details</h3>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Plan Duration</span>
                          <span className="font-medium">{subscription.plan?.duration} {subscription.plan?.durationType?.toLowerCase()}s</span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Start Date</span>
                          <span className="font-medium">{formatDate(subscription.startDate)}</span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Expires On</span>
                          <span className="font-medium">{formatDate(subscription.expiresAt)}</span>
                        </div>

                        {/* {daysRemaining > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Days Remaining</span>
                            <span className={`font-medium ${daysRemaining <= 7 ? 'text-red-600' : 'text-green-600'}`}>
                              {daysRemaining} days
                            </span>
                          </div>
                        )} */}

                        {subscription.extraDays > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Extra Days</span>
                            <span className="font-medium text-green-600">+{subscription.extraDays} days</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Pricing Details */}
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Pricing Details</h3>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Current Price</span>
                          <span className="font-medium text-lg">{formatCurrency(subscription.plan?.inrPrice)}</span>
                        </div>

                        {subscription.plan?.orignalPriceInInr && subscription.plan?.orignalPriceInInr > subscription.plan?.inrPrice && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Original Price</span>
                            <span className="font-medium text-gray-500 line-through">
                              {formatCurrency(subscription.plan?.orignalPriceInInr)}
                            </span>
                          </div>
                        )}

                        {subscription.plan?.discount && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Discount</span>
                            <span className="font-medium text-green-600">{subscription.plan?.discount}% OFF</span>
                          </div>
                        )}

                        {subscription.plan?.usdPrice && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">USD Price</span>
                            <span className="font-medium">${subscription.plan?.usdPrice}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {daysRemaining > 0 && (
                    <div className="mt-8">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Subscription Progress</span>
                        <span className="text-sm text-gray-500">
                          {Math.max(0, Math.round(((subscription.plan?.duration * 30 - daysRemaining) / (subscription.plan?.duration * 30)) * 100))}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.max(0, Math.round(((subscription.plan?.duration * 30 - daysRemaining) / (subscription.plan?.duration * 30)) * 100))}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="mt-8 flex gap-4">
                    <button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                      Manage Subscription
                    </button>
                    <button onClick={() => handleDownloadInvoice(subscription.invoice)} className="bg-yellow-300 flex-1 border border-gray-300 text-gray-800 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                      Download Invoice
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        }
        
      </div>
    </div>
  );
};

export default DemoBooking;