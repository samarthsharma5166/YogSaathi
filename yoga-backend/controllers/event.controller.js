
import crypto from "crypto";
import { generateInvoice } from "../utils/generateInvoice.js";
import { prisma } from "../db/db.js";
import { instance as razorpay } from "../index.js";
import { payment_confirmation } from "../utils/messages.js";
import { Parser } from "json2csv";
import sendEmail from "../utils/sendMail.js";

/* ─── Plan base prices (INR) ──────────────────────────────────── */
const planCosts = {
  TWIN_SHARING_SUPERIOR: 16000,
  SINGLE_OCCUPANCY_SUPERIOR: 22000,
  TWIN_SHARING_JACUZZI: 28000,
  SINGLE_OCCUPANCY_JACUZZI: 48000,
};

/* ─── Early bird discounts per plan (INR) ─────────────────────── */
const earlyBirdDiscounts = {
  TWIN_SHARING_SUPERIOR: 800,
  SINGLE_OCCUPANCY_SUPERIOR: 1000,
  TWIN_SHARING_JACUZZI: 1200,
  SINGLE_OCCUPANCY_JACUZZI: 1500,
};

/* ─── Early bird deadline: 15 April 2026 23:59:59 IST ────────── */
const EARLY_BIRD_DEADLINE = new Date("2026-04-20T18:29:59Z");
const isEarlyBirdActive = () => new Date() <= EARLY_BIRD_DEADLINE;

/* ──────────────────────────────────────────────────────────────
   POST /event/register
   Body: { participants: [...], plan: "TWIN_SHARING_SUPERIOR" }
   ─────────────────────────────────────────────────────────────── */
