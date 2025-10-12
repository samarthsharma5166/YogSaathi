import {prisma} from '../db/db.js'
// ✅ Create a new Free Trial Campaign
export const createFreeTrialCampaign = async (req, res) => {
    try {
        const { startDate, endDate } = req.body;

        const campaign = await prisma.freeTrialCampaign.create({
            data: {
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                isActive:  true,
            },
        });

        res.status(201).json({ success: true, data: campaign });
    } catch (error) {
        console.error("Error creating campaign:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// ✅ Get all Free Trial Campaigns
export const getAllFreeTrialCampaigns = async (req, res) => {
    try {
        const campaigns = await prisma.freeTrialCampaign.findMany({
            orderBy: { createdAt: "desc" },
        });
        res.status(200).json({ success: true, data: campaigns });
    } catch (error) {
        console.error("Error fetching campaigns:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// ✅ Get Single Campaign by ID
export const getFreeTrialCampaignById = async (req, res) => {
    try {
        const { id } = req.params;

        const campaign = await prisma.freeTrialCampaign.findUnique({
            where: { id },
        });

        if (!campaign) {
            return res.status(404).json({ success: false, message: "Campaign not found" });
        }

        res.status(200).json({ success: true, data: campaign });
    } catch (error) {
        console.error("Error fetching campaign:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// ✅ Update Campaign
export const updateFreeTrialCampaign = async (req, res) => {
    try {
        const { id } = req.params;
        const { startDate, endDate, isActive } = req.body;

        const campaign = await prisma.freeTrialCampaign.update({
            where: { id },
            data: {
                startDate: startDate ? new Date(startDate) : undefined,
                endDate: endDate ? new Date(endDate) : undefined,
                isActive,
            },
        });

        res.status(200).json({ success: true, data: campaign });
    } catch (error) {
        console.error("Error updating campaign:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// ✅ Delete Campaign
export const deleteFreeTrialCampaign = async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.freeTrialCampaign.delete({
            where: { id },
        });

        res.status(200).json({ success: true, message: "Campaign deleted successfully" });
    } catch (error) {
        console.error("Error deleting campaign:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};


export const updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;
        const campaign = await prisma.freeTrialCampaign.update({
            where: { id },
            data: {
                isActive,
            },
        });
        res.status(200).json({ success: true, data: campaign });
    } catch (error) {
        console.error("Error updating campaign:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};