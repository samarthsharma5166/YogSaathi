import express from "express";
const router = express.Router();
import { isAdmin, isAuthenticated } from '../middleware/auth.js'
import { createOrUpdateCommonLink, getCommonLink, verifyCommonLink } from "../controllers/commonLink.controller.js";

router.post("/", isAuthenticated, isAdmin, createOrUpdateCommonLink);
router.get("/", isAuthenticated, isAdmin, getCommonLink);
router.get("/common-link/verify", verifyCommonLink);

export default router;
