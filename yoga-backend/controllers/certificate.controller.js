import { prisma } from "../db/db.js";
import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Milestones configuration
const MILESTONE_CONFIG = [
  {
    tier: "bronze",
    days: 50,
    title: "Bronze Certificate",
    bannerTitle: "BRONZE",
    subtitle: "50 Days of Yoga",
    badge: "Bronze",
    color: "#b45309",
    imageFile: "certificate_bronze_50.jpg",
  },
  {
    tier: "silver",
    days: 100,
    title: "Silver Certificate",
    bannerTitle: "SILVER",
    subtitle: "100 Days of Yoga",
    badge: "Silver",
    color: "#475569",
    imageFile: "certificate_silver_100.jpg",
  },
  {
    tier: "gold",
    days: 200,
    title: "Gold Certificate",
    bannerTitle: "GOLD",
    subtitle: "200 Days of Yoga",
    badge: "Gold",
    color: "#d97706",
    imageFile: "certificate_gold_200.jpg",
  },
  {
    tier: "platinum",
    days: 300,
    title: "Platinum Certificate",
    bannerTitle: "PLATINUM",
    subtitle: "300 Days of Yoga",
    badge: "Platinum",
    color: "#0284c7",
    imageFile: "certificate_platinum_300.jpg",
  },
  {
    tier: "diamond",
    days: 500,
    title: "Diamond Certificate",
    bannerTitle: "DIAMOND",
    subtitle: "500 Days of Yoga",
    badge: "Diamond",
    color: "#4f46e5",
    imageFile: "certificate_diamond_500.jpg",
  },
];

