import express from "express";
import {
  createAshtangaRegistration,
  verifyAshtangaPayment,
  getAshtangaRegistrations,
  downloadAshtangaRegistrations,
} from "../controllers/ashtanga.controller.js";

const router = express.Router();

router.post("/register", createAshtangaRegistration);
router.post("/verify", verifyAshtangaPayment);
router.get("/registrations", getAshtangaRegistrations);
router.get("/registrations/download", downloadAshtangaRegistrations);

export default router;
