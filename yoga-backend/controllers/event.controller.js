
import Razorpay from "razorpay";
import crypto from "crypto";
import { generateInvoice } from "../utils/generateInvoice.js";
import { prisma } from "../db/db.js";
import {instance as razorpay} from '../index.js'
import { payment_confirmation } from "../utils/messages.js";
import { Parser } from "json2csv";

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

const planCosts = {
  TWIN_SHARING_SUPERIOR: 16000,
  SINGLE_OCCUPANCY_SUPERIOR: 22000,
  TWIN_SHARING_JACUZZI: 28000,
  SINGLE_OCCUPANCY_JACUZZI: 48000,
};

export const createEventRegistration = async (req, res) => {
  try {
    const {
      fullName,
      gender,
      age,
      mobileNumber,
      email,
      city,
      tShirtSize,
      plan,
    } = req.body;

    const amount = planCosts[plan];
    if (!amount) {
      return res.status(400).json({ error: "Invalid plan selected" });
    }

    const options = {
      amount: amount * 100, // amount in the smallest currency unit
      currency: "INR",
      receipt: `receipt_event_${new Date().getTime()}`,
    };

    const order = await razorpay.orders.create(options);

    const eventRegistration = await prisma.eventRegistration.create({
      data: {
        fullName,
        gender,
        age:Number(age),
        mobileNumber,
        email,
        city,
        tShirtSize,
        plan,
        orderId: order.id,
      },
    });
    const keyId= process.env.KEY_ID;

    res.status(201).json({
      order,
      eventRegistrationId: eventRegistration.id,
      keyId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const verifyEventPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      eventRegistrationId,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.KEY_SECRET)
      .update(body.toString())
      .digest("hex");

      console.log(razorpay_signature,expectedSignature)
    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      const eventRegistration = await prisma.eventRegistration.update({
        where: { id: eventRegistrationId },
        data: {
          paymentId: razorpay_payment_id,
          status: "PAID",
        },
      });

      // Generate Invoice
      const invoicePath = await generateInvoice(eventRegistration);

      await payment_confirmation(eventRegistration.mobileNumber,eventRegistration.fullName,planCosts[eventRegistration.plan])

      await prisma.eventRegistration.update({
        where: { id: eventRegistrationId },
        data: {
          invoice: invoicePath,
        },
      });

      res.status(200).json({
        message: "Payment verified successfully",
        invoicePath: invoicePath
      });
    } else {
      res.status(400).json({ error: "Invalid signature" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const getRetreatUsers = async (req, res) => {
  try {
    const users = await prisma.eventRegistration.findMany({
      where: {
        status: "PAID",
      },
    });
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const downloadRetreatUsers = async (req, res) => {
  try {
    const users = await prisma.eventRegistration.findMany({
      where: {
        status: "PAID",
      },
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

