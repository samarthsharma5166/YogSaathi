import express from "express";
import multer from "multer";
import {
  getDieticianConfig,
  updateDieticianConfig,
  createRegistration,
  verifyPayment,
  getRegistrations,
  downloadRegistrations,
  validatePromoCode,
} from "../controllers/dietician.controller.js";
import {
  getDieticianLeads,
  uploadDieticianLeads,
  clearDieticianLeads,
  deleteDieticianLead,
} from "../controllers/dieticianLead.controller.js";

const router = express.Router();

const uploadLeads = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.get("/config", getDieticianConfig);
router.post("/config", updateDieticianConfig);
router.post("/register", createRegistration);
router.post("/verify", verifyPayment);
router.get("/registrations", getRegistrations);
router.get("/registrations/download", downloadRegistrations);
router.post("/validate-promo", validatePromoCode);

// Leads Upload and Management Routes
router.get("/leads", getDieticianLeads);
router.post("/leads/upload", uploadLeads.single("file"), uploadDieticianLeads);
router.delete("/leads/clear", clearDieticianLeads);
router.delete("/leads/:id", deleteDieticianLead);

export default router;
