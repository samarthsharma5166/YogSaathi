import express from "express";
import { createEventRegistration, verifyEventPayment, getRetreatUsers, downloadRetreatUsers } from "../controllers/event.controller.js";
const router = express.Router();

router.post("/register", createEventRegistration);
router.post("/verify", verifyEventPayment);
router.get("/retreat-users", getRetreatUsers);
router.get("/retreat-users/download", downloadRetreatUsers);

export default router;
