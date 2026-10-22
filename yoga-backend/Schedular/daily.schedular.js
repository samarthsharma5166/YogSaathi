import { CronJob } from 'cron';
import { prisma } from '../db/db.js';
import {
    trial_expiry_notification,
    subscription_offer_day_english,
    subscription_offer_day_hindi,
    subscription_info_english,
    subscription_info_hindi
} from '../utils/messages.js';
import { differenceInCalendarDays } from 'date-fns';

export const dailyJob = new CronJob('0 9 * * *', async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const checkDays = [1, 3, 5];

    for (const days of checkDays) {
        // Target date exactly `days` ahead
        const targetDate = new Date(today);
        targetDate.setDate(targetDate.getDate() + days);

        // Next day to use as upper bound
        const nextDay = new Date(targetDate);
        nextDay.setDate(nextDay.getDate() + 1);

        const subscriptions = await prisma.subscription.findMany({
            where: {
                plan: {
                    isFreeTrial: true
                },
                expiresAt: {
                    gte: targetDate,
                    lt: nextDay
                },
                status: "active"
            },
            include: {
                user: true
            }
        });

        for (const sub of subscriptions) {
            if (sub.user) {
                trial_expiry_notification(sub.user.phoneNumber, sub.user.name);
            }
        }
    }
}, {
    scheduled: true,
    timezone: "Asia/Kolkata"
});

const TRIAL_OFFER_CONFIG = {
    5:{
        image:"https://cdn.chatmitra.com/images/WhatsApp%20Image%202026-09-29%20at%2014.28.12_1790672410729.jpeg",
        days:"5th day"
    },
    7: {
        image: "https://cdn.chatmitra.com/images/WhatsApp%20Image%202026-09-22%20at%2010.51.04_1790138624023.jpeg",
        days: "7th day",
    },
    9: {
        image: "https://cdn.chatmitra.com/images/WhatsApp%20Image%202026-09-22%20at%2010.51.05_1790138758463.jpeg",
        days: "9th day",
    },
    12: {
        image: "https://cdn.chatmitra.com/images/WhatsApp%20Image%202026-09-22%20at%2010.51.05%20(1)_1790138871776.jpeg",
        days: "12th day",
    },
    14: {
        image: "https://cdn.chatmitra.com/images/WhatsApp%20Image%202026-09-29%20at%2014.28.15%20(1)_1790675291435.jpeg",
        days: "14th day",
    },
};

export const freeTrialOfferJob = new CronJob('0 10 * * *', async () => {
    try {
        const now = new Date();

        // 1. Fetch all active free trial subscriptions with user details
        const activeTrials = await prisma.subscription.findMany({
            where: {
                status: "active",
                expiresAt: { gte: now },
                plan: {
                    isFreeTrial: true,
                },
            },
            include: {
                user: true,
                plan: true,
            },
        });

        for (const sub of activeTrials) {
            try {
                if (!sub.user || !sub.user.phoneNumber || !sub.startDate) continue;

                // 2. Calculate day of free trial from start date (Day 1 = startDate)
                const diffDays = differenceInCalendarDays(now, new Date(sub.startDate)) + 1;
                const offer = TRIAL_OFFER_CONFIG[diffDays];

                // 3. Send offer template if diffDays is 5, 7, 9, 12, or 14
                if (offer) {
                    await subscription_offer_day_english(
                        sub.user.phoneNumber,
                        sub.user.name,
                        offer.image,
                        offer.days
                    );
                    await new Promise((resolve) => setTimeout(resolve, 100)); // Rate-limit buffer
                }
            } catch (userErr) {
                console.error(`[freeTrialOfferJob] Error sending message to ${sub.user?.phoneNumber}:`, userErr.message);
            }
        }
    } catch (err) {
        console.error("[freeTrialOfferJob] Error in free trial offer job:", err);
    }
}, {
    scheduled: true,
    timezone: "Asia/Kolkata",
});



