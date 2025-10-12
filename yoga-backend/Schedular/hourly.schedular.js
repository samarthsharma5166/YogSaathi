import { CronJob } from 'cron';
import { prisma } from '../db/db.js';
import { class_reminder, giftwellness_yogsaathi, join_session__mark_attendance, session_reminder, session_reminder__orientation_for_free_trial, share_wellness_14_days_of_free_yoga, subscription_invitation, vijayadashami_greetings, vijaydashmi_greetings_and_referrals, weekly_attendance_status__yogsaathi_sessions, yoga_subscription_offer, yoga_trial_midway_update__reminder, yogsaathi_contact_detail, your_weekly_yoga_schedule__access_details } from '../utils/messages.js';
import { startOfWeek, addDays, format } from "date-fns";

export const hourlyJob = new CronJob('*/10 * * * *', async () => {
    const now = new Date();
    
    const scheduledMessages = await prisma.scheduledMessage.findMany({
        where: {
            scheduledDate:{
                gte: new Date(now.getTime() - 15 * 60 * 1000), // within last 15 min
                lte: new Date(now.getTime() + 15 * 60 * 1000)  // or upcoming 15 min
            },
            sent: false
        }
    });

    scheduledMessages.forEach(async (message) => {
        // session_reminder__orientation_for_free_trial
        if (message.templateName === "session_reminder__orientation_for_free_trial"){

            const users = await getUsers(message);

            const { date, time, sessionLink } = message.payload;
            users.map((user)=>{
                session_reminder__orientation_for_free_trial(user.phoneNumber,user.name,date,time ,sessionLink);
            })

        }

        // class_reminder
        if (message.templateName === "class_reminder"){

            const yogaClass = await prisma.yogaClass.findFirst({
                where: {
                    id:message.payload.classId,
                    isActive: true
                }
            })

            const users = await getUsers(message);
            
                users.map((user)=>{
                    class_reminder(user.phoneNumber, user.name, yogaClass.focusArea, user.referralCode, user.referralPoints);
                })
            

            
            await prisma.yogaClass.update({
                where: { id: yogaClass.id },
                data: { isActive: false }
            })
        

        }

        if (message.templateName === "your_weekly_yoga_schedule__access_details"){
            const users = await getUsers(message);
            const { monday,tuesday,wednesday,thursday,friday,saturday,sunday} = message.payload;
            users.map((user)=>{
                your_weekly_yoga_schedule__access_details(user.phoneNumber,user.name,monday,tuesday,wednesday,thursday,friday,saturday,sunday,user.referralCode,user.referralPoints);
            })
        }

        if (message.templateName === "join_session__mark_attendance"){
            const users = await getUsers(message);
            const { sessionLink } = message.payload;
            users.map((user)=>{
                join_session__mark_attendance(user.phoneNumber,user.name,user.referralCode,user.referralPoints);
            })
        }

        if (message.templateName === "session_reminder__orientation_for_free_trial"){
            const users = await getUsers(message);
            const { date, time, sessionLink } = message.payload;
            users.map((user)=>{
                session_reminder__orientation_for_free_trial(user.phoneNumber, user.name, date, time, user.referralCode, user.referralPoints);
            })
        }

        if (message.templateName === "session_reminder") {
            const users = await getUsers(message);
            const { date, time, sessionLink } = message.payload;
            users.map((user) => {
                session_reminder(user.phoneNumber, user.name, date, time, user.referralCode, user.referralPoints);
            })
        }


        if (message.templateName === "giftwellness_yogsaathi"){
            const users = await getUsers(message);
            users.map((user) => {
                giftwellness_yogsaathi(user.phoneNumber, user.name);
            })
        }

        if (message.templateName === "yoga_subscription_offer"){
            const users = await getUsers(message);
            users.map((user) => {
                yoga_subscription_offer(user.phoneNumber, user.name);
            })
        }

        if (message.templateName === "weekly_attendance_status__yogsaathi_sessions"){
            const users = await getUsers(message);

            for (const user of users) {
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

        }

        if (message.templateName === "subscription_invitation"){
            const users = await getUsers(message);  
            users.map((user) => {
                subscription_invitation(user.phoneNumber, user.name);
            })
        }

        if (message.templateName === "share_wellness_14_days_of_free_yoga"){
            const users = await getUsers(message);
            users.map((user) => {
                share_wellness_14_days_of_free_yoga(user.phoneNumber, user.name, user.referralCode,user.referralPoints);
            })
        }

        if (message.templateName === "vijayadashami_greetings"){
            const users = await getUsers(message);
            users.map((user) => {
                vijayadashami_greetings(user.phoneNumber, user.name);
            })
        }

        if (message.templateName === "vijaydashmi_greetings_and_referrals") {
            const users = await getUsers(message);
            users.map((user) => {
                vijaydashmi_greetings_and_referrals(user.phoneNumber, user.name, user.referralCode, user.referralPoints);
            })
        }

        if (message.templateName === "yoga_trial_midway_update__reminder"){
            const users = await getUsers(message);
            users.map((user)=>{
                // yoga_trial_midway_update__reminder(user.phoneNumber,user.name);
                yoga_trial_midway_update__reminder(user.phoneNumber,user.name);
            })
        }

        if (message.templateName === "yogsaathi_contact_detail"){
            const users = await getUsers(message);
            users.map((user)=>{
                // yoga_trial_midway_update__reminder(user.phoneNumber,user.name);
                yogsaathi_contact_detail(user.phoneNumber,user.name);
            })
        }

    });

    scheduledMessages.forEach(async (message) => {
        await prisma.scheduledMessage.update({
            where: { id: message.id },
            data: { sent: true }
        });
    });
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

async function getUsers(message){

    if (message.targetAudience === "ALL") {
        const users = await prisma.user.findMany();
        return users;
    }

    if(message.targetAudience === "ADMIN"){
        const users =  await prisma.user.findMany({
            where: {
                role: "ADMIN"
            }
        })
        return users;
    }

    if (message.targetAudience === "SUBSCRIBERS") {
        const users = await prisma.user.findMany({
            where: {
                subscription: {
                    some:{
                        plan: {
                            isFreeTrial: false
                        },
                        expiresAt: {
                            gte: new Date()
                        }
                    }
                }
            }
        })
        return users;
    }

    if (message.targetAudience === "FREETRIAL"){
        const users = await prisma.user.findMany({
            where: {
                subscription: {
                    some: {
                        plan: {
                            isFreeTrial: true
                        },
                        expiresAt: {
                            gte: new Date()
                        }
                    }
                }
            }
        })
        return users;
    }

}