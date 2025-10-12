import express from "express";
import { getReferralStats } from "../controllers/referral.controller.js";

const router = express.Router();

router.get("/stats/:userId", getReferralStats);

export default router;
