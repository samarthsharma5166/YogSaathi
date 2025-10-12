import { prisma } from "../db/db.js";

export async function getUserSubscription(req, res) {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(404).json({ error: "User ID is required" });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                phoneNumber: true,
                subscription: {
                    include: {
                        plan: true, // include plan details for each subscription
                    },
                },
            },
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.status(200).json({ user });
    } catch (error) {
        console.error("Error fetching user subscription:", error);
        return res.status(500).json({ error: "Failed to fetch user subscription" });
    }
}
