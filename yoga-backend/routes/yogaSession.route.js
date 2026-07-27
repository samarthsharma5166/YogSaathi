import express from "express";
import multer from "multer";
import {
  getYogaSessionConfig,
  updateYogaSessionConfig,
  createRegistration,
  verifyPayment,
  getRegistrations,
  downloadRegistrations,
  validatePromoCode,
} from "../controllers/yogaSession.controller.js";
import {
  getYogaSessionLeads,
  uploadYogaSessionLeads,
  clearYogaSessionLeads,
  deleteYogaSessionLead,
} from "../controllers/yogaSessionLead.controller.js";

const router = express.Router();

const uploadLeads = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.get("/config", getYogaSessionConfig);
router.post("/config", updateYogaSessionConfig);
router.post("/register", createRegistration);
router.post("/verify", verifyPayment);
router.get("/registrations", getRegistrations);
router.get("/registrations/download", downloadRegistrations);
router.post("/validate-promo", validatePromoCode);

// Leads Upload and Management Routes
router.get("/leads", getYogaSessionLeads);
router.post("/leads/upload", uploadLeads.single("file"), uploadYogaSessionLeads);
router.delete("/leads/clear", clearYogaSessionLeads);
router.delete("/leads/:id", deleteYogaSessionLead);

export default router;
