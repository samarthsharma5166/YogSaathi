import { prisma } from "../db/db.js";

export const getReferralStats = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        referrals: true, 
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      referral_code: user.referralCode,
      referral_count: user.referrals.length,
      referredUsers: user.referrals,
    });
  } catch (err) {
    console.error("Referral Stats Error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};
