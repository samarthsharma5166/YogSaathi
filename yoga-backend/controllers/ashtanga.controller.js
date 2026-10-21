import crypto from "crypto";
import { prisma } from "../db/db.js";
import { instance as razorpay } from "../index.js";
import { ASHTANGA_PLANS } from "../config/ashtangaPlans.config.js";
import { generateAshtangaInvoice } from "../utils/generateInvoice.js";
import { invoice_yogacare_trial_class, invoice_yogacare_plan } from "../utils/messages.js";
import { Parser } from "json2csv";

// Create pending registration & Razorpay Order
export const createAshtangaRegistration = async (req, res) => {
  try {
    const {
      customerName,
      dateOfBirth,
      countryOfResidence,
      citizenship,
      occupation,
      jobType,
      email,
      phone,
      timezone,
      sessionType,
      hasHealthLimitation,
      healthDetails,
      planId,
      termsAccepted
    } = req.body;

    if (!customerName || !email || !phone || !sessionType || !planId) {
      return res.status(400).json({ error: "Missing required registration details" });
    }

    if (!termsAccepted) {
      return res.status(400).json({ error: "You must accept the terms of service and consent before proceeding." });
    }

    const sessionGroup = ASHTANGA_PLANS[sessionType];
    if (!sessionGroup) {
      return res.status(400).json({ error: "Invalid session type selected" });
    }

    const selectedPlan = sessionGroup.plans[planId];
    if (!selectedPlan) {
      return res.status(400).json({ error: "Invalid plan duration selected" });
    }

    const { amount, currency, duration, classesCount, name: planName } = selectedPlan;

    // Create a Razorpay order in USD (amount in cents)
    const razorpayOrder = await razorpay.orders.create({
      amount: amount * 100,
      currency: currency || "USD",
      receipt: `receipt_ashtanga_${Date.now()}`,
    });

    // Create pending registration in database
    const registration = await prisma.ashtangaRegistration.create({
      data: {
        customerName: customerName.trim(),
        dateOfBirth: dateOfBirth ? dateOfBirth.trim() : null,
        countryOfResidence: countryOfResidence ? countryOfResidence.trim() : null,
        citizenship: citizenship ? citizenship.trim() : null,
        occupation: occupation ? occupation.trim() : null,
        jobType: jobType || null,
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        timezone: timezone ? timezone.trim() : null,
        sessionType,
        hasHealthLimitation: hasHealthLimitation || "no",
        healthDetails: healthDetails ? healthDetails.trim() : null,
        planId,
        planName,
        duration,
        classesCount,
        amount,
        currency: currency || "USD",
        orderId: razorpayOrder.id,
        status: "PENDING",
        termsAccepted: true,
        termsAcceptedAt: new Date(),
      },
    });

    res.status(201).json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.KEY_ID,
      registrationId: registration.id,
    });
  } catch (error) {
    console.error("Error creating Ashtanga registration:", error);
    res.status(500).json({ error: "Failed to initialize registration order" });
  }
};