export const createEventRegistration = async (req, res) => {
  try {
    const { participants, plan, promoApplied, promoCode } = req.body;

    // ── Validate plan ──
    const baseCost = planCosts[plan];
    if (!baseCost) {
      return res.status(400).json({ error: "Invalid plan selected" });
    }

    // ── Validate participants array ──
    if (!Array.isArray(participants) || participants.length === 0) {
      return res.status(400).json({ error: "At least one participant is required" });
    }
    if (participants.length > 2) {
      return res.status(400).json({ error: "Maximum 2 participants allowed" });
    }

    // ── Validate promo code ──
    const validPromoCodes = ["PSU", "AAMANTRAN", "DISC"];
    const isPromoApplied = promoApplied && promoCode && validPromoCodes.includes(promoCode.trim().toUpperCase());

    // ── Calculate per-person amount (with early bird if applicable) ──
    const earlyBirdApplied = isEarlyBirdActive();
    const discount = earlyBirdApplied ? (earlyBirdDiscounts[plan] ?? 0) : 0;
    let perPersonAmount = baseCost - discount;          // INR

    if (isPromoApplied) {
      if (plan === "SINGLE_OCCUPANCY_SUPERIOR") {
        perPersonAmount -= baseCost * 0.10;
      } else if (plan === "TWIN_SHARING_SUPERIOR") {
        if (participants.length === 1) {
          perPersonAmount -= 1600;
        } else if (participants.length === 2) {
          perPersonAmount -= 2400;
        }
      }
    }

    const totalAmount = perPersonAmount * participants.length; // INR

    // ── Create a single Razorpay order for the total ──
    const order = await razorpay.orders.create({
      amount: totalAmount * 100, // paise
      currency: "INR",
      receipt: `receipt_event_${Date.now()}`,
    });

    // ── Create one EventRegistration row per participant ──
    // All share the same orderId so we can link them on verify
    const registrationPromises = participants.map((p) =>
      prisma.eventRegistration.create({
        data: {
          fullName: p.fullName,
          gender: p.gender,
          age: Number(p.age),
          mobileNumber: p.mobileNumber,
          email: p.email,
          city: p.city,
          tShirtSize: p.tShirtSize,
          plan,
          orderId: order.id,
          earlyBirdApplied,
          amountPaid: perPersonAmount,
        },
      })
    );

    const registrations = await Promise.all(registrationPromises);

    // Return the first registration ID as the primary reference
    const keyId = process.env.KEY_ID;
    res.status(201).json({
      order,
      eventRegistrationId: registrations[0].id,  // primary (for verify)
      allRegistrationIds: registrations.map((r) => r.id),
      keyId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

/* ──────────────────────────────────────────────────────────────
   POST /event/verify
   ─────────────────────────────────────────────────────────────── */
export const fulfillEventPayment = async (razorpay_order_id, razorpay_payment_id) => {
  // 1. Fetch all registrations sharing the orderId
  const registrations = await prisma.eventRegistration.findMany({
    where: { orderId: razorpay_order_id },
    orderBy: { createdAt: "asc" }
  });

  if (registrations.length === 0) {
    throw new Error("No registrations found for this order ID");
  }

  // 2. Check if the payment has already been processed (idempotency check)
  const isAlreadyPaid = registrations.every(reg => reg.status === "PAID");
  if (isAlreadyPaid) {
    console.log(`Event payment for order ${razorpay_order_id} is already completed.`);
    const primaryReg = registrations.find(r => r.invoice) || registrations[0];
    return {
      invoicePath: primaryReg.invoice,
      alreadyCompleted: true
    };
  }

  // 3. Mark ALL participants sharing the same orderId as PAID
  await prisma.eventRegistration.updateMany({
    where: { orderId: razorpay_order_id },
    data: {
      paymentId: razorpay_payment_id,
      status: "PAID",
    },
  });

  // Re-fetch primary registration (which is the first one in the array)
  const primaryReg = registrations[0];

  // ── Use discounted amount stored in DB ──
  const amount = primaryReg.amountPaid ?? planCosts[primaryReg.plan];

  // ── Count total participants for this order ──
  const participantCount = registrations.length;

  // ── Generate invoice for the primary participant ──
  const invoicePath = await generateInvoice(primaryReg, amount, participantCount);

  // ── Persist invoice path on the primary participant's registration ──
  await prisma.eventRegistration.update({
    where: { id: primaryReg.id },
    data: { invoice: invoicePath },
  });

  // ── Confirmation email & WhatsApp for the primary participant ──
  const earlyBirdNote = primaryReg.earlyBirdApplied
    ? `<p><b>Early Bird Discount Applied:</b> ₹${
        (planCosts[primaryReg.plan] ?? 0) - amount
      } off per person.</p>`
    : "";

  const subject =
    "Confirmation – YogSaathi × Panambi Yoga Retreat, Rishikesh";
  const message = `
    <p>Dear ${primaryReg.fullName},</p>
    <p>Greetings from YogSaathi.</p>
    <p>Thank you for registering for the YogSaathi × Panambi Yoga Retreat at Rishikesh for ${participantCount} participant(s) and for making the total payment of ₹${amount * participantCount}. We are pleased to confirm your participation in the retreat.</p>
    ${earlyBirdNote}
    <p><b>Booking Details</b></p>
    <p>Room Category: ${primaryReg.plan}</p>
    <p>Retreat Dates: 12.03.26 to 15.03.26</p>
    <p><b>Check-in &amp; Departure</b></p>
    <p>Check-in: 12.03.26, 1 PM</p>
    <p>Departure: 15.03.26, 11.30 AM</p>
    <p><b>Venue Address</b></p>
    <p>Panambi Resort &amp; Spa<br>Cheela, Rishikesh, Uttarakhand<br>(A unit of Panambi Vacations Private Limited)</p>
    <p><b>Important Note</b></p>
    <p>Please carry loose pyjama/pants (preferably black or blue) for yoga practice.<br>A Yoga Mat and a Retreat T-Shirt will be provided by us.</p>
    <p>For any assistance related to travel or location, please feel free to contact:<br>
    Mr. Neeraj – 98916 98547<br>Mr. Sanjay – 99717 14091</p>
    <p>You may also write to us at yogsaathi.26@gmail.com</p>
    <p>Warm Regards</p>
    <p>Team YogSaathi</p>
  `;

  await payment_confirmation(
    primaryReg.mobileNumber,
    primaryReg.fullName,
    amount
  );
  await sendEmail(primaryReg.email, subject, message);

  return {
    invoicePath,
    alreadyCompleted: false
  };
};

export const verifyEventPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    // Check if already paid
    const registrations = await prisma.eventRegistration.findMany({
      where: { orderId: razorpay_order_id }
    });
    const isAlreadyPaid = registrations.length > 0 && registrations.every(reg => reg.status === "PAID");
    if (isAlreadyPaid) {
      const primaryReg = registrations.find(r => r.invoice) || registrations[0];
      return res.status(200).json({
        message: "Payment verified successfully",
        invoicePath: primaryReg.invoice,
      });
    }

    // ── Verify Razorpay signature ──
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    console.log(razorpay_signature, expectedSignature);
    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return res.status(400).json({ error: "Invalid signature" });
    }

    // Call fulfill helper
    const result = await fulfillEventPayment(razorpay_order_id, razorpay_payment_id);

    res.status(200).json({
      message: "Payment verified successfully",
      invoicePath: result.invoicePath,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

/* ──────────────────────────────────────────────────────────────
   GET /event/users  (admin)
   ─────────────────────────────────────────────────────────────── */
export const getRetreatUsers = async (req, res) => {
  try {
    const users = await prisma.eventRegistration.findMany({
      where: { status: "PAID" },
    });
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

/* ──────────────────────────────────────────────────────────────
   GET /event/download  (admin)
   ─────────────────────────────────────────────────────────────── */
export const downloadRetreatUsers = async (req, res) => {
  try {
    const users = await prisma.eventRegistration.findMany({
      where: { status: "PAID" },
    });

    const fields = [
      "fullName",
      "gender",
      "age",
      "mobileNumber",
      "email",
      "city",
      "tShirtSize",
      "plan",
      "earlyBirdApplied",
      "amountPaid",
      "status",
    ];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(users);

    res.header("Content-Type", "text/csv");
    res.attachment("retreat-users.csv");
    res.send(csv);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
