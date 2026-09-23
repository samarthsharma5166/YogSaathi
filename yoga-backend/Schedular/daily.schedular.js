import { CronJob } from 'cron';
import { prisma } from '../db/db.js';
import { trial_expiry_notification, subscription_offer_day_english } from '../utils/messages.js';
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
        image: "https://cdn.chatmitra.com/images/logo%20YogSaathi_1785751511046.png",
        days: "14th day",
    },
};

export const freeTrialOfferJob = new CronJob('0 20 * * *', async () => {
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
                if (!sub.user || !sub.user.phoneNumber) continue;

                // 2. Calculate remaining days in free trial
                const daysLeft = differenceInCalendarDays(new Date(sub.expiresAt), now);
                const offer = TRIAL_OFFER_CONFIG[daysLeft];

                // 3. Send offer template if daysLeft is 7, 9, 12, or 14
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