// Helper to format date nicely: e.g. "15 October 2024"
function formatDateForCertificate(dateObj) {
  if (!dateObj) return "";
  const d = new Date(dateObj);
  if (isNaN(d.getTime())) return "";
  const day = d.getDate();
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return `${day} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

// Helper to find a user by phone variants
async function findUserByPhone(inputPhone) {
  if (!inputPhone) return null;
  const raw = String(inputPhone).trim();
  const cleanDigits = raw.replace(/[^0-9]/g, "");

  if (!cleanDigits) return null;

  const phoneVariants = [
    raw,
    `+${cleanDigits}`,
    cleanDigits,
  ];

  if (cleanDigits.length === 10) {
    phoneVariants.push(`+91${cleanDigits}`);
  }
  if (cleanDigits.length >= 10) {
    const last10 = cleanDigits.slice(-10);
    phoneVariants.push(`+91${last10}`);
    phoneVariants.push(last10);
  }

  // Remove duplicates
  const uniqueVariants = Array.from(new Set(phoneVariants));

  // Find user matching any of these variants
  let user = await prisma.user.findFirst({
    where: {
      OR: [
        { phoneNumber: { in: uniqueVariants } },
        ...(cleanDigits.length >= 10 ? [{ phoneNumber: { endsWith: cleanDigits.slice(-10) } }] : [])
      ]
    },
    include: {
      subscription: {
        include: { plan: true },
        orderBy: { createdAt: "desc" },
      },
      payments: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  return user;
}

// Helper to check if a user is a paid member
function isUserPaid(user) {
  if (!user) return false;
  if (user.role === "ADMIN") return true;

  // Has any subscription where plan is not a free trial
  const hasPaidSubscription = user.subscription?.some(
    (sub) => !sub.plan?.isFreeTrial
  );
  if (hasPaidSubscription) return true;

  // Has any completed or verified payment
  const hasCompletedPayment = user.payments?.some(
    (p) => p.status === "COMPLETED" || p.verified === true
  );
  if (hasCompletedPayment) return true;

  return false;
}

// Helper to calculate milestone details for a user
async function getUserMilestoneDetails(user) {
  const attendanceRecords = await prisma.attendance.findMany({
    where: {
      userId: user.id,
      attended: true,
    },
    include: {
      yogaClass: true,
    },
    orderBy: [
      { yogaClass: { date: "asc" } },
      { attendedAt: "asc" },
      { createdAt: "asc" },
    ],
  });

  // Deduplicate by calendar date (YYYY-MM-DD in local/UTC)
  const dateMap = new Map();
  for (const record of attendanceRecords) {
    const dateVal =
      record.yogaClass?.date || record.attendedAt || record.createdAt;
    if (!dateVal) continue;
    const d = new Date(dateVal);
    const dateStr = d.toISOString().split("T")[0];
    if (!dateMap.has(dateStr)) {
      dateMap.set(dateStr, d);
    }
  }

  const attendedDates = Array.from(dateMap.values()).sort(
    (a, b) => a.getTime() - b.getTime()
  );
  const totalAttendanceDays = attendedDates.length;

  const milestones = MILESTONE_CONFIG.map((m) => {
    const isCompleted = totalAttendanceDays >= m.days;
    const achievedDate = isCompleted ? attendedDates[m.days - 1] : null;
    return {
      tier: m.tier,
      days: m.days,
      title: m.title,
      bannerTitle: m.bannerTitle,
      subtitle: m.subtitle,
      badge: m.badge,
      color: m.color,
      imageFile: m.imageFile,
      imageUrl: `/certificates/${m.imageFile}?v=3.0`,
      isCompleted,
      achievedDate: achievedDate ? achievedDate.toISOString() : null,
      formattedDate: achievedDate
        ? formatDateForCertificate(achievedDate)
        : null,
      daysRemaining: isCompleted ? 0 : m.days - totalAttendanceDays,
      progressPercent: Math.min(
        100,
        Math.round((totalAttendanceDays / m.days) * 100)
      ),
    };
  });

  return {
    totalAttendanceDays,
    milestones,
    hasAnyUnlocked: milestones.some((m) => m.isCompleted),
  };
}

/**
 * Check if a user with phone number has unlocked any milestone certificates.
 * POST /api/certificate/check or GET /api/certificate/milestones?phoneNumber=...
 */
export async function checkMilestones(req, res) {
  try {
    const phoneNumber =
      req.body?.phoneNumber ||
      req.body?.phone ||
      req.query?.phoneNumber ||
      req.query?.phone;

    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        error: "PHONE_REQUIRED",
        message: "Please enter your phone number to check your certificates.",
      });
    }

    const user = await findUserByPhone(phoneNumber);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "USER_NOT_FOUND",
        message:
          "No account found with this phone number. Please check the number or contact YogSaathi support.",
      });
    }

    const isPaid = isUserPaid(user);

    if (!isPaid) {
      return res.status(403).json({
        success: false,
        error: "NOT_PAID_MEMBER",
        isPaid: false,
        userName: user.name,
        message:
          "Milestone certificates are exclusively available to our paid members. Please subscribe to a plan to unlock your milestone certificates!",
      });
    }

    const { totalAttendanceDays, milestones, hasAnyUnlocked } =
      await getUserMilestoneDetails(user);

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        phoneNumber: user.phoneNumber,
        isPaid: true,
      },
      totalAttendanceDays,
      milestones,
      hasAnyUnlocked,
    });
  } catch (error) {
    console.error("Error checking certificates:", error);
    return res.status(500).json({
      success: false,
      error: "SERVER_ERROR",
      message: "An unexpected error occurred while checking certificates.",
    });
  }
}

/**
 * Generate and download certificate as PDF.
 * GET /api/certificate/download-pdf?phoneNumber=...&tier=silver
 */
export async function downloadCertificatePdf(req, res) {
  try {
    const phoneNumber = req.query?.phoneNumber || req.query?.phone;
    const tier = (req.query?.tier || "bronze").toLowerCase();

    if (!phoneNumber) {
      return res.status(400).json({ error: "Phone number is required" });
    }

    const user = await findUserByPhone(phoneNumber);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPaid = isUserPaid(user);
    if (!isPaid) {
      return res.status(403).json({
        error: "Certificates are only available to paid members.",
      });
    }

    const { totalAttendanceDays, milestones } =
      await getUserMilestoneDetails(user);

    const milestone = milestones.find((m) => m.tier === tier);
    if (!milestone) {
      return res.status(400).json({ error: "Invalid milestone tier" });
    }

    if (!milestone.isCompleted) {
      return res.status(403).json({
        error: `This milestone requires ${milestone.days} days of attendance. You have completed ${totalAttendanceDays} days.`,
      });
    }

    // Locate certificate background image
    const templatePath = path.join(
      __dirname,
      "..",
      "certificates",
      milestone.imageFile
    );

    if (!fs.existsSync(templatePath)) {
      return res
        .status(500)
        .json({ error: "Certificate template file not found on server" });
    }

    // Create PDF document matching the exact 2048x1374 Full HD aspect ratio in pure landscape
    // Note: PDFKit expects [shortSide, longSide] when layout: "landscape" is specified, yielding width: 2048, height: 1374
    const doc = new PDFDocument({
      size: [1374, 2048],
      layout: "landscape",
      margins: { top: 0, bottom: 0, left: 0, right: 0 },
    });

    const safeName = (user.name || "Student").replace(/[^a-zA-Z0-9_-]/g, "_");
    const filename = `YogSaathi_Certificate_${milestone.tier.toUpperCase()}_${safeName}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename}"`
    );
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    doc.pipe(res);

    // 1. Draw Full HD certificate background (2048 x 1374)
    doc.image(templatePath, 0, 0, { width: 2048, height: 1374 });

    // 2. Format name: limit length and size appropriately
    const displayName = (user.name || "").trim() || "Student";
    let fontSize = 70;
    let yPos = 782;
    if (displayName.length > 28) {
      fontSize = 50;
      yPos = 802;
    } else if (displayName.length > 20) {
      fontSize = 58;
      yPos = 794;
    }

    doc.font("Times-Bold").fontSize(fontSize).fillColor("#1e293b");
    doc.text(displayName, 0, yPos, {
      width: 2048,
      align: "center",
    });

    // 3. Draw Date on the "Date: _________" line
    const displayDate = milestone.formattedDate || formatDateForCertificate(new Date());
    doc.font("Times-Roman").fontSize(34).fillColor("#334155");
    doc.text(displayDate, 650, 1166, {
      width: 255,
      align: "center",
    });

    doc.end();
  } catch (error) {
    console.error("Error generating certificate PDF:", error);
    if (!res.headersSent) {
      return res.status(500).json({ error: "Failed to generate certificate PDF" });
    }
  }
}
