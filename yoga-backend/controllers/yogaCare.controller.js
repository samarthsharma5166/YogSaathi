import crypto from "crypto";
import { prisma } from "../db/db.js";
import { instance as razorpay } from "../index.js";
import { YOGA_CARE_PLANS, YOGA_CARE_PROGRAMS } from "../config/yogaCarePlans.config.js";
import { isIndianNumber } from "../utils/PhoneChecker.js";
import { generateYogaCareInvoice } from "../utils/generateInvoice.js";
import { invoice_subscription_plan } from "../utils/messages.js";


// Create pending registration & Razorpay Order
export const createYogaCareRegistration = async (req, res) => {
  try {
    const { programId, participantType, planId, name, email, phone } = req.body;

    if (!programId || !participantType || !planId || !name || !email || !phone) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Determine region based on phone number (as done in subscription checkout)
    const isIndian = isIndianNumber(phone);
    const region = isIndian ? "india" : "international";

    // Validate inputs
    const programName = YOGA_CARE_PROGRAMS[programId];
    if (!programName) {
      return res.status(400).json({ error: "Invalid program selected" });
    }

    const regionPlans = YOGA_CARE_PLANS[region];
    if (!regionPlans) {
      return res.status(400).json({ error: "Invalid region plans" });
    }

    const groupPlans = regionPlans[participantType];
    if (!groupPlans) {
      return res.status(400).json({ error: "Invalid participant type" });
    }

    const selectedPlan = groupPlans[planId];
    if (!selectedPlan) {
      return res.status(400).json({ error: "Invalid plan duration" });
    }

    const { amount, currency, duration } = selectedPlan;

    // Check if user has any active YogaCare plan
    const activePlan = await prisma.yogaCareRegistration.findFirst({
      where: {
        phone: phone,
        status: "PAID",
        expiresAt: {
          gt: new Date()
        }
      }
    });

    if (activePlan) {
      return res.status(400).json({ 
        error: `You already have an active subscription for '${activePlan.programName}' valid until ${new Date(activePlan.expiresAt).toLocaleDateString()}.` 
      });
    }

    // Create a Razorpay order
    // Note: Razorpay accepts amount in paise/cents
    const razorpayOrder = await razorpay.orders.create({
      amount: amount * 100,
      currency: currency,
      receipt: `receipt_yogacare_${Date.now()}`,
    });

    // Create pending registration in database (Completely separate from User table)
    const registration = await prisma.yogaCareRegistration.create({
      data: {
        programId,
        programName,
        participantType,
        region,
        planId,
        duration,
        amount,
        currency,
        customerName: name,
        email,
        phone,
        orderId: razorpayOrder.id,
        status: "PENDING",
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
    console.error("Error creating YogaCare registration:", error);
    res.status(500).json({ error: "Failed to initialize registration order" });
  }
};

// Helper function to fulfill payment (shared by API and Webhook)
export const fulfillYogaCarePayment = async (razorpay_order_id, razorpay_payment_id, razorpay_signature) => {
  const registration = await prisma.yogaCareRegistration.findUnique({
    where: { orderId: razorpay_order_id },
  });

  if (!registration) {
    throw new Error("YogaCare registration record not found for order " + razorpay_order_id);
  }

  // Idempotency check: if already completed, do nothing
  if (registration.status === "PAID") {
    console.log(`YogaCare payment for order ${razorpay_order_id} is already completed.`);
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
  const updatedRegistration = await prisma.yogaCareRegistration.update({
    where: { id: registration.id },
    data: {
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      status: "PAID",
      expiresAt: expiresAt
    },
  });

  // Calculate Invoice Number
  const shortId = updatedRegistration.id.split("-")[0]; // take first segment of UUID
  const year = new Date().getFullYear().toString().slice(-2); // e.g. "26"
  const invoiceNo = `YS${year}${shortId.toUpperCase()}`;

  // Generate Invoice
  const invoicePath = await generateYogaCareInvoice({
    invoiceNo: invoiceNo,
    dateOfIssue: new Date().toLocaleDateString(),
    companyEmail: "healthy.horizons111@gmail.com",
    website: "www.yogsaathi.com",
    customerName: updatedRegistration.customerName,
    customerEmail: updatedRegistration.email,
    programStart: startDate.toLocaleDateString(),
    programEnd: expiresAt.toLocaleDateString(),
    duration: updatedRegistration.duration,
    description: `${updatedRegistration.programName} – Online Yoga`,
    amount: updatedRegistration.amount,
    amountType: updatedRegistration.currency
  });

  // Update registration record with invoice filename
  const finalRegistration = await prisma.yogaCareRegistration.update({
    where: { id: updatedRegistration.id },
    data: {
      invoice: invoicePath.fileName
    }
  });

  // Send WhatsApp confirmation message with invoice link
  try {
    await invoice_subscription_plan(updatedRegistration.phone, updatedRegistration.customerName, invoicePath.fileName);
  } catch (msgErr) {
    console.error("Failed to send WhatsApp subscription invoice notification:", msgErr);
  }

  console.log(`Successfully completed YogaCare registration and sent invoice for ID: ${finalRegistration.id}`);
  return {
    registration: finalRegistration,
    alreadyCompleted: false,
  };
};

// Verify payment API (frontend call)
export const verifyYogaCarePayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: "Missing required payment fields" });
    }

    // Check if already completed
    const registration = await prisma.yogaCareRegistration.findUnique({
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
    const result = await fulfillYogaCarePayment(razorpay_order_id, razorpay_payment_id, razorpay_signature);

    res.status(200).json({
      success: true,
      message: "Payment verified and registration completed successfully",
      registration: result.registration,
    });
  } catch (error) {
    console.error("Error verifying YogaCare payment:", error);
    res.status(500).json({ error: "Failed to verify payment" });
  }
};

// GET registrations list (Admin)
export const getYogaCareRegistrations = async (req, res) => {
  try {
    const registrations = await prisma.yogaCareRegistration.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(registrations);
  } catch (error) {
    console.error("Error fetching registrations:", error);
    res.status(500).json({ error: "Failed to fetch registrations" });
  }
};

// Download registrations as CSV (Admin)
import { Parser } from "json2csv";

export const downloadYogaCareRegistrations = async (req, res) => {
  try {
    const registrations = await prisma.yogaCareRegistration.findMany({
      orderBy: { createdAt: "desc" },
    });

    const fields = [
      "customerName",
      "phone",
      "email",
      "programName",
      "participantType",
      "region",
      "planId",
      "amount",
      "currency",
      "status",
      "orderId",
      "paymentId",
      "createdAt",
    ];

    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(registrations);

    res.header("Content-Type", "text/csv");
    res.attachment("yogacare-registrations.csv");
    res.send(csv);
  } catch (error) {
    console.error("Error exporting registrations:", error);
    res.status(500).json({ error: "Failed to export registrations" });
  }
};
