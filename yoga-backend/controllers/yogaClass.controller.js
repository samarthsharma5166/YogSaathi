import { prisma } from "../db/db.js";

// 📌 Create a new yoga class
export const createYogaClass = async (req, res) => {
    try {
        const { date, title, videoLink, focusArea } = req.body;

        const yogaClass = await prisma.yogaClass.create({
            data: {
                date: new Date(date),  // ensure DateTime format
                title,
                focusArea,
                videoLink,
            },
        });

        res.status(201).json({ success: true, data: yogaClass });
    } catch (error) {
        console.error("Error creating yoga class:", error);
        res.status(500).json({ success: false, message: "Failed to create yoga class" });
    }
};

// 📌 Get all yoga classes
export const getAllYogaClasses = async (req, res) => {
    try {
        const classes = await prisma.yogaClass.findMany({
            orderBy: { date: "asc" },
        });

        res.status(200).json({ success: true, data: classes });
    } catch (error) {
        console.error("Error fetching yoga classes:", error);
        res.status(500).json({ success: false, message: "Failed to fetch yoga classes" });
    }
};

// 📌 Get one yoga class by ID
export const getYogaClassById = async (req, res) => {
    try {
        const { id } = req.params;

        const yogaClass = await prisma.yogaClass.findUnique({
            where: { id },
        });

        if (!yogaClass) {
            return res.status(404).json({ success: false, message: "Yoga class not found" });
        }

        res.status(200).json({ success: true, data: yogaClass });
    } catch (error) {
        console.error("Error fetching yoga class:", error);
        res.status(500).json({ success: false, message: "Failed to fetch yoga class" });
    }
};

// 📌 Update yoga class
export const updateYogaClass = async (req, res) => {
    try {
        const { id } = req.params;
        const { date, title, videoLink, focusArea } = req.body;

        const updated = await prisma.yogaClass.update({
            where: { id },
            data: {
                date: date ? new Date(date) : undefined,
                title,
                videoLink,
                focusArea,
            },
        });

        res.status(200).json({ success: true, data: updated });
    } catch (error) {
        console.error("Error updating yoga class:", error);
        res.status(500).json({ success: false, message: "Failed to update yoga class" });
    }
};

// 📌 Delete yoga class
export const deleteYogaClass = async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.attendance.deleteMany({
            where: { yogaClassId: id },
        });

        await prisma.yogaClass.delete({
            where: { id },
        });

        res.status(200).json({ success: true, message: "Yoga class deleted successfully" });
    } catch (error) {
        console.error("Error deleting yoga class:", error);
        res.status(500).json({ success: false, message: "Failed to delete yoga class" });
    }
};

export const getAllYogaClassesList = async (req,res) => {
    try {
        const yogaClasses = await prisma.yogaClass.findMany({
            where: {
                isActive: true,
            },
            select: {
                id: true,
                date: true,
                title: true
            }
        });
        res.status(200).json({ success: true, data: yogaClasses });
    } catch (error) {
        console.error("Error fetching yoga classes:", error);
        res.status(500).json({ success: false, message: "Failed to fetch yoga classes" });
    }
}

// export const getClassLink = async (req, res) => {
//     try {
//         const { code } = req.params;
//         const now = new Date();
//         const nowUTC = new Date(now.toISOString());
//         const yesterdayUTC = new Date(nowUTC.getTime() - 24 * 60 * 60 * 1000).toISOString();
//         const tomorrowUTC = new Date(nowUTC.getTime() + 24 * 60 * 60 * 1000).toISOString();

//         // 🔹 Find user and subscription
//         const user = await prisma.user.findFirst({
//             where: { referralCode: code },
//             include: { subscription: {
//                 where:{
//                     expiresAt: {
//                         gte: yesterdayUTC
//                     },
//                     startDate: {
//                         lte: tommorrowUTC
//                     }
//                 }
//             } },
//         });

//         if (!user || user.subscription.length === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: "User not found or subscription expired",
//             });
//         }

