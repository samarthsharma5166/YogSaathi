import { prisma } from "../db/db.js";
// GET /api/admin/payments
export const getAllPayments = async (req, res) => {
    try {
        // Optional query params for pagination and search
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const search = req.query.search || "";

        const skip = (page - 1) * limit;

        // Search filter (by user name, phone, order_id, etc.)
        const where = search
            ? {
                OR: [
                    { razorpay_order_id: { contains: search} },
                    { razorpay_payment_id: { contains: search } },
                    { user: { phoneNumber: { contains: search } } },
                    { user: { name: { contains: search} } },
                ],
            }
            : {};

        const [payments, total] = await Promise.all([
            prisma.payment.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
                include: {
                    user: {
                        select: { id: true, name: true, phoneNumber: true, email: true },
                    },
                    subscription: {
                        select: { id: true, startDate: true, expiresAt: true, status: true },
                    },
                },
            }),
            prisma.payment.count({ where }),
        ]);

        res.json({
            success: true,
            data: payments,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Error fetching payments:", error);
        res.status(500).json({ success: false, message: "Failed to fetch payments" });
    }
};
