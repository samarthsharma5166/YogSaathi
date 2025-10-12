// routes/auth.route.js
import express from "express";
import { register, sendOTP, verifyOTP } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
// router.post("/login", login);

// send otp route 
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);

export default router;