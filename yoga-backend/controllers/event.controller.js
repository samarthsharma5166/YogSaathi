
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
    const { participants, plan } = req.body;

    // ── Validate plan ──
    const baseCost = planCosts[plan];
    if (!baseCost) {
      return res.status(400).json({ error: "Invalid plan selected" });
    }

    // ── Validate participants array ──
    if (!Array.isArray(participants) || participants.length === 0) {
      return res.status(400).json({ error: "At least one participant is required" });
    }

    // ── Calculate per-person amount (with early bird if applicable) ──
    const earlyBirdApplied = isEarlyBirdActive();
    const discount = earlyBirdApplied ? (earlyBirdDiscounts[plan] ?? 0) : 0;
    const perPersonAmount = baseCost - discount;          // INR
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
export const verifyEventPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      eventRegistrationId,
    } = req.body;

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

    // ── Find the primary registration ──
    const primaryReg = await prisma.eventRegistration.findUnique({
      where: { id: eventRegistrationId },
    });

    if (!primaryReg) {
      return res.status(404).json({ error: "Registration not found" });
    }

    // ── Mark ALL participants sharing the same orderId as PAID ──
    await prisma.eventRegistration.updateMany({
      where: { orderId: razorpay_order_id },
      data: {
        paymentId: razorpay_payment_id,
        status: "PAID",
      },
    });

    // ── Re-fetch the primary to get updated data ──
    const eventRegistration = await prisma.eventRegistration.findUnique({
      where: { id: eventRegistrationId },
    });

    // ── Use discounted amount stored in DB ──
    const amount = eventRegistration.amountPaid ?? planCosts[eventRegistration.plan];

    // ── Generate invoice for the primary participant ──
    const invoicePath = await generateInvoice(eventRegistration, amount);

    // ── Persist invoice path ──
    await prisma.eventRegistration.update({
      where: { id: eventRegistrationId },
      data: { invoice: invoicePath },
    });

    // ── Confirmation email & WhatsApp for the primary participant ──
    const earlyBirdNote = eventRegistration.earlyBirdApplied
      ? `<p><b>Early Bird Discount Applied:</b> ₹${
          (planCosts[eventRegistration.plan] ?? 0) - amount
        } off per person.</p>`
      : "";

    const subject =
      "Confirmation – YogSaathi × Panambi Yoga Retreat, Rishikesh";
    const message = `
      <p>Dear ${eventRegistration.fullName},</p>
      <p>Greetings from YogSaathi.</p>
      <p>Thank you for registering for the YogSaathi × Panambi Yoga Retreat at Rishikesh and for making the payment of ₹${amount} per person. We are pleased to confirm your participation in the retreat.</p>
      ${earlyBirdNote}
      <p><b>Booking Details</b></p>
      <p>Room Category: ${eventRegistration.plan}</p>
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
      eventRegistration.mobileNumber,
      eventRegistration.fullName,
      amount
    );
    await sendEmail(eventRegistration.email, subject, message);

    res.status(200).json({
      message: "Payment verified successfully",
      invoicePath,
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
