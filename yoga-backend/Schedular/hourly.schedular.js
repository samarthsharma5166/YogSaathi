import { CronJob } from 'cron';
import { prisma } from '../db/db.js';
import { class_reminder, class_reminder_free_yoga_for_all, confirmation_regn, days_yoga_trial_intimation_hindi, festival_greetings, festival_greetings_christmas_new_year, free_online_yoga_trial_reminder, giftwellness_yogsaathi, inputs, join_session__mark_attendance, online_free_yoga_trial__joining_details, opi, orientation_program__new, regularity_key_hindi, retreat_info_brochure, session_info, session_particulars, session_reminder, session_reminder__orientation_for_free_trial, session_schedule_notification, share_wellness_14_days_of_free_yoga, subscription_invitation, subscription_offer_, subscription_plan_new_year_offer, template_session_20260627022218, trial_expiry_notification, vijayadashami_greetings, vijaydashmi_greetings_and_referrals, weekly_attendance_status__yogsaathi_sessions, world_meditation_day_greetings, yoga_class_time_details_as_per_ist, yoga_offer_reminder, yoga_subscription_offer, yoga_trail_intimation_, yoga_training_1ram, yoga_training_2, yoga_trial_enrolment, yoga_trial_midway_update__reminder, yoga_trial_participation_reminder, yogsaathi_communication_channels, yogsaathi_contact_detail, yogsaathi_group_access_update, yogsaathi_payment_link_share, yogsaathi_training_brochure_share, your_weekly_yoga_schedule__access_details } from '../utils/messages.js';
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
            // const link = await prisma.commonLink.findFirst();
            users.map((user)=>{
                // class_reminder_free_yoga_for_all(user.phoneNumber, user.name, yogaClass.focusArea, user.referralCode, user.referralPoints);
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
            const convertedTime = formatTo12Hour(time);
            users.map((user)=>{
                session_reminder__orientation_for_free_trial(user.phoneNumber, user.name, convertedTime, time, sessionLink);
            })
        }

        if (message.templateName === "session_reminder") {
            const users = await getUsers(message);

            const { date, time, sessionLink } = message.payload;
            const convertedTime = formatTo12Hour(time);
            users.map((user) => {
                const classLink = `${process.env.CLASS_BASE_URL}/class/join?ref=${user.referralCode}_${user.referralPoints}`
                session_reminder(user.phoneNumber, user.name, date, convertedTime, classLink);
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

        if (message.templateName === "yoga_offer_reminder") {
            const users = await getUsers(message);
            users.map((user) => {
                yoga_offer_reminder(user.phoneNumber, user.name);
            })
        }

        if (message.templateName === "festival_greetings"){
            const users = await getUsers(message);
            users.map((user) => {
                festival_greetings(user.phoneNumber, user.name);
            })
        }

        if (message.templateName === "yogsaathi_communication_channels"){
            const users = await getUsers(message);
            users.map((user) => {
                yogsaathi_communication_channels(user.phoneNumber, user.name);
            })
        }

        if (message.templateName === "free_online_yoga_trial_reminder"){
            const users = await getUsers(message);
            users.map((user) => {
                free_online_yoga_trial_reminder(user.phoneNumber, user.name);
            
            })
        }
        
        if (message.templateName === "yoga_class_time_details_as_per_ist"){
            const users = await getUsers(message);
            users.map((user) => {
                yoga_class_time_details_as_per_ist(user.phoneNumber, user.name);
            })
        }

        if (message.templateName === "yoga_trial_participation_reminder"){
            const users = await getUsers(message);
            const {Link} = message.payload;
            users.map((user) => {
                yoga_trial_participation_reminder(user.phoneNumber, user.name, Link);
            })  
        }

        if (message.templateName === "21_days_yoga_trial_intimation_hindi"){
            const users = await getUsers(message);
            const link = await prisma.commonLink.findFirst();
            users.map((user) => {
                days_yoga_trial_intimation_hindi(user.phoneNumber, user.name, link.link);          
            })
        }

        if(message.templateName === "world_meditation_day_greetings"){
            const users = await getUsers(message);
            users.map((user) => {
                world_meditation_day_greetings(user.phoneNumber, user.name);          
            })
        }

        if (message.templateName === "festival_greetings_christmas_new_year"){
            const users = await getUsers(message);
            users.map((user) => {
                festival_greetings_christmas_new_year(user.phoneNumber, user.name);          
            })
        }

        if (message.templateName === "online_free_yoga_trial__joining_details"){
            const users = await getUsers(message);
            const link = await prisma.commonLink.findFirst();
            users.map((user)=>{
                online_free_yoga_trial__joining_details(user.phoneNumber,user.name,link.link);
            })
        }

        if (message.templateName === "class_reminder_free_yoga_for_all") {
            const yogaClass = await prisma.yogaClass.findFirst({
                where: {
                    id: message.payload.classId,
                    isActive: true
                }
            })
            const users = await getUsers(message);
            const link = await prisma.commonLink.findFirst();
            // number, name, link, focusArea
            users.map((user) => {
                // class_reminder(user.phoneNumber, user.name, link.link, yogaClass.focusArea);
                class_reminder_free_yoga_for_all(user.phoneNumber, user.name, yogaClass.focusArea, user.referralCode, user.referralPoints);
                // class_reminder_free_yoga_for_all(user.phoneNumber, user.name, link.link, yogaClass.focusArea);
            })
        }

        if (message.templateName === "subscription_plan_new_year_offer"){
            const users = await getUsers(message);
            users.map((user) => {
                subscription_plan_new_year_offer(user.phoneNumber, user.name);
            })
        }

        if (message.templateName === "yoga_training_1ram"){
            const users = await getUsers(message);
            users.map((user) => {
                yoga_training_1ram(user.phoneNumber, user.name);
            })
        }

        if (message.templateName === "yoga_training_2"){
            const users = await getUsers(message);
            users.map((user) => {
                yoga_training_2(user.phoneNumber, user.name);
            })
        }

        if (message.templateName === "yoga_trail_intimation_") {
            const users = await getUsers(message);
            users.map((user) => {
                yoga_trail_intimation_(user.phoneNumber, user.name);
            })
        }

        if (message.templateName === "yogsaathi_payment_link_share") {
            const users = await getUsers(message);
            users.map((user) => {
                yogsaathi_payment_link_share(user.phoneNumber, user.name);
            })
        }

        if (message.templateName === "yogsaathi_training_brochure_share") {
            const users = await getUsers(message);
            users.map((user) => {
                yogsaathi_training_brochure_share(user.phoneNumber, user.name);
            })
        }

        if (message.templateName === "yoga_trial_enrolment"){
            const users = await getUsers(message);
            users.map((user) => {
                yoga_trial_enrolment(user.phoneNumber, user.name);
            })
        }

        if (message.templateName === "opi"){
            const users = await getUsers(message);
            users.map((user) => {
                opi(user.phoneNumber, user.name);
            })
        }

        if (message.templateName === "yogsaathi_group_access_update"){
            const users = await getUsers(message);
            users.map((user) => {
                yogsaathi_group_access_update(user.phoneNumber, user.name);
            })
        }

        if (message.templateName === "inputs"){
            const users = await getUsers(message);
            users.map((user) => {
                inputs(user.phoneNumber, user.name);
            })
        }
    
        if (message.templateName === "retreat_info_brochure"){
            const users = await getUsers(message);
            users.map((user) => retreat_info_brochure(user.phoneNumber,user.name))
        }

        if (message.templateName === "trial_expiry_notification"){
            const users = await getUsers(message);
            users.map((user) => trial_expiry_notification(user.phoneNumber,user.name))
        }

        if (message.templateName === "session_schedule_notification"){
            const users = await getUsers(message);
            users.map((user) => session_schedule_notification(user.phoneNumber,user.name,message.payload.title,message.payload.speaker,message.payload.date,message.payload.link))
        }
        
        if (message.templateName === "orientation_program__new"){
            const users = await getUsers(message)
            users.map((user)=>{
                const classLink = `${process.env.CLASS_BASE_URL}/class/join?ref=${user.referralCode}_${user.referralPoints}`
                // const classLink = `https://www.youtube.com/`
                orientation_program__new(user.phoneNumber, user.name, message.payload.date, message.payload.time, classLink)
            })
        }

        if (message.templateName === "regularity_key_hindi"){
            const users = await getUsers(message);
            users.map(user => regularity_key_hindi(user.phoneNumber,user.name))
        }

        if (message.templateName === "session_particulars"){
            const users = await getUsers(message);
            users.map(user => session_particulars(user.phoneNumber, user.name, message.payload.date, message.payload.time, message.payload.link, message.payload.topic,message.payload.durationstart, message.payload.durationend))
        }

        if (message.templateName === "subscription_offer_"){
            const users = await getUsers(message);
            users.map(user => subscription_offer_(user.phoneNumber, user.name))
        }

        if (message.templateName === "template_session_20260627022218"){
            const users = await getUsers(message);
            users.map(user => template_session_20260627022218(user.phoneNumber, user.name, message.payload.topic, message.payload.date, message.payload.time, message.payload.duration, message.payload.instructor, message.payload.link))
        }
        
        if (message.templateName === "session_info"){
            const users = await getUsers(message);
            users.map(user => session_info(user.phoneNumber, user.name, message.payload.topic, message.payload.date, message.payload.time, message.payload.duration, message.payload.instructor, message.payload.link))
        }

        if (message.templateName === "confirmation_regn"){
            const users = await getUsers(message);
            users.map(user => confirmation_regn(user.phoneNumber, user.name, message.payload.date, message.payload.time, message.payload.link))
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

async function getUsers(message) {
    const now = new Date();
    const audience = message.targetAudience;

    // 1. Handle Simple Cases
    if (audience === "Leads") return await prisma.lead.findMany();
    if (audience === "Dietician-Leads") {
        const leads = await prisma.dieticianLead.findMany();
        return leads.map(lead => ({
            id: lead.id,
            name: lead.name,
            phoneNumber: lead.mobile,
            email: null
        }));
    }
    if (audience === "ALL") return await prisma.user.findMany();
    if (audience === "ADMIN") return await prisma.user.findMany({ where: { role: "ADMIN" } });
    if (audience === "Dietician-Registrants") {
        const registrations = await prisma.dieticianSessionRegistration.findMany({
            where: { status: "PAID" }
        });
        return registrations.map(reg => ({
            id: reg.id,
            name: reg.name,
            phoneNumber: reg.phone,
            email: reg.email
        }));
    }
    if (audience === "Free-Trial-And-Dietician-Registrants") {
        const paidRegistrations = await prisma.dieticianSessionRegistration.findMany({
            where: { status: "PAID" },
            select: { phone: true, email: true }
        });
        const phones = paidRegistrations.map(r => r.phone);
        const cleanPhones = phones.map(p => p.replace(/^\+91/, ""));
        const emails = paidRegistrations.map(r => r.email);

        const matchUsers = await prisma.user.findMany({
            where: {
                OR: [
                    { phoneNumber: { in: phones } },
                    { phoneNumber: { in: cleanPhones } },
                    { email: { in: emails } }
                ]
            },
            include: {
                subscription: {
                    orderBy: { expiresAt: 'desc' },
                    include: { plan: true }
                }
            }
        });

        return matchUsers.filter(user => 
            user.subscription.some(s => s.plan.isFreeTrial)
        ).map(user => ({
            id: user.id,
            name: user.name,
            phoneNumber: user.phoneNumber,
            email: user.email
        }));
    }

    // 2. Fetch with Subscriptions for Filtering
    const allUsers = await prisma.user.findMany({
        include: {
            subscription: {
                orderBy: { expiresAt: 'desc' }, // Sort by expiration so the best record is on top
                include: { plan: true },
            },
        },
    });

    // Include subscriptions starting up to tomorrow (next day)
    const nextDay = new Date(now);
    nextDay.setDate(nextDay.getDate() + 1);
    nextDay.setHours(23, 59, 59, 999);

    const filteredUsers = allUsers.filter(user => {
        // Always include Admins if that's your intended behavior
        if (user.role === "ADMIN") return true;

        if (user.subscription.length === 0) {
            return audience === "New-Users";
        }

        // ✅ BETTER LOGIC: Check for the most relevant subscription
        // We look for an active paid subscription first.
        const activePaidSub = user.subscription.find(s => !s.plan.isFreeTrial && new Date(s.expiresAt) >= now && new Date(s.startDate) <= nextDay);
        const activeTrialSub = user.subscription.find(s => s.plan.isFreeTrial && new Date(s.expiresAt) >= now && new Date(s.startDate) <= nextDay);

        // Default to the literal latest record if nothing is active
        const latestSub = user.subscription[0];

        switch (audience) {
            case "Active-Free-Trial":
                return !!activeTrialSub;
            case "Inactive-Free-Trial":
                // They have trials, but none are active, and they don't have a paid sub
                return user.subscription.some(s => s.plan.isFreeTrial) && !activeTrialSub && !activePaidSub;
            case "Active-Subscribers":
                return !!activePaidSub;
            case "Inactive-Subscribers":
                // They have paid plans, but none are active
                return user.subscription.some(s => !s.plan.isFreeTrial) && !activePaidSub;
            case "Active-Trial-And-Subscribers":
                return !!activeTrialSub || !!activePaidSub;
            default:
                return false;
        }
    });

    return filteredUsers;
}

function formatTo12Hour(time24) {
    if (!time24) return "";
    const [hours, minutes] = time24.split(":").map(Number);
    const ampm = hours >= 12 ? "PM" : "AM";
    const hours12 = hours % 12 || 12;
    return `${hours12}:${minutes.toString().padStart(2, "0")} ${ampm}`;
}
