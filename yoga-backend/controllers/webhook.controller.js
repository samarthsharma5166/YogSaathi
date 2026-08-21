import crypto from "crypto";
import { prisma } from "../db/db.js";
import { fulfillSubscription } from "./order.controller.js";
import { fulfillEventPayment } from "./event.controller.js";
import { fulfillDieticianPayment } from "./dietician.controller.js";
import { fulfillYogaSessionPayment } from "./yogaSession.controller.js";
import { fulfillYogaCarePayment } from "./yogaCare.controller.js";


export const handleRazorpayWebhook = async (req, res) => {
  try {
    const signature = req.headers["x-razorpay-signature"];
    if (!signature) {
      console.warn("Webhook received without signature header.");
      return res.status(400).json({ error: "Missing signature" });
    }

    if (!req.rawBody) {
      console.warn("Webhook received without raw body buffer.");
      return res.status(400).json({ error: "Missing raw body" });
    }

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.KEY_SECRET;
    if (!webhookSecret) {
      console.error("Razorpay webhook secret / key secret is not configured.");
      return res.status(500).json({ error: "Server configuration error" });
    }

    // Verify webhook signature
    const shasum = crypto.createHmac("sha256", webhookSecret);
    shasum.update(req.rawBody);
    const digest = shasum.digest("hex");

    if (digest !== signature) {
      console.warn("Webhook signature mismatch.");
      return res.status(400).json({ error: "Signature verification failed" });
    }

    const event = req.body.event;
    console.log(`Razorpay Webhook event received: ${event}`);

    // We only process successful payment events
    if (event !== "order.paid" && event !== "payment.captured") {
      console.log(`Ignoring unsupported webhook event: ${event}`);
      return res.status(200).json({ status: "ignored", event });
    }

    let orderId = null;
    let paymentId = null;

    if (req.body.payload && req.body.payload.order && req.body.payload.order.entity) {
      orderId = req.body.payload.order.entity.id;
    }
    if (req.body.payload && req.body.payload.payment && req.body.payload.payment.entity) {
      paymentId = req.body.payload.payment.entity.id;
      if (!orderId) {
        orderId = req.body.payload.payment.entity.order_id;
      }
    }

    if (!orderId) {
      console.warn("Webhook payload does not contain an order_id.");
      return res.status(400).json({ error: "Missing order_id in payload" });
    }

    console.log(`Processing webhook for order ID: ${orderId}, payment ID: ${paymentId}`);

    // 1. Check if orderId belongs to a Plan subscription
    const planPayment = await prisma.payment.findUnique({
      where: { razorpay_order_id: orderId }
    });
    if (planPayment) {
      console.log(`Found matching Plan payment for order ID: ${orderId}. Fulfilling subscription.`);
      const result = await fulfillSubscription(orderId, paymentId, null);
      return res.status(200).json({
        status: "ok",
        type: "subscription",
        alreadyCompleted: result.alreadyCompleted
      });
    }

    // 2. Check if orderId belongs to an Event/Retreat registration
    const eventReg = await prisma.eventRegistration.findFirst({
      where: { orderId: orderId }
    });
    if (eventReg) {
      console.log(`Found matching Event registrations for order ID: ${orderId}. Fulfilling event registration.`);
      const result = await fulfillEventPayment(orderId, paymentId);
      return res.status(200).json({
        status: "ok",
        type: "event",
        alreadyCompleted: result.alreadyCompleted
      });
    }

    // 3. Check if orderId belongs to a Dietician Masterclass session
    const dieticianReg = await prisma.dieticianSessionRegistration.findUnique({
      where: { orderId: orderId }
    });
    if (dieticianReg) {
      console.log(`Found matching Dietician session registration for order ID: ${orderId}. Fulfilling session registration.`);
      const result = await fulfillDieticianPayment(orderId, paymentId, null);
      return res.status(200).json({
        status: "ok",
        type: "dietician",
        alreadyCompleted: result.alreadyCompleted
      });
    }

    // 4. Check if orderId belongs to a Yoga Masterclass session
    const yogaReg = await prisma.yogaSessionRegistration.findUnique({
      where: { orderId: orderId }
    });
    if (yogaReg) {
      console.log(`Found matching Yoga session registration for order ID: ${orderId}. Fulfilling session registration.`);
      const result = await fulfillYogaSessionPayment(orderId, paymentId, null);
      return res.status(200).json({
        status: "ok",
        type: "yogaSession",
        alreadyCompleted: result.alreadyCompleted
      });
    }

    // 5. Check if orderId belongs to a YogaCare registration
    const yogaCareReg = await prisma.yogaCareRegistration.findUnique({
      where: { orderId: orderId }
    });
    if (yogaCareReg) {
      console.log(`Found matching YogaCare registration for order ID: ${orderId}. Fulfilling registration.`);
      const result = await fulfillYogaCarePayment(orderId, paymentId, null);
      return res.status(200).json({
        status: "ok",
        type: "yogacare",
        alreadyCompleted: result.alreadyCompleted
      });
    }

    console.warn(`Order ID: ${orderId} does not match any pending payment records in the database.`);
    return res.status(200).json({
      status: "ignored",
      reason: "order_id_not_found_in_db"
    });


  } catch (error) {
    console.error("Error processing Razorpay webhook:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