//         const activeSub = user.subscription[0];
//         // 🔹 Find yoga class around current time
//         const yogaClass = await prisma.yogaClass.findFirst({
//             where: {
//                 date: {
//                     gte: new Date(nowUTC.getTime() - 45 * 60 * 1000).toISOString(), // 15 min before
//                     lte: new Date(nowUTC.getTime() + 15 * 60 * 1000).toISOString(), // 15 min after
//                 },
//             },
//             orderBy: { date: "asc" },
//         });
//         if (!yogaClass) {
//             return res.status(404).json({
//                 success: false,
//                 message: "No active yoga class please try after some time",
//             });
//         }

//         // 🔹 Calculate join window
//         const classStart = new Date(yogaClass.date);
//         const joinWindowStart = new Date(classStart.getTime() - 10 * 60 * 1000); // 10 min before
//         const joinWindowEnd = new Date(classStart.getTime() + 25 * 60 * 1000);   // 25 min after

//         let attended = false;

//         if (nowUTC >= joinWindowStart && nowUTC <= joinWindowEnd) {
//             attended = true;
//             // 🔹 Upsert attendance (create if not exists, update if exists)
//             await prisma.attendance.upsert({
//                 where: {
//                     userId_yogaClassId: {
//                         userId: user.id,
//                         yogaClassId: yogaClass.id,
//                     },
//                 },
//                 update: { attended: true, attendedAt: nowUTC },
//                 create: {
//                     userId: user.id,
//                     subscriptionId: activeSub.id,
//                     yogaClassId: yogaClass.id,
//                     attended: true,
//                     attendedAt: now,
//                 },
//             });
//         }

//         res.status(200).json({ success: true, link: yogaClass.videoLink });
//     } catch (error) {
//         console.error("Error fetching yoga class:", error);
//         res.status(500).json({ success: false, message: "Failed to fetch yoga class" });
//     }
// };




export const getClassLink = async (req, res) => {
    try {
        const { code } = req.params;

        const nowUTC = new Date();
        const yesterdayUTC = new Date(nowUTC.getTime() - 24 * 60 * 60 * 1000);
        const tomorrowUTC = new Date(nowUTC.getTime() + 24 * 60 * 60 * 1000);

        const user = await prisma.user.findFirst({
            where: { referralCode: code },
            include: {
                subscription: {
                    where: {
                        expiresAt: { gte: yesterdayUTC },
                        startDate: { lte: tomorrowUTC },
                    },
                },
            },
        });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // 🔹 Find active yoga class
        const yogaClass = await prisma.yogaClass.findFirst({
            where: {
                date: {
                    gte: new Date(nowUTC.getTime() - 45 * 60 * 1000),
                    lte: new Date(nowUTC.getTime() + 15 * 60 * 1000),
                },
            },
            orderBy: { date: "asc" },
        });

        if (!yogaClass) {
            return res.status(404).json({
                success: false,
                message: "No active yoga class, try later",
            });
        }

        // 🔹 Admins bypass subscription logic
        if (user.role === "ADMIN") {
            return res.status(200).json({ success: true, link: yogaClass.videoLink });
        }

        if (user.subscription.length === 0) {
            return res.status(403).json({
                success: false,
                message: "Subscription expired or inactive",
            });
        }

        const activeSub = user.subscription[0];

        // 🔹 Attendance window
        const classStart = new Date(yogaClass.date);
        const joinWindowStart = new Date(classStart.getTime() - 10 * 60 * 1000);
        const joinWindowEnd = new Date(classStart.getTime() + 25 * 60 * 1000);

        if (nowUTC >= joinWindowStart && nowUTC <= joinWindowEnd) {
            await prisma.attendance.upsert({
                where: {
                    userId_yogaClassId: {
                        userId: user.id,
                        yogaClassId: yogaClass.id,
                    },
                },
                update: {
                    attended: true,
                    attendedAt: nowUTC,
                },
                create: {
                    userId: user.id,
                    subscriptionId: activeSub.id,
                    yogaClassId: yogaClass.id,
                    attended: true,
                    attendedAt: nowUTC,
                },
            });
        }

        return res.status(200).json({ success: true, link: yogaClass.videoLink });

    } catch (error) {
        console.error("Error fetching yoga class:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch yoga class",
        });
    }
};
