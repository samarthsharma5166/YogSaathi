import express from "express";
import { createEventRegistration, verifyEventPayment } from "../controllers/event.controller.js";
const router = express.Router();

router.post("/register", createEventRegistration);
router.post("/verify", verifyEventPayment);

export default router;
