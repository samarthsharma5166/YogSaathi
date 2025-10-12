import express from "express";
import {
    createFreeTrialCampaign,
    getAllFreeTrialCampaigns,
    getFreeTrialCampaignById,
    updateFreeTrialCampaign,
    deleteFreeTrialCampaign,
    updateStatus,
} from "../controllers/freeTrialCampaignController.js";

const router = express.Router();

router.post("/", createFreeTrialCampaign);
router.get("/", getAllFreeTrialCampaigns);
router.get("/:id", getFreeTrialCampaignById);
router.put("/:id", updateFreeTrialCampaign);
router.put("/updateStatus/:id",updateStatus)
router.delete("/:id", deleteFreeTrialCampaign);

export default router;
