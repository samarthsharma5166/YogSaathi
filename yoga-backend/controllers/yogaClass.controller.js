import { prisma } from "../db/db.js";
import { yoga_certificate } from "../utils/messages.js";
import { MILESTONE_CONFIG, getISTDayRange, getISTDateString } from "./certificate.controller.js";

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

/**
 * Evaluate if user attendance matches certificate milestones (Bronze: 50, Silver: 100, Gold: 200, Platinum: 300, Diamond: 500)
 * and send the corresponding WhatsApp template via ChatMitra without affecting class joining flow.
 */
export const checkAndSendAttendanceCertificate = async (user, yogaClass) => {
    try {
        if (!user || !user.id || !user.phoneNumber || !yogaClass || !yogaClass.date) {
            return { sent: false, reason: "Missing user or class details" };
        }

        // 1. Fetch all attended records for this user
        const attendanceRecords = await prisma.attendance.findMany({
            where: {
                userId: user.id,
                attended: true,
            },
            include: {
                yogaClass: true,
            },
            orderBy: [
                { yogaClass: { date: "asc" } },
                { attendedAt: "asc" },
                { createdAt: "asc" },
            ],
        });

        // 2. Deduplicate attendance by IST calendar day (Asia/Kolkata), exactly matching certificate.controller.js
        const dateMap = new Map();
        for (const record of attendanceRecords) {
            const dateVal = record.yogaClass?.date || record.attendedAt || record.createdAt;
            if (!dateVal) continue;
            const d = new Date(dateVal);
            const dateStr = getISTDateString(d);
            if (!dateMap.has(dateStr)) {
                dateMap.set(dateStr, d);
            }
        }

        const totalAttendance = dateMap.size;

        // 3. Match milestone using MILESTONE_CONFIG (Bronze: 50, Silver: 100, Gold: 200, Platinum: 300, Diamond: 500)
        const matchedMilestone = MILESTONE_CONFIG.find(m => m.days === totalAttendance);
        if (!matchedMilestone) {
            return {
                sent: false,
                reason: `Attendance count (${totalAttendance}) does not match any milestone`,
                totalAttendance,
            };
        }

        // 5. Send certificate template
        // Parameters: number, name, certificate (without 'certificate', e.g. Bronze, Silver, Gold, Platinum, Diamond), totalAttendance, link
        const certificateName = matchedMilestone.badge || matchedMilestone.title.replace(/\s*certificate/gi, "").trim();
        const userName = user.name || "Member";
        const link = "https://yogsaathi.com/certificate";

        await yoga_certificate(
            user.phoneNumber,
            userName,
            certificateName,
            String(totalAttendance),
            link
        );

        console.log(`[CertificateTrigger] Sent ${certificateName} certificate template to ${user.phoneNumber} (${userName}) for ${totalAttendance} days.`);
        return {
            sent: true,
            tier: matchedMilestone.tier,
            certificate: certificateName,
            totalAttendance,
            phoneNumber: user.phoneNumber,
        };
    } catch (err) {
        console.error("[CertificateTrigger] Error in checkAndSendAttendanceCertificate:", err?.message || err);
        return { sent: false, error: err?.message || String(err) };
    }
};

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
                        status: "active",
                        expiresAt: { gte: yesterdayUTC },
                        startDate: { lte: tomorrowUTC },
                    },
                    include: {
                        plan: true,
                    },
                },
            },
        });

        const commonLink = await prisma.commonLink.findFirst({
            where: { ref: code },
        });

        if (!user && !commonLink) {
            return res.status(404).json({ success: false, isExpired: false, message: "User not found or link is invalid" });
        }

        // 🔹 Check common link expiry
        if (commonLink && !user) {
            if (new Date(commonLink.expiryDate) < yesterdayUTC || new Date(commonLink.startDate) > tomorrowUTC) {
                return res.status(403).json({
                    success: false,
                    isExpired: true,
                    message: "This class link has expired.",
                });
            }
        }

        // 🔹 Check user subscription expiry (Admins bypass)
        if (user && user.role !== "ADMIN" && user.subscription.length === 0) {
            // Check if user has an upcoming paid subscription starting in the future
            const upcomingSub = await prisma.subscription.findFirst({
                where: {
                    userId: user.id,
                    status: "active",
                    startDate: { gt: tomorrowUTC },
                },
                orderBy: { startDate: "asc" },
                include: { plan: true },
            });

            if (upcomingSub) {
                const formattedStart = new Date(upcomingSub.startDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                });
                return res.status(403).json({
                    success: false,
                    isExpired: false,
                    isUpcoming: true,
                    message: `Your membership plan starts on ${formattedStart}. You will be able to join live classes once your plan starts.`,
                });
            }

            return res.status(403).json({
                success: false,
                isExpired: true,
                message: "Your free trial or subscription has expired. Please choose a membership plan to continue attending live classes.",
            });
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
                isExpired: false,
                message: "No active yoga class, try later",
            });
        }

        if (commonLink) {
            return res.status(200).json({ success: true, link: yogaClass.videoLink });
        }

        // 🔹 Admins bypass subscription logic
        if (user && user.role === "ADMIN") {
            return res.status(200).json({ success: true, link: yogaClass.videoLink });
        }

        // 🔹 Select currently active subscription for attendance
        // Prefer active paid plan over free trial if both are ongoing today
        const activeSub =
            user.subscription.find(s => !s.plan?.isFreeTrial && new Date(s.startDate) <= nowUTC && new Date(s.expiresAt) >= nowUTC) ||
            user.subscription.find(s => new Date(s.startDate) <= nowUTC && new Date(s.expiresAt) >= nowUTC) ||
            user.subscription[0];

        // 🔹 Attendance window
        const classStart = new Date(yogaClass.date);
        const joinWindowStart = new Date(classStart.getTime() - 10 * 60 * 1000);
        const joinWindowEnd = new Date(classStart.getTime() + 25 * 60 * 1000);

        if (nowUTC >= joinWindowStart && nowUTC <= joinWindowEnd) {
            let isFirstAttendanceToday = false;
            try {
                const { startOfDay, endOfDay } = getISTDayRange(yogaClass.date);

                // 🔹 Rule: User must have ONLY 1 attendance in a day out of any of the 7 daily classes
                // Check if user has ALREADY attended ANY class today in IST (check both yogaClass.date and attendedAt)
                const existingAttendanceToday = await prisma.attendance.findFirst({
                    where: {
                        userId: user.id,
                        attended: true,
                        OR: [
                            {
                                yogaClass: {
                                    date: {
                                        gte: startOfDay,
                                        lte: endOfDay,
                                    },
                                },
                            },
                            {
                                attendedAt: {
                                    gte: startOfDay,
                                    lte: endOfDay,
                                },
                            },
                        ],
                    },
                });

                if (!existingAttendanceToday) {
                    // No attendance marked yet today across any slot. This is their 1 daily attendance!
                    isFirstAttendanceToday = true;

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
                            subscriptionId: activeSub?.id || user.subscription?.[0]?.id || "",
                            yogaClassId: yogaClass.id,
                            attended: true,
                            attendedAt: nowUTC,
                        },
                    });
                } else if (existingAttendanceToday.yogaClassId === yogaClass.id) {
                    // Rejoining / refreshing the exact same class: update timestamp safely
                    await prisma.attendance.update({
                        where: { id: existingAttendanceToday.id },
                        data: { attendedAt: nowUTC },
                    }).catch(() => {});
                } else {
                    // User already attended another class today (e.g. joined 5:00 AM, now joining 6:30 PM).
                    // They join freely with full access, but we do not record a duplicate 2nd attendance for today.
                    console.log(`[getClassLink] User ${user.phoneNumber} already has attendance today from class ${existingAttendanceToday.yogaClassId}. Allowing join without duplicate attendance.`);
                }
            } catch (attendanceErr) {
                console.error("[getClassLink] Error recording attendance:", attendanceErr);
            }

            if (isFirstAttendanceToday) {
                // Safely evaluate certificate milestones in background without delaying class link response
                checkAndSendAttendanceCertificate(user, yogaClass).catch(certErr => {
                    console.error("[getClassLink] Certificate trigger background error:", certErr);
                });
            }
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
