import express from "express";
import {
  createYogaCareRegistration,
  verifyYogaCarePayment,
  getYogaCareRegistrations,
  downloadYogaCareRegistrations,
} from "../controllers/yogaCare.controller.js";

const router = express.Router();

router.post("/register", createYogaCareRegistration);
router.post("/verify", verifyYogaCarePayment);
router.get("/registrations", getYogaCareRegistrations);
router.get("/registrations/download", downloadYogaCareRegistrations);

export default router;
