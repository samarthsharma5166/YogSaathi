import express from "express";
import {
  checkMilestones,
  downloadCertificatePdf,
} from "../controllers/certificate.controller.js";

const router = express.Router();

// Check user milestones by phone (supports POST with body or GET with query)
router.post("/check", checkMilestones);
router.get("/milestones", checkMilestones);

// Download certificate PDF directly
router.get("/download-pdf", downloadCertificatePdf);

export default router;
