import express from "express";
import { getAllPayments } from "../controllers/payments.controllers.js";
import { isAdmin, isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.get("/",isAuthenticated,isAdmin, getAllPayments);

export default router;