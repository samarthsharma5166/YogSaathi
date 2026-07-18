import crypto from "crypto";
import { prisma } from "../db/db.js";
import { instance as razorpay } from "../index.js";
import { confirmation_regn, session_particulars } from "../utils/messages.js";

// Helper to get or create dietician config
const getOrCreateConfig = async () => {
  let config = await prisma.dieticianSessionConfig.findUnique({
    where: { id: "dietician-config" },
  });

  if (!config) {
    config = await prisma.dieticianSessionConfig.create({
      data: {
        id: "dietician-config",
        price: 149,
        slotsLeft: 10,
      },
    });
  }
  return config;
};

// ── GET /api/dietician/config ──
export const getDieticianConfig = async (req, res) => {
  try {
    const config = await getOrCreateConfig();
    res.status(200).json(config);
  } catch (error) {
    console.error("Error getting dietician config:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// ── POST /api/dietician/config ──
export const updateDieticianConfig = async (req, res) => {
  try {
    const { price, slotsLeft } = req.body;
    
    // Ensure config exists
    await getOrCreateConfig();

    const config = await prisma.dieticianSessionConfig.update({
      where: { id: "dietician-config" },
      data: {
        price: price !== undefined ? Number(price) : undefined,
        slotsLeft: slotsLeft !== undefined ? Number(slotsLeft) : undefined,
      },
    });

    res.status(200).json(config);
  } catch (error) {
    console.error("Error updating dietician config:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// ── POST /api/dietician/register ──
export const createRegistration = async (req, res) => {
  try {
    const { name, phone, email, promocode, challenge } = req.body;

    if (!name || !phone || !email) {
      return res.status(400).json({ error: "Name, phone, and email are required" });
    }

    const config = await getOrCreateConfig();
    let price = config.price;

    // Apply promo code YSDISC if provided
    if (promocode && promocode.trim().toUpperCase() === "YSDISC") {
      price = 49;
    }

    // Create a Razorpay order
    const order = await razorpay.orders.create({
      amount: price * 100, // paise
      currency: "INR",
      receipt: `receipt_dietician_${Date.now()}`,
    });

    // Create a pending registration record
    const registration = await prisma.dieticianSessionRegistration.create({
      data: {
        name,
        phone,
        email,
        promocode,
        challenge,
        amount: price,
        orderId: order.id,
        status: "PENDING",
      },
    });

    res.status(201).json({
      order,
      registrationId: registration.id,
      keyId: process.env.KEY_ID,
    });
  } catch (error) {
    console.error("Error creating registration order:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const fulfillDieticianPayment = async (razorpay_order_id, razorpay_payment_id, razorpay_signature) => {
  // 1. Fetch the registration by orderId
  const registration = await prisma.dieticianSessionRegistration.findUnique({
    where: { orderId: razorpay_order_id }
  });

  if (!registration) {
    throw new Error("Dietician session registration not found");
  }

  // 2. Check if already paid (idempotency check)
  if (registration.status === "PAID") {
    console.log(`Dietician payment for order ${razorpay_order_id} is already completed.`);
    return {
      registration,
      alreadyCompleted: true
    };
  }

  // 3. Mark registration as PAID
  const updatedRegistration = await prisma.dieticianSessionRegistration.update({
    where: { id: registration.id },
    data: {
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      status: "PAID",
    },
  });

  // 4. Decrement slots left if greater than 0
  const config = await getOrCreateConfig();
  if (config.slotsLeft > 0) {
    await prisma.dieticianSessionConfig.update({
      where: { id: "dietician-config" },
      data: {
        slotsLeft: {
          decrement: 1,
        },
      },
    });
  }

  // 5. Send confirmation message via WhatsApp
  // await confirmation_regn(
  //   updatedRegistration.phone,
  //   updatedRegistration.name,
  //   "Weight Loss & Sustainable Fat Reduction",
  //   "19.07.2026",
  //   "11:30 AM",
  // );
  const link = "https://meet.google.com/wdi-jmez-nan"
  await session_particulars(
    updatedRegistration.phone,
    updatedRegistration.name,
    "19.07.2026", "11:30 AM", link, "Weight Loss & Sustainable Fat Reduction", "60", "65"
  );

  return {
    registration: updatedRegistration,
    alreadyCompleted: false
  };
};

// ── POST /api/dietician/verify ──
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: "Missing required payment fields" });
    }

    // Check if already paid
    const registration = await prisma.dieticianSessionRegistration.findUnique({
      where: { orderId: razorpay_order_id }
    });

    if (registration && registration.status === "PAID") {
      return res.status(200).json({
        message: "Payment verified and confirmation sent successfully",
        registration,
      });
    }

    // Verify Razorpay signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;
    if (!isAuthentic) {
      return res.status(400).json({ error: "Invalid signature" });
    }

    // Call fulfill helper
    const result = await fulfillDieticianPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature);

    res.status(200).json({
      message: "Payment verified and confirmation sent successfully",
      registration: result.registration,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// ── GET /api/dietician/registrations (Admin) ──
export const getRegistrations = async (req, res) => {
  try {
    const registrations = await prisma.dieticianSessionRegistration.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(registrations);
  } catch (error) {
    console.error("Error fetching registrations:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// ── GET /api/dietician/registrations/download (Admin) ──
import { Parser } from "json2csv";

export const downloadRegistrations = async (req, res) => {
  try {
    const registrations = await prisma.dieticianSessionRegistration.findMany({
      orderBy: { createdAt: "desc" },
    });

    const fields = [
      "name",
      "phone",
      "email",
      "promocode",
      "challenge",
      "amount",
      "orderId",
      "paymentId",
      "status",
      "createdAt",
    ];

    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(registrations);

    res.header("Content-Type", "text/csv");
    res.attachment("dietician-session-registrations.csv");
    res.send(csv);
  } catch (error) {
    console.error("Error downloading registrations:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// ── POST /api/dietician/validate-promo ──
export const validatePromoCode = async (req, res) => {
  try {
    const { promocode } = req.body;
    const config = await getOrCreateConfig();

    if (promocode && promocode.trim().toUpperCase() === "YSDISC") {
      return res.status(200).json({ isValid: true, price: 49 });
    }

    return res.status(200).json({ isValid: false, price: config.price });
  } catch (error) {
    console.error("Error validating promo code:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
