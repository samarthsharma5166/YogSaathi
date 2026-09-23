import { CronJob } from 'cron';
import { prisma } from '../db/db.js';
import { weekly_attendance_status__yogsaathi_sessions } from '../utils/messages.js';
import { startOfWeek, endOfWeek, addDays, format, isBefore, startOfDay } from "date-fns";

export const weeklyAttendanceJob = new CronJob('0 21 * * 0', async () => {
    try {
        const now = new Date();
        const threeDaysAgo = addDays(now, -3);

        // 1. Fetch active users and their active subscription
        const allUsers = await prisma.user.findMany({
            where: {
                phoneNumber: { not: null },
            },
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

        const activeUsers = allUsers.filter(user => user.role === "ADMIN" || user.subscription.length > 0);

        if (activeUsers.length === 0) {
            console.log("[weeklyAttendanceJob] No active users found to notify.");
            return;
        }

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

        // 4. Send formatted attendance status to each user
        for (const user of activeUsers) {
            try {
                const userRecords = recordsByUser.get(user.id) || [];
                const userSubStartDate = user.subscription?.[0]?.startDate || null;
                const weekAttendance = formatAttendance(userRecords, now, userSubStartDate);

                await weekly_attendance_status__yogsaathi_sessions(
                    user.phoneNumber,
                    user.name,
                    weekAttendance.Mon,
                    weekAttendance.Tue,
                    weekAttendance.Wed,
                    weekAttendance.Thu,
                    weekAttendance.Fri,
                    weekAttendance.Sat,
                    weekAttendance.Sun
                );

                await new Promise(resolve => setTimeout(resolve, 100)); // Rate limit buffer
            } catch (userError) {
                console.error(`[weeklyAttendanceJob] Error sending message to ${user.phoneNumber}:`, userError.message);
            }
        }
    } catch (error) {
        console.error("[weeklyAttendanceJob] Critical error running weekly attendance job:", error);
    }
}, null, true, "Asia/Kolkata");

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

