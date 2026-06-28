import axios from "axios";
import toast from "react-hot-toast";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, // ✅ Backend base URL
});

// ✅ Automatically attach token from localStorage to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ===============================
// ✅ AUTH APIs
// ===============================
export const registerUser = (data) => API.post("/auth/register", data);
// export const loginUser = (data) => API.post("/auth/login", data);
export const sentOtp = (data) => API.post("/auth/send-otp", data);
export const verifyOtp = (data) => API.post("/auth/verify-otp", data);


// ===============================
// ✅ BLOG APIs
// ===============================
export const createBlog = (data) => API.post("/blogs/create", data);
export const getAllBlogs = () => API.get("/blogs/all");
export const updateBlog = (id, data) => API.put(`/blogs/${id}`, data);
export const deleteBlog = (id) => API.delete(`/blogs/${id}`);
export const getBlogById = (id) => API.get(`/blogs/${id}`);

// ===============================
// ✅ REFERRAL APIs (if needed)
// ===============================
// export const getReferralLink = (userId) => API.get(`/referrals/link/${userId}`);
// export const getReferralStats = (userId) => API.get(`/referrals/stats/${userId}`);

// ===============================
// ✅ USER PAYMENTS
// ===============================
export const getUserPayments = (userId) => API.get(`/payments/user/${userId}`);

// ===============================
// ✅ MANAGE USERS APIs (Admin)
// ===============================

export const getAllUsers = () => API.get("/admin/manageusers");
export const createUser = (data) => API.post("/manageusers", data);
export const deleteUserById = (id) => API.delete(`/manageusers/${id}`);
export const updateUserById = (id, data) => API.put(`/manageusers/${id}`, data);
export const toggleUserStatus = (id, status) =>
  API.patch(`/manageusers/${id}/status`, { status });

// ===============================
// ✅ MANAGE CLASSES APIs (Admin)
// ===============================
// export const fetchClasses = () => API.get("/classes");
// export const createClass = (data) => API.post("/classes", data);
// export const updateClass = (id, data) => API.put(`/classes/${id}`, data);
// export const deleteClass = (id) => API.delete(`/classes/${id}`);

// ===============================
// ✅ BOOKINGS (User Panel)
// ===============================
export const bookClass = (data) => API.post("/bookings/class", data);
export const bookDemo = (data) => API.post("/bookings/demo", data);

export const getUserBookingHistory = (userId) =>
  API.get(`/bookings/user/${userId}`);
export const getAdminStats = () => API.get("/admin/analytics");

// ============= Get All Users =================
export const getAllUsersFromDb = (usertype, startDate, endDate) => {
  let url = `/admin/users/?usertype=${usertype}`;
  if (startDate && endDate) {
    url += `&startDate=${startDate}&endDate=${endDate}`;
  }
  return API.get(url);
}
export const downloadAttendance = (usertype, startDate, endDate) => {
  let url = `/admin/attendance?usertype=${usertype}`;
  if (startDate && endDate) {
    url += `&startDate=${startDate}&endDate=${endDate}`;
  }
  return API.get(url, {
    responseType: "blob",
  });
};
export const getUserDetails = (id) => API.get(`/admin/user/${id}`);



// ================================
//  Refferal APIs
// ================================
export const RefferalStats = (userId) => API.get(`/referrals/stats/${userId}`)
export const getRefferedUsers = (refferal_code) => API.get(`/referrals/${refferal_code}`)


//===================
// plans
//===================
export const fetchPlans = () => API.get("/plans");
export const createPlan = (data) => API.post("/plans", data);
export const updatePlan = (id, data) => API.put(`/plans/${id}`, data);
export const deletePlan = (id) => API.delete(`/plans/${id}`);
export const getPlanById = (id) => API.get(`/plans/${id}`);
export const fetchAdminPlans = () => API.get("/admin/plans");



// order

