import { CronJob } from 'cron';
import { prisma } from '../db/db.js';
import { weekly_attendance_status__yogsaathi_sessions } from '../utils/messages.js';
import { startOfWeek, endOfWeek, addDays, format, isBefore, startOfDay } from "date-fns";

export async function sendWeeklyAttendanceReport() {
    try {
        const now = new Date();
        const threeDaysAgo = addDays(now, -3);

        console.log(`[weeklyAttendanceJob] Starting weekly attendance report at ${now.toISOString()}...`);

        // 1. Fetch active users and their active subscription (Removed invalid phoneNumber: { not: null } which caused PrismaClientValidationError)
        const allUsers = await prisma.user.findMany({
            include: {
                subscription: {
                    where: {
                        expiresAt: { gte: now },
                        status: "active",
                        startDate: { lte: threeDaysAgo }
                    },
                    include: { plan: true },
                    orderBy: { startDate: 'asc' }
                },
            },
        });

        const activeUsers = allUsers.filter(user => user.phoneNumber && (user.role === "ADMIN" || user.subscription.length > 0));

        if (activeUsers.length === 0) {
            console.log("[weeklyAttendanceJob] No active users found to notify.");
            return { success: true, count: 0 };
        }

        console.log(`[weeklyAttendanceJob] Found ${activeUsers.length} active users to notify.`);

        const userIds = activeUsers.map(u => u.id);
        const { weekStart, weekEnd } = getWeekRange(now);

        // 2. Fetch all attendance records for all active users in 1 single query (fixes N+1)
        const allRecords = await prisma.attendance.findMany({
            where: {
                userId: { in: userIds },
                yogaClass: {
                    date: {
                        gte: weekStart,
                        lte: weekEnd,
                    },
                },
            },
            include: { yogaClass: true },
        });

        // 3. Group attendance records by userId in memory
        const recordsByUser = new Map();
        for (const record of allRecords) {
            if (!recordsByUser.has(record.userId)) {
                recordsByUser.set(record.userId, []);
            }
            recordsByUser.get(record.userId).push(record);
        }

        let sentCount = 0;
        let failCount = 0;

        // 4. Send formatted attendance status to each user
        for (const user of activeUsers) {
            try {
                const userRecords = recordsByUser.get(user.id) || [];
                const userSubStartDate = user.subscription?.[0]?.startDate || null;
                const weekAttendance = formatAttendance(userRecords, now, userSubStartDate);

                const cleanPhone = String(user.phoneNumber).replace(/[^0-9]/g, '');

                await weekly_attendance_status__yogsaathi_sessions(
                    cleanPhone,
                    user.name,
                    weekAttendance.Mon,
                    weekAttendance.Tue,
                    weekAttendance.Wed,
                    weekAttendance.Thu,
                    weekAttendance.Fri,
                    weekAttendance.Sat,
                    weekAttendance.Sun
                );

                sentCount++;
                await new Promise(resolve => setTimeout(resolve, 150)); // Rate limit buffer
            } catch (userError) {
                failCount++;
                console.error(`[weeklyAttendanceJob] Error sending message to ${user.phoneNumber}:`, userError.message);
            }
        }

        console.log(`[weeklyAttendanceJob] Broadcast completed. Sent: ${sentCount}, Failed: ${failCount}`);
        return { success: true, sentCount, failCount };
    } catch (error) {
        console.error("[weeklyAttendanceJob] Critical error running weekly attendance job:", error);
        return { success: false, error: error.message };
    }
}

export const weeklyAttendanceJob = new CronJob('0 23 * * 0', sendWeeklyAttendanceReport, null, true, "Asia/Kolkata");

function getWeekRange(referenceDate = new Date()) {
    const weekStart = startOfWeek(referenceDate, { weekStartsOn: 1 }); // Monday 00:00:00
    const weekEnd = endOfWeek(referenceDate, { weekStartsOn: 1 });     // Sunday 23:59:59.999
    return { weekStart, weekEnd };
}

function formatAttendance(records, referenceDate = new Date(), subscriptionStartDate = null) {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const attendanceMap = {};

    // Default `_`
    days.forEach((day) => (attendanceMap[day] = "_"));

    // 1. Mark 'P' for classes attended (never overwrite 'P')
    records.forEach((rec) => {
        const day = format(rec.yogaClass.date, "EEE");
        if (rec.attended) {
            attendanceMap[day] = "P";
        }
    });

    // 2. Mark 'A' for past/completed days only if user was already subscribed
    const weekStart = startOfWeek(referenceDate, { weekStartsOn: 1 });
    const todayStart = startOfDay(referenceDate);
    const subStartDay = subscriptionStartDate ? startOfDay(new Date(subscriptionStartDate)) : null;

    days.forEach((day, idx) => {
        const weekDayDate = addDays(weekStart, idx);
        const isPastOrToday = isBefore(weekDayDate, todayStart) || weekDayDate.getTime() === todayStart.getTime();
        const wasSubscribed = !subStartDay || isBefore(subStartDay, addDays(weekDayDate, 1));

        if (isPastOrToday && wasSubscribed && attendanceMap[day] === "_") {
            attendanceMap[day] = "A";
        }
    });

    return attendanceMap;
}