// Helper function to fulfill payment (shared by API and Webhook)
export const fulfillAshtangaPayment = async (razorpay_order_id, razorpay_payment_id, razorpay_signature) => {
  const registration = await prisma.ashtangaRegistration.findUnique({
    where: { orderId: razorpay_order_id },
  });

  if (!registration) {
    throw new Error("Ashtanga registration record not found for order " + razorpay_order_id);
  }

  // Idempotency check: if already completed, do nothing
  if (registration.status === "PAID") {
    console.log(`Ashtanga payment for order ${razorpay_order_id} is already completed.`);
    return {
      registration,
      alreadyCompleted: true,
    };
  }

  // Start date is tomorrow (always starts from next day)
  const startDate = new Date();
  startDate.setDate(startDate.getDate() + 1);

  // Calculate expiresAt date starting from tomorrow
  const expiresAt = new Date(startDate);
  if (registration.duration === 0) {
    // Trial class expires in 2 days from start date
    expiresAt.setDate(expiresAt.getDate() + 2);
  } else {
    expiresAt.setMonth(expiresAt.getMonth() + registration.duration);
  }

  // Update status to PAID
  const updatedRegistration = await prisma.ashtangaRegistration.update({
    where: { id: registration.id },
    data: {
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      status: "PAID",
      startDate: startDate,
      expiresAt: expiresAt,
    },
  });

  // Calculate Invoice Number
  const shortId = updatedRegistration.id.split("-")[0];
  const year = new Date().getFullYear().toString().slice(-2);
  const invoiceNo = `YSASH${year}${shortId.toUpperCase()}`;

  // Generate Invoice
  const invoicePath = await generateAshtangaInvoice({
    invoiceNo: invoiceNo,
    dateOfIssue: new Date().toLocaleDateString(),
    companyEmail: "healthy.horizons111@gmail.com",
    website: "www.yogsaathi.com",
    customerName: updatedRegistration.customerName,
    customerEmail: updatedRegistration.email,
    customerPhone: updatedRegistration.phone,
    countryOfResidence: updatedRegistration.countryOfResidence,
    sessionType: updatedRegistration.sessionType,
    planName: updatedRegistration.planName,
    programStart: startDate.toLocaleDateString(),
    programEnd: expiresAt.toLocaleDateString(),
    duration: updatedRegistration.duration,
    classesCount: updatedRegistration.classesCount,
    amount: updatedRegistration.amount,
    amountType: updatedRegistration.currency || "USD",
  });

  // Update registration record with invoice filename
  const finalRegistration = await prisma.ashtangaRegistration.update({
    where: { id: updatedRegistration.id },
    data: {
      invoice: invoicePath.fileName,
    },
  });

  // Send WhatsApp confirmation message with invoice link
  try {
    const baseInvoiceUrl = process.env.BASE_URL_INVOICE || "https://yogsaathi.com";
    const invoiceLink = `${baseInvoiceUrl}/api/invoices/${invoicePath.fileName}`;
    const cleanPhone = updatedRegistration.phone ? updatedRegistration.phone.replace(/[^0-9]/g, "") : "";

    if (updatedRegistration.duration === 0) {
      await invoice_yogacare_trial_class(
        cleanPhone,
        updatedRegistration.customerName,
        invoiceLink
      );
      console.log(`Sent invoice_yogacare_trial_class to ${cleanPhone}`);
    } else {
      const durationText =
        updatedRegistration.duration === 1
          ? "Monthly"
          : updatedRegistration.duration === 3
          ? "Quarterly"
          : `${updatedRegistration.duration} Months`;

      await invoice_yogacare_plan(
        cleanPhone,
        updatedRegistration.customerName,
        durationText,
        invoiceLink
      );
      console.log(`Sent invoice_yogacare_plan (${durationText}) to ${cleanPhone}`);
    }
  } catch (msgErr) {
    console.error("Failed to send WhatsApp invoice notification:", msgErr.response?.data || msgErr.message);
  }

  console.log(`Successfully completed Ashtanga registration and sent invoice for ID: ${finalRegistration.id}`);
  return {
    registration: finalRegistration,
    alreadyCompleted: false,
  };
};

// Verify payment API (frontend call)
export const verifyAshtangaPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: "Missing required payment fields" });
    }

    // Check if already completed
    const registration = await prisma.ashtangaRegistration.findUnique({
      where: { orderId: razorpay_order_id },
    });

    if (registration && registration.status === "PAID") {
      return res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        registration,
      });
    }

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;
    if (!isAuthentic) {
      return res.status(400).json({ error: "Invalid signature" });
    }

    // Fulfill payment
    const result = await fulfillAshtangaPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature);

    res.status(200).json({
      success: true,
      message: "Payment verified and registration completed successfully",
      registration: result.registration,
    });
  } catch (error) {
    console.error("Error verifying Ashtanga payment:", error);
    res.status(500).json({ error: "Failed to verify payment" });
  }
};

// GET registrations list (Admin)
export const getAshtangaRegistrations = async (req, res) => {
  try {
    const registrations = await prisma.ashtangaRegistration.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(registrations);
  } catch (error) {
    console.error("Error fetching Ashtanga registrations:", error);
    res.status(500).json({ error: "Failed to fetch registrations" });
  }
};

// Download registrations as CSV (Admin)
export const downloadAshtangaRegistrations = async (req, res) => {
  try {
    const registrations = await prisma.ashtangaRegistration.findMany({
      orderBy: { createdAt: "desc" },
    });

    const fields = [
      "customerName",
      "email",
      "phone",
      "dateOfBirth",
      "countryOfResidence",
      "citizenship",
      "occupation",
      "jobType",
      "timezone",
      "sessionType",
      "hasHealthLimitation",
      "healthDetails",
      "planName",
      "duration",
      "classesCount",
      "amount",
      "currency",
      "status",
      "orderId",
      "paymentId",
      "invoice",
      "createdAt",
    ];

    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(registrations);

    res.header("Content-Type", "text/csv");
    res.attachment("ashtanga-registrations.csv");
    res.send(csv);
  } catch (error) {
    console.error("Error exporting Ashtanga registrations:", error);
    res.status(500).json({ error: "Failed to export registrations" });
  }
};
