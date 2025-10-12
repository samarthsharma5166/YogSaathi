  import React, { useEffect, useState } from 'react'
  import { useNavigate, useParams } from 'react-router-dom';
  import API, { getUserDetails } from '../services/api';
  import toast from 'react-hot-toast';
  import { ArrowBack } from '@mui/icons-material';

  const UserPage = () => {
    // Mock user data based on the provided structure
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function fetchUser() {
      try {
        const res = await getUserDetails(id);
        setUser(res.data.user);
      } catch (error) {
        console.log(error)
        toast.error(error?.response?.data?.message || error?.response?.data?.error || "Failed to fetch user.");
      }
    }

    useEffect(() => {
      fetchUser();
    }, [id])

    const handleEdit = () => {
      alert("Edit functionality to be implemented");
      // Navigate to edit page or open edit modal
    };

    const handleDelete = () => {
      if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
        alert("Delete functionality to be implemented");
        // Implement delete logic
      }
    };

     const handleDownloadInvoice = async (fileName) => {
      const response = await API.get(`/download-invoice/${fileName}`, {
        responseType: "blob", // 🔑 fetch binary
      });
    
      // Create a download link for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName); // force download with same file name
      document.body.appendChild(link);
      link.click();
      link.remove();
    };
    

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    const getStatusColor = (status) => {
      switch (status?.toLowerCase()) {
        case 'active':
          return 'bg-green-100 text-green-800 border-green-200';
        case 'inactive':
          return 'bg-red-100 text-red-800 border-red-200';
        default:
          return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    };

    useEffect(() => {
      // In a real app, you would call fetchUser() here
      // fetchUser();
    }, [])

    if (loading) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4 text-center">Loading user details...</p>
          </div>
        </div>
      );
    }

    if (!user) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">User Not Found</h2>
            <p className="text-gray-600">The requested user could not be loaded.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <button onClick={() => navigate(-1)} className='mb-4 ml-2 text-white w-10 h-10 flex items-center justify-center rounded-full bg-green-800 p-1'>
          <ArrowBack />
        </button>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-green-600 to-green-400 px-6 py-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-green-800 bg-opacity-20 rounded-full p-3">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white">{user.name}</h1>
                    <p className="text-blue-100">{user.email}</p>
                    <div className="flex items-center mt-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(user.subscription?.status)}`}>
                        {user.subscription?.status?.toUpperCase() || 'NO SUBSCRIPTION'}
                      </span>
                    </div>
            
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handleEdit}
                    className="bg-blue-500 bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={handleDelete}
                    className="bg-red-500 bg-opacity-80 hover:bg-opacity-100 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Personal Information */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">User ID</label>
                  <p className="text-gray-900 font-mono text-sm bg-gray-50 p-2 rounded">{user.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Name</label>
                  <p className="text-gray-900 font-semibold">{user.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                  <p className="text-gray-900">{user.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
                  <p className="text-gray-900">{user.phoneNumber}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Role</label>
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {user.role}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Account Created</label>
                  <p className="text-gray-900">{formatDate(user.createdAt)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Last Updated</label>
                  <p className="text-gray-900">{formatDate(user.updatedAt)}</p>
                </div>
              </div>
            </div>

            {/* Referral Information */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a1.5 1.5 0 01-3 0 1.5 1.5 0 013 0z"></path>
                </svg>
                Referral System
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Referral Code</label>
                  <div className="flex items-center bg-gray-50 p-2 rounded">
                    <span className="font-mono text-sm text-gray-900 flex-1">{user.referralCode}</span>
                    <button className="text-blue-600 hover:text-blue-800 ml-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Referral Points</label>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-green-600">{user.referralPoints}</span>
                    <span className="text-sm text-gray-500 ml-2">points</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Total Referrals</label>
                  <span className="text-2xl font-bold text-blue-600">{user.referrals?.length || 0}</span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Referred By</label>
                  <p className="text-gray-900">
                    {user.referredBy ? user.referredBy.name : 'Direct signup'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Subscription Information */}
          {user.subscription &&
           user.subscription.map((subscription) => (
            <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                </svg>
                Subscription Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Subscription ID</label>
                  <p className="text-gray-900 font-mono text-sm bg-gray-50 p-2 rounded break-all">{subscription.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
                  <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(subscription.status)}`}>
                    {subscription.status?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Start Date</label>
                  <p className="text-gray-900">{formatDate(subscription.startDate)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Expires At</label>
                  <p className="text-gray-900">{formatDate(subscription.expiresAt)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Base Duration</label>
                   <p className="text-gray-900">{subscription.baseDuration} {subscription.plan?.durationType}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Extra Days</label>
                  <p className="text-gray-900">{subscription.extraDays} days</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Plan ID</label>
                  <p className="text-gray-900 font-mono text-sm bg-gray-50 p-2 rounded break-all">{subscription.planId}</p>
                </div>
                <div >
                  <label className="block text-sm font-medium text-gray-500 mb-1">Invoice</label>
                  <p className="text-gray-900">{subscription.invoice || 'Not available'}</p>
                  {subscription.invoice &&<button onClick={() => handleDownloadInvoice(subscription.invoice)} className="bg-yellow-300 flex-1 border border-gray-300 text-gray-800 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                                        Download Invoice
                                      </button>}
                </div>
              </div>
            </div>
          ))}

          {/* Security Information */}
          {/* <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
              Security Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Password Hash</label>
                <p className="text-gray-900 font-mono text-sm bg-gray-50 p-2 rounded break-all">{user.password}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">OTP Status</label>
                <div className="flex items-center">
                  {user.otp ? (
                    <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                      </svg>
                      Not Set
                    </span>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">OTP Expiry</label>
                <p className="text-gray-900">{user.otpExpire ? formatDate(user.otpExpire) : 'Not applicable'}</p>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    );
  }

  export default UserPage