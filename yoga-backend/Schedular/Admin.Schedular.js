import { prisma } from '../db/db.js';
import { CronJob } from "cron";
import sendEmail from '../utils/sendMail.js';

export const orientationJob = new CronJob(
  '0 0 * * *',        // every day at midnight
  async () => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const users = await prisma.user.findMany({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay
        }
      },
      select: {
        id: true,
        name: true,
        email: true
      }
    });

    if (users.length === 0) {
      console.log("No new users today.");
      return;
    }

    const rows = users
      .map((u, i) => `
              <tr>
                <td style="padding:8px;border:1px solid #e6eaf2;text-align:center;">${i + 1}</td>
                <td style="padding:8px;border:1px solid #e6eaf2;font-weight:bold;">${u.name}</td>
                <td style="padding:8px;border:1px solid #e6eaf2;">
                  <a href="mailto:${u.email}" style="color:#0f62fe;text-decoration:none;">${u.email}</a>
                </td>
              </tr>`)
      .join("");

    const message = `
          <div style="font-family:Arial,Helvetica,sans-serif;background:#f5f7fb;padding:20px;">
            <table role="presentation" cellspacing="0" cellpadding="0" width="100%" style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e6eaf2;">
              <tr>
                <td style="background:#0f62fe;padding:20px;color:#fff;font-size:18px;font-weight:bold;">
                  ✨ New Users Joined Today (${users.length})
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
                      </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                  </table>
                </td>
              </tr>
            </table>
          </div>`;

    await sendEmail("healthy.horizons111@gmail.com", "New users joined today", message);
  },
  null,           // onComplete
  true,           // start immediately
  'Asia/Kolkata'  // ← timezone fix
);

export const dieticianSessionJob = new CronJob(
  '0 0 * * *',        // every day at midnight
  async () => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const registrations = await prisma.dieticianSessionRegistration.findMany({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay
        },
        status: "PAID"
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        promocode: true,
        challenge: true,
        amount: true
      }
    });

    if (registrations.length === 0) {
      console.log("No new dietician registrations today.");
      return;
    }

    const rows = registrations
      .map((r, i) => `
              <tr>
                <td style="padding:8px;border:1px solid #e6eaf2;text-align:center;">${i + 1}</td>
                <td style="padding:8px;border:1px solid #e6eaf2;font-weight:bold;">${r.name}</td>
                <td style="padding:8px;border:1px solid #e6eaf2;">
                  <a href="mailto:${r.email}" style="color:#0f62fe;text-decoration:none;">${r.email}</a>
                </td>
                <td style="padding:8px;border:1px solid #e6eaf2;">${r.phone}</td>
                <td style="padding:8px;border:1px solid #e6eaf2;">${r.challenge || '—'}</td>
                <td style="padding:8px;border:1px solid #e6eaf2;">₹${r.amount}</td>
              </tr>`)
      .join("");

    const message = `
          <div style="font-family:Arial,Helvetica,sans-serif;background:#f5f7fb;padding:20px;">
            <table role="presentation" cellspacing="0" cellpadding="0" width="100%" style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e6eaf2;">
              <tr>
                <td style="background:#10b981;padding:20px;color:#fff;font-size:18px;font-weight:bold;">
                  🌿 New Dietician Session Registrations Today (${registrations.length})
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

    await sendEmail("healthy.horizons111@gmail.com", "New dietician registrations today", message);
  },
  null,           // onComplete
  true,           // start immediately
  'Asia/Kolkata'  // timezone
);