export const createOrder = (data) => API.post("/create-order", data);
export const getSubscriptionforUser = (id) => API.get(`/user/subscription/${id}`);
export const getPayment = (page, limit, search) => API.get(`/payment?page=${page}&limit=${limit}&search=${search}`)
export const verifyPayment = (data) => API.post("/verify-payment", data);


export const deleteUser = async (id) => {
  const res = API.delete("/admin/user/" + id);
  toast.promise(res, {
    loading: "Deleting user...",
    success: "User deleted successfully!",
    error: "Delete failed!",
  });
  return (await res).data;
}

export const handleDownloadInvoice = async (fileName) => {
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


// schedule
export const getAllScheduledMessages = async () => {
  const res = await API.get("/admin/scheduled/Message");
  return res.data;
}

export const createScheduledMessage = async (data) => {
  const res = await API.post("/admin/scheduled/Message", data);
  return res.data;
}

export const editScheduledMessage = async (id, data) => {
  const res = await API.put(`/admin/scheduled/Message/${id}`, data);
  return res.data;
}

export const deleteScheduledMessage = async (id) => {
  const res = await API.delete(`/admin/scheduled/Message/${id}`);
  return res.data;
}


// ===============================
// ✅ MANAGE CLASSES APIs (Admin)
// ===============================

export const fetchClassesFromDb = () => API.get("/yogaClasses/");
export const createClass = (data) => API.post("/yogaClasses/", data);
export const getYogaClassById = (id) => API.get(`/yogaClasses/${id}`);
export const updateClass = (id, data) => API.put(`/yogaClasses/${id}`, data);
export const deleteClass = (id) => API.delete(`/yogaClasses/${id}`);
export const getClassesfromDb = () => API.get(`/yogaClasses/list`)
export const getClassLink = (code) => API.get(`/yogaClasses/join/${code}`)


// ===============================
// ✅ MANAGE CAMPIIGN APIs (Admin)
// ===============================

export const fetchCampaignsFromDb = () => API.get("/campaigns/");
export const createCampaign = (data) => API.post("/campaigns/", data);
export const getCampaignById = (id) => API.get(`/campaigns/${id}`);
export const updateCampaign = (id, data) => API.put(`/campaigns/${id}`, data);
export const deleteCampaign = (id) => API.delete(`/campaigns/${id}`);
export const updateStatus = (id, data) => API.put(`/campaigns/updateStatus/${id}`, data);

// ✅ Export main API instance


// ===============================
// ✅ MANAGE COMMON LINK APIs (Admin)
// ===============================
export const createOrUpdateCommonLink = (data) => API.post("/common-link", data);
export const getCommonLink = () => API.get("/common-link");


// ===============================
// ✅ MANAGE OFFERS  APIs (Admin)
// ===============================
export const getAllOffers = () => API.get("/offers/all");
export const updateOffer = (editorId, offer) => API.put(`/offers/${editorId}`, offer);
export const deleteOffer = (editorId) => API.delete(`/offers/${editorId}`);
export const createOffer = (offer) => API.post("/offers", offer);
export const getActiveOffer = () => API.get("/offers/active");


export const getRetreatUsers = () => API.get("/event/retreat-users");

export const downloadRetreatUsers = () =>
  API.get("/event/retreat-users/download", {
    responseType: "blob",
  });

// ===============================
// ✅ OVERSEAS INQUIRIES APIs
// ===============================
export const createOverseasInquiry = (data) => API.post("/overseas/inquiry", data);
export const getOverseasInquiries = () => API.get("/overseas/inquiries");

// ===============================
// ✅ DIETICIAN SESSION APIs
// ===============================
export const getDieticianConfig = () => API.get("/dietician/config");
export const updateDieticianConfig = (data) => API.post("/dietician/config", data);
export const createDieticianRegistration = (data) => API.post("/dietician/register", data);
export const verifyDieticianPayment = (data) => API.post("/dietician/verify", data);
export const getDieticianRegistrations = () => API.get("/dietician/registrations");
export const downloadDieticianRegistrations = () =>
  API.get("/dietician/registrations/download", {
    responseType: "blob",
  });

export default API;
