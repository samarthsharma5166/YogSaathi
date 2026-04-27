import { CronJob } from 'cron';
import { prisma } from '../db/db.js';
import { trial_expiry_notification } from '../utils/messages.js';

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
