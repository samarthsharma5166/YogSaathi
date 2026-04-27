import { CronJob } from 'cron';
import { prisma } from '../db/db.js';
import { weekly_attendance_status__yogsaathi_sessions } from '../utils/messages.js';
import { startOfWeek, addDays, format } from "date-fns";

export const weeklyAttendanceJob = new CronJob('0 21 * * 0', async () => {
    const now = new Date();

    const allUsers = await prisma.user.findMany({
        include: {
            subscription: {
                where: {
                    expiresAt: { gte: now },
                    status: "active"
                },
                include: { plan: true },
            },
        },
    });

    const activeUsers = allUsers.filter(user => user.role === "ADMIN" || user.subscription.length > 0);

    for (const user of activeUsers) {
        const records = await getWeeklyAttendance(user.id);
        const weekAttendance = formatAttendance(records);

        weekly_attendance_status__yogsaathi_sessions(
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
    }
}, {
    scheduled: true,
    timezone: "Asia/Kolkata"
});

function getWeekRange() {
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday
    return { weekStart, today };
}

async function getWeeklyAttendance(userId) {
    const { weekStart, today } = getWeekRange();

    const records = await prisma.attendance.findMany({
        where: {
            userId,
            yogaClass: {
                date: {
                    gte: weekStart,
                    lte: today,
                },
            },
        },
        include: { yogaClass: true },
    });

    return records;
}

function formatAttendance(records) {
    const today = new Date();
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const attendanceMap = {};

    // Default `_`
    days.forEach((day) => (attendanceMap[day] = "_"));

    records.forEach((rec) => {
        const day = format(rec.yogaClass.date, "EEE"); // "Mon", "Tue"...
        if (rec.attended) {
            attendanceMap[day] = "P";
        }
        if (!rec.attended && rec.yogaClass.date < today) {
            attendanceMap[day] = "A";
        }
    });

    // Now ensure: Past days with no record = "A"
    days.forEach((day, idx) => {
        const weekDayDate = addDays(startOfWeek(today, { weekStartsOn: 1 }), idx);

        if (weekDayDate < today && attendanceMap[day] === "_") {
            attendanceMap[day] = "A";   // 🔥 mark absent if no record in past
        }

        if (weekDayDate > today) {
            attendanceMap[day] = "_";   // 🔥 keep future days blank
        }
    });

    return attendanceMap;
}