const TRIAL_HINDI_OFFER_CONFIG = {
    5: {
        image: "https://cdn.chatmitra.com/images/WhatsApp%20Image%202026-09-29%20at%2014.28.12%20(1)_1790672714577.jpeg",
        days: "5th day"
    },
    7: {
        image: "https://cdn.chatmitra.com/images/WhatsApp%20Image%202026-09-29%20at%2014.28.13_1790672812510.jpeg",
        days: "7th day",
    },
    9: {
        image: "https://cdn.chatmitra.com/images/WhatsApp%20Image%202026-09-29%20at%2014.28.14_1790672864873.jpeg",
        days: "9th day",
    },
    12: {
        image: "https://cdn.chatmitra.com/images/WhatsApp%20Image%202026-09-29%20at%2014.28.15_1790672911214.jpeg",
        days: "12th day",
    },
    14: {
        image: "https://cdn.chatmitra.com/images/WhatsApp%20Image%202026-09-29%20at%2014.28.16_1790672956599.jpeg",
        days: "14th day",
    },
};



export const freeTrialOfferHindiJob = new CronJob('0 11 * * *', async () => {
    try {
        const now = new Date();

        // 1. Fetch all active free trial subscriptions with user details
        const activeTrials = await prisma.subscription.findMany({
            where: {
                status: "active",
                expiresAt: { gte: now },
                plan: {
                    isFreeTrial: true,
                },
            },
            include: {
                user: true,
                plan: true,
            },
        });

        for (const sub of activeTrials) {
            try {
                if (!sub.user || !sub.user.phoneNumber || !sub.startDate) continue;

                // 2. Calculate day of free trial from start date (Day 1 = startDate)
                const diffDays = differenceInCalendarDays(now, new Date(sub.startDate)) + 1;
                const offer = TRIAL_HINDI_OFFER_CONFIG[diffDays];

                // 3. Send offer template if diffDays is 5, 7, 9, 12, or 14
                if (offer) {
                    await subscription_offer_day_hindi(
                        sub.user.phoneNumber,
                        sub.user.name,
                        offer.image,
                        offer.days
                    );
                    await new Promise((resolve) => setTimeout(resolve, 100)); // Rate-limit buffer
                }
            } catch (userErr) {
                console.error(`[freeTrialOfferHindiJob] Error sending message to ${sub.user?.phoneNumber}:`, userErr.message);
            }
        }
    } catch (err) {
        console.error("[freeTrialOfferHindiJob] Error in free trial offer Hindi job:", err);
    }
}, {
    scheduled: true,
    timezone: "Asia/Kolkata",
});



export const trialExpiryNotificationJob = new CronJob('0 17 * * *', async () => {
    try {
        const now = new Date();

        // 1. Fetch all active free trial subscriptions with user details
        const activeTrials = await prisma.subscription.findMany({
            where: {
                status: "active",
                expiresAt: { gte: now },
                plan: {
                    isFreeTrial: true,
                },
            },
            include: {
                user: true,
                plan: true,
            },
        });

        for (const sub of activeTrials) {
            try {
                if (!sub.user || !sub.user.phoneNumber || !sub.startDate) continue;

                // 2. Calculate day of free trial from start date (Day 1 = startDate)
                const diffDays = differenceInCalendarDays(now, new Date(sub.startDate)) + 1;

                // 3. Send expiry notification on 10th and 13th days
                if (diffDays === 10 || diffDays === 13) {
                    await trial_expiry_notification(
                        sub.user.phoneNumber,
                        sub.user.name
                    );
                    await new Promise((resolve) => setTimeout(resolve, 100)); // Rate-limit buffer
                }
            } catch (userErr) {
                console.error(`[trialExpiryNotificationJob] Error sending message to ${sub.user?.phoneNumber}:`, userErr.message);
            }
        }
    } catch (err) {
        console.error("[trialExpiryNotificationJob] Error in trial expiry notification job:", err);
    }
}, {
    scheduled: true,
    timezone: "Asia/Kolkata",
});


// =========================================================================
// 📌 PAID SUBSCRIPTION EXPIRY NOTIFICATIONS (30, 15, 7, and 3 Days Before)
// =========================================================================

