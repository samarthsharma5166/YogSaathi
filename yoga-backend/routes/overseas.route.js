import express from "express";
import { createOverseasInquiry, getOverseasInquiries } from "../controllers/overseas.controller.js";
import { isAuthenticated, isAdmin } from "../middleware/auth.js";

const router = express.Router();

// Public route to submit an overseas program inquiry
router.post("/inquiry", createOverseasInquiry);

// Admin-only route to fetch all inquiries
router.get("/inquiries", isAuthenticated, isAdmin, getOverseasInquiries);

export default router;
