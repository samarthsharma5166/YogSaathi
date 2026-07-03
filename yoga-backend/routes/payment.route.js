import express from "express";
import { getAllPayments } from "../controllers/payments.controllers.js";
import { handleRazorpayWebhook } from "../controllers/webhook.controller.js";
import { isAdmin, isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.get("/", isAuthenticated, isAdmin, getAllPayments);
router.post("/webhook", handleRazorpayWebhook);

export default router;