const SUBSCRIPTION_EXPIRY_NOTIFICATION_DAYS = [30, 15, 7, 3];

/**
 * Normalizes any timestamp to midnight UTC corresponding to the exact calendar date in Asia/Kolkata (IST).
 * Eliminates timezone drift and hour/minute variance across any server environment (UTC, US, etc.).
 */
export function getISTCalendarDate(date = new Date()) {
    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "numeric",
        day: "numeric"
    }).formatToParts(new Date(date));
    const y = parts.find(p => p.type === "year").value;
    const m = parts.find(p => p.type === "month").value.padStart(2, "0");
    const d = parts.find(p => p.type === "day").value.padStart(2, "0");
    return new Date(`${y}-${m}-${d}T00:00:00.000Z`);
}

/**
 * Formats a Date into standard dd/MM/yyyy string in Asia/Kolkata timezone.
 */
export function formatISTDate(date) {
    return new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    }).format(new Date(date));
}

/**
 * Shared executor for sending subscription expiry reminders.
 * Queries only users who purchased a plan (non-free-trial active subscriptions).
 */
export async function processSubscriptionExpiryReminders(sendTemplateFn, jobName) {
    try {
        const now = new Date();
        const todayIST = getISTCalendarDate(now);

        // Fetch all active paid plan subscriptions with user details
        const activePaidSubscriptions = await prisma.subscription.findMany({
            where: {
                status: "active",
                expiresAt: { gte: now },
                plan: {
                    isFreeTrial: false,
                },
            },
            include: {
                user: true,
                plan: true,
            },
        });

        // Group by user and pick the subscription with the latest expiresAt (handles renewals gracefully)
        const userLatestSubMap = new Map();
        for (const sub of activePaidSubscriptions) {
            if (!sub.user || !sub.user.phoneNumber || !sub.expiresAt) continue;
            const existing = userLatestSubMap.get(sub.userId);
            if (!existing || new Date(sub.expiresAt) > new Date(existing.expiresAt)) {
                userLatestSubMap.set(sub.userId, sub);
            }
        }

        for (const sub of userLatestSubMap.values()) {
            try {
                const expiryIST = getISTCalendarDate(sub.expiresAt);
                const diffDays = differenceInCalendarDays(expiryIST, todayIST);

                if (SUBSCRIPTION_EXPIRY_NOTIFICATION_DAYS.includes(diffDays)) {
                    const formattedDate = formatISTDate(sub.expiresAt);
                    await sendTemplateFn(
                        sub.user.phoneNumber,
                        sub.user.name || "Member",
                        formattedDate
                    );
                    console.log(`[${jobName}] Sent ${diffDays}-day reminder to ${sub.user.phoneNumber} (expiry: ${formattedDate})`);
                    await new Promise((resolve) => setTimeout(resolve, 150)); // Rate-limit buffer
                }
            } catch (userErr) {
                console.error(`[${jobName}] Error sending reminder to ${sub.user?.phoneNumber}:`, userErr.message);
            }
        }
    } catch (err) {
        console.error(`[${jobName}] Error in job execution:`, err);
    }
}

/**
 * 5:30 PM IST (17:30) -> subscription_info_english
 * Sent 30, 15, 7, and 3 days before subscription end to users who purchased a plan
 */
export const subscriptionInfoEnglishJob = new CronJob('30 17 * * *', async () => {
    await processSubscriptionExpiryReminders(subscription_info_english, "subscriptionInfoEnglishJob");
}, {
    scheduled: true,
    timezone: "Asia/Kolkata",
});

/**
 * 6:30 PM IST (18:30) -> subscription_info_hindi
 * Sent 30, 15, 7, and 3 days before subscription end to users who purchased a plan
 */
export const subscriptionInfoHindiJob = new CronJob('30 18 * * *', async () => {
    await processSubscriptionExpiryReminders(subscription_info_hindi, "subscriptionInfoHindiJob");
}, {
    scheduled: true,
    timezone: "Asia/Kolkata",
});


