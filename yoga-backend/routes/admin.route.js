// 📁 routes/admin.route.js
import express from "express";
import {  getAllUsersAdmin, getAnalytics, getPaidSubscribers, getUserDetails, removeUser } from "../controllers/admin.controller.js";
import { isAuthenticated,isAdmin } from "../middleware/auth.js";
import { createScheduledMessage, deletecheduledMessage, editScheduledMessage, getScheduledMessages } from "../controllers/schedulers.cotroller.js";

const router = express.Router();

// router.get("/stats", getAdminStats);
router.get("/users", isAuthenticated, isAdmin, getAllUsersAdmin);
router.get("/analytics", isAuthenticated, isAdmin, getAnalytics);
router.get("/manageusers", isAuthenticated, isAdmin, getPaidSubscribers);
router.get("/user/:userId", isAuthenticated, isAdmin, getUserDetails);
router.delete("/user/:userId",isAuthenticated, isAdmin, removeUser);

// ===== Message Scheduler Routes =====
router.get("/scheduled/Message",isAuthenticated,isAdmin, getScheduledMessages);
router.post("/scheduled/Message", isAuthenticated, isAdmin, createScheduledMessage);
router.put("/scheduled/Message/:id", isAuthenticated, isAdmin, editScheduledMessage);
router.delete("/scheduled/Message/:id", isAuthenticated, isAdmin, deletecheduledMessage);


export default router;
