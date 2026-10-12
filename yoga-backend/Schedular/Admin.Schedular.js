import { prisma } from '../db/db.js';
import { CronJob } from "cron";
import sendEmail from '../utils/sendMail.js';
import { format } from 'date-fns';

export const orientationJob = new CronJob(
  '0 0 * * *', // every day at midnight (reports on previous day)
  async () => {
    try {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const startOfDay = new Date(yesterday);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(yesterday);
      endOfDay.setHours(23, 59, 59, 999);

      const formattedDate = format(startOfDay, "dd MMM yyyy");

      // 1. Users who registered for Free Trial on the reporting day
      const freeTrialSubscriptions = await prisma.subscription.findMany({
        where: {
          plan: {
            isFreeTrial: true,
          },
          OR: [
            {
              createdAt: {
                gte: startOfDay,
                lte: endOfDay,
              },
            },
            {
              user: {
                createdAt: {
                  gte: startOfDay,
                  lte: endOfDay,
                },
              },
            },
          ],
        },
        include: {
          user: true,
          plan: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      // Deduplicate free trial users by user ID
      const uniqueFreeTrialUsers = [];
      const seenTrialUserIds = new Set();
      for (const sub of freeTrialSubscriptions) {
        if (sub.user && !seenTrialUserIds.has(sub.user.id)) {
          seenTrialUserIds.add(sub.user.id);
          uniqueFreeTrialUsers.push(sub);
        }
      }

      // 2. Users who purchased a subscription plan on the reporting day
      const paidSubscriptions = await prisma.subscription.findMany({
        where: {
          plan: {
            isFreeTrial: false,
          },
          OR: [
            {
              createdAt: {
                gte: startOfDay,
                lte: endOfDay,
              },
            },
            {
              payment: {
                status: "COMPLETED",
                updatedAt: {
                  gte: startOfDay,
                  lte: endOfDay,
                },
              },
            },
          ],
        },
        include: {
          user: true,
          plan: true,
          payment: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      // Deduplicate paid subscriptions by subscription ID
      const uniquePaidSubs = [];
      const seenPaidSubIds = new Set();
      for (const sub of paidSubscriptions) {
        if (!seenPaidSubIds.has(sub.id)) {
          seenPaidSubIds.add(sub.id);
          uniquePaidSubs.push(sub);
        }
      }

      if (uniqueFreeTrialUsers.length === 0 && uniquePaidSubs.length === 0) {
        console.log(`[orientationJob] No new free trials or paid plan purchases on ${formattedDate}.`);
        return;
      }

      const formatSubDate = (d) => {
        if (!d) return "—";
        try {
          return format(new Date(d), "dd MMM yyyy");
        } catch {
          return "—";
        }
      };

      const getFormattedAmount = (sub) => {
        if (sub.payment && typeof sub.payment.amount === "number") {
          const symbol = sub.payment.currency === "USD" ? "$" : "₹";
          return `${symbol}${sub.payment.amount}`;
        }
        if (sub.plan?.inrPrice) {
          return `₹${sub.plan.inrPrice}`;
        }
        return "—";
      };

      // Table Rows: 1. Free Trial Registrations
      const freeTrialRows = uniqueFreeTrialUsers.length > 0
        ? uniqueFreeTrialUsers
            .map(
              (sub, i) => `
                <tr>
                  <td style="padding:8px;border:1px solid #e6eaf2;text-align:center;">${i + 1}</td>
                  <td style="padding:8px;border:1px solid #e6eaf2;font-weight:bold;">${sub.user.name}</td>
                  <td style="padding:8px;border:1px solid #e6eaf2;">${sub.user.phoneNumber || "—"}</td>
                  <td style="padding:8px;border:1px solid #e6eaf2;">
                    ${sub.user.email ? `<a href="mailto:${sub.user.email}" style="color:#0f62fe;text-decoration:none;">${sub.user.email}</a>` : "—"}
                  </td>
                  <td style="padding:8px;border:1px solid #e6eaf2;">${sub.plan?.name || "Free Trial"}</td>
                  <td style="padding:8px;border:1px solid #e6eaf2;">${formatSubDate(sub.startDate)}</td>
                </tr>`
            )
            .join("")
        : `<tr><td colspan="6" style="padding:12px;border:1px solid #e6eaf2;text-align:center;color:#6b7280;font-style:italic;">No new free trial registrations on this day.</td></tr>`;

      // Table Rows: 2. Plan Purchases
      const paidPlanRows = uniquePaidSubs.length > 0
        ? uniquePaidSubs
            .map(
              (sub, i) => `
                <tr>
                  <td style="padding:8px;border:1px solid #e6eaf2;text-align:center;">${i + 1}</td>
                  <td style="padding:8px;border:1px solid #e6eaf2;font-weight:bold;">${sub.user.name}</td>
                  <td style="padding:8px;border:1px solid #e6eaf2;">${sub.user.phoneNumber || "—"}</td>
                  <td style="padding:8px;border:1px solid #e6eaf2;">
                    ${sub.user.email ? `<a href="mailto:${sub.user.email}" style="color:#0f62fe;text-decoration:none;">${sub.user.email}</a>` : "—"}
                  </td>
                  <td style="padding:8px;border:1px solid #e6eaf2;">${sub.plan?.name || "Membership"}</td>
                  <td style="padding:8px;border:1px solid #e6eaf2;font-weight:bold;color:#047857;">${getFormattedAmount(sub)}</td>
                  <td style="padding:8px;border:1px solid #e6eaf2;">${formatSubDate(sub.startDate)}</td>
                </tr>`
            )
            .join("")
        : `<tr><td colspan="7" style="padding:12px;border:1px solid #e6eaf2;text-align:center;color:#6b7280;font-style:italic;">No plan purchases on this day.</td></tr>`;

      const message = `
            <div style="font-family:Arial,Helvetica,sans-serif;background:#f5f7fb;padding:20px;">
              <table role="presentation" cellspacing="0" cellpadding="0" width="100%" style="max-width:750px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e6eaf2;">
                <tr>
                  <td style="background:#0f62fe;padding:22px 20px;color:#fff;">
                    <h2 style="margin:0 0 6px 0;font-size:20px;font-weight:bold;">✨ Daily Summary Report – ${formattedDate}</h2>
                    <p style="margin:0;font-size:13px;opacity:0.95;">
                      Free Trials: <strong>${uniqueFreeTrialUsers.length}</strong> &nbsp;|&nbsp; Plan Purchases: <strong>${uniquePaidSubs.length}</strong>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:22px 20px;">
                    <!-- 1. Free Trial List -->
                    <div style="margin-bottom:28px;">
                      <h3 style="margin:0 0 10px 0;font-size:15px;color:#1e293b;border-bottom:2px solid #e2e8f0;padding-bottom:6px;">
                        🎁 1. Users Registered in Free Trial (${uniqueFreeTrialUsers.length})
                      </h3>
                      <table cellspacing="0" cellpadding="0" width="100%" style="border-collapse:collapse;font-size:13px;">
                        <thead>
                          <tr style="background:#fafbff;">
                            <th style="padding:8px;border:1px solid #e6eaf2;width:35px;">#</th>
                            <th style="padding:8px;border:1px solid #e6eaf2;text-align:left;">Name</th>
                            <th style="padding:8px;border:1px solid #e6eaf2;text-align:left;">Phone</th>
                            <th style="padding:8px;border:1px solid #e6eaf2;text-align:left;">Email</th>
                            <th style="padding:8px;border:1px solid #e6eaf2;text-align:left;">Plan</th>
                            <th style="padding:8px;border:1px solid #e6eaf2;text-align:left;">Start Date</th>
                          </tr>
                        </thead>
                        <tbody>${freeTrialRows}</tbody>
                      </table>
                    </div>

                    <!-- 2. Plan Purchase List -->
                    <div>
                      <h3 style="margin:0 0 10px 0;font-size:15px;color:#1e293b;border-bottom:2px solid #e2e8f0;padding-bottom:6px;">
                        💳 2. Users Who Purchased a Plan (${uniquePaidSubs.length})
                      </h3>
                      <table cellspacing="0" cellpadding="0" width="100%" style="border-collapse:collapse;font-size:13px;">
                        <thead>
                          <tr style="background:#fafbff;">
                            <th style="padding:8px;border:1px solid #e6eaf2;width:35px;">#</th>
                            <th style="padding:8px;border:1px solid #e6eaf2;text-align:left;">Name</th>
                            <th style="padding:8px;border:1px solid #e6eaf2;text-align:left;">Phone</th>
                            <th style="padding:8px;border:1px solid #e6eaf2;text-align:left;">Email</th>
                            <th style="padding:8px;border:1px solid #e6eaf2;text-align:left;">Plan</th>
                            <th style="padding:8px;border:1px solid #e6eaf2;text-align:left;">Amount</th>
                            <th style="padding:8px;border:1px solid #e6eaf2;text-align:left;">Start Date</th>
                          </tr>
                        </thead>
                        <tbody>${paidPlanRows}</tbody>
                      </table>
                    </div>
                  </td>
                </tr>
              </table>
            </div>`;

      const totalCount = uniqueFreeTrialUsers.length + uniquePaidSubs.length;
      await sendEmail(
        "healthy.horizons111@gmail.com",
        `Daily Report on ${formattedDate} (${totalCount} users: ${uniqueFreeTrialUsers.length} Trials, ${uniquePaidSubs.length} Purchases)`,
        message
      );
      console.log(`[orientationJob] Summary email sent for ${formattedDate} with ${uniqueFreeTrialUsers.length} free trials and ${uniquePaidSubs.length} plan purchases.`);
    } catch (error) {
      console.error("[orientationJob] Error running orientation job:", error);
    }
  },
  {
    scheduled: true,
    timezone: "Asia/Kolkata",
  }
);

export const dieticianSessionJob = new CronJob(
  '0 0 * * *', // every day at midnight (reports on previous day)
  async () => {
    try {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const startOfDay = new Date(yesterday);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(yesterday);
      endOfDay.setHours(23, 59, 59, 999);

      const formattedDate = format(startOfDay, "dd MMM yyyy");

      const registrations = await prisma.dieticianSessionRegistration.findMany({
        where: {
          createdAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
          status: "PAID",
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          promocode: true,
          challenge: true,
          amount: true,
        },
      });

      if (registrations.length === 0) {
        console.log(`[dieticianSessionJob] No new dietician registrations on ${formattedDate}.`);
        return;
      }

      const rows = registrations
        .map(
          (r, i) => `
                <tr>
                  <td style="padding:8px;border:1px solid #e6eaf2;text-align:center;">${i + 1}</td>
                  <td style="padding:8px;border:1px solid #e6eaf2;font-weight:bold;">${r.name}</td>
                  <td style="padding:8px;border:1px solid #e6eaf2;">
                    <a href="mailto:${r.email}" style="color:#0f62fe;text-decoration:none;">${r.email}</a>
                  </td>
                  <td style="padding:8px;border:1px solid #e6eaf2;">${r.phone}</td>
                  <td style="padding:8px;border:1px solid #e6eaf2;">${r.challenge || '—'}</td>
                  <td style="padding:8px;border:1px solid #e6eaf2;">₹${r.amount}</td>
                </tr>`
        )
        .join("");

      const message = `
            <div style="font-family:Arial,Helvetica,sans-serif;background:#f5f7fb;padding:20px;">
              <table role="presentation" cellspacing="0" cellpadding="0" width="100%" style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e6eaf2;">
                <tr>
                  <td style="background:#10b981;padding:20px;color:#fff;font-size:18px;font-weight:bold;">
                    🌿 New Dietician Session Registrations on ${formattedDate} (${registrations.length})
                  </td>
                </tr>
                <tr>
                  <td style="padding:20px;">
                    <table cellspacing="0" cellpadding="0" width="100%" style="border-collapse:collapse;">
                      <thead>
                        <tr style="background:#fafbff;">
                          <th style="padding:8px;border:1px solid #e6eaf2;">#</th>
                          <th style="padding:8px;border:1px solid #e6eaf2;text-align:left;">Name</th>
                          <th style="padding:8px;border:1px solid #e6eaf2;text-align:left;">Email</th>
                          <th style="padding:8px;border:1px solid #e6eaf2;text-align:left;">Phone</th>
                          <th style="padding:8px;border:1px solid #e6eaf2;text-align:left;">Challenge</th>
                          <th style="padding:8px;border:1px solid #e6eaf2;text-align:left;">Amount</th>
                        </tr>
                      </thead>
                      <tbody>${rows}</tbody>
                    </table>
                  </td>
                </tr>
              </table>
            </div>`;

      await sendEmail("healthy.horizons111@gmail.com", `New dietician registrations on ${formattedDate} (${registrations.length})`, message);
      console.log(`[dieticianSessionJob] Summary email sent for ${formattedDate} with ${registrations.length} registrations.`);
    } catch (error) {
      console.error("[dieticianSessionJob] Error running dietician session job:", error);
    }
  },
  {
    scheduled: true,
    timezone: "Asia/Kolkata",
  }
);

export const yogaSessionJob = new CronJob(
  '0 0 * * *', // every day at midnight (reports on previous day)
  async () => {
    try {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const startOfDay = new Date(yesterday);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(yesterday);
      endOfDay.setHours(23, 59, 59, 999);

      const formattedDate = format(startOfDay, "dd MMM yyyy");

      const registrations = await prisma.yogaSessionRegistration.findMany({
        where: {
          createdAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
          status: "PAID",
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          promocode: true,
          challenge: true,
          amount: true,
        },
      });

      if (registrations.length === 0) {
        console.log(`[yogaSessionJob] No new yoga session registrations on ${formattedDate}.`);
        return;
      }

      const rows = registrations
        .map(
          (r, i) => `
                <tr>
                  <td style="padding:8px;border:1px solid #e6eaf2;text-align:center;">${i + 1}</td>
                  <td style="padding:8px;border:1px solid #e6eaf2;font-weight:bold;">${r.name}</td>
                  <td style="padding:8px;border:1px solid #e6eaf2;">
                    <a href="mailto:${r.email}" style="color:#0f62fe;text-decoration:none;">${r.email}</a>
                  </td>
                  <td style="padding:8px;border:1px solid #e6eaf2;">${r.phone}</td>
                  <td style="padding:8px;border:1px solid #e6eaf2;">${r.challenge || '—'}</td>
                  <td style="padding:8px;border:1px solid #e6eaf2;">₹${r.amount}</td>
                </tr>`
        )
        .join("");

      const message = `
            <div style="font-family:Arial,Helvetica,sans-serif;background:#f5f7fb;padding:20px;">
              <table role="presentation" cellspacing="0" cellpadding="0" width="100%" style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e6eaf2;">
                <tr>
                  <td style="background:#10b981;padding:20px;color:#fff;font-size:18px;font-weight:bold;">
                    🧘 New Yoga Session Registrations on ${formattedDate} (${registrations.length})
                  </td>
                </tr>
                <tr>
                  <td style="padding:20px;">
                    <table cellspacing="0" cellpadding="0" width="100%" style="border-collapse:collapse;">
                      <thead>
                        <tr style="background:#fafbff;">
                          <th style="padding:8px;border:1px solid #e6eaf2;">#</th>
                          <th style="padding:8px;border:1px solid #e6eaf2;text-align:left;">Name</th>
                          <th style="padding:8px;border:1px solid #e6eaf2;text-align:left;">Email</th>
                          <th style="padding:8px;border:1px solid #e6eaf2;text-align:left;">Phone</th>
                          <th style="padding:8px;border:1px solid #e6eaf2;text-align:left;">Challenge</th>
                          <th style="padding:8px;border:1px solid #e6eaf2;text-align:left;">Amount</th>
                        </tr>
                      </thead>
                      <tbody>${rows}</tbody>
                    </table>
                  </td>
                </tr>
              </table>
            </div>`;

      await sendEmail("healthy.horizons111@gmail.com", `New yoga session registrations on ${formattedDate} (${registrations.length})`, message);
      console.log(`[yogaSessionJob] Summary email sent for ${formattedDate} with ${registrations.length} registrations.`);
    } catch (error) {
      console.error("[yogaSessionJob] Error running yoga session job:", error);
    }
  },
  {
    scheduled: true,
    timezone: "Asia/Kolkata",
  }
);

