import express from "express";
import {
  getDieticianConfig,
  updateDieticianConfig,
  createRegistration,
  verifyPayment,
  getRegistrations,
} from "../controllers/dietician.controller.js";

const router = express.Router();

router.get("/config", getDieticianConfig);
router.post("/config", updateDieticianConfig);
router.post("/register", createRegistration);
router.post("/verify", verifyPayment);
router.get("/registrations", getRegistrations);

export default router;
