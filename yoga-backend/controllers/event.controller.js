
import Razorpay from "razorpay";
import crypto from "crypto";
import { generateInvoice } from "../utils/generateInvoice.js";
import { prisma } from "../db/db.js";
import {instance as razorpay} from '../index.js'
import { payment_confirmation } from "../utils/messages.js";
import { Parser } from "json2csv";
import sendEmail from "../utils/sendMail.js";

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

      const subject = 'Confirmation – YogSaathi × Panambi Yoga Retreat, Rishikesh';
      const message = `
        <p>Dear ${eventRegistration.fullName},</p>
        <p>Greetings from YogSaathi.</p>
        <p>Thank you for registering for the YogSaathi × Panambi Yoga Retreat at Rishikesh and for making the payment of ₹${planCosts[eventRegistration.plan]}. We are pleased to confirm your participation in the retreat.</p>
        <p><b>Booking Details</b></p>
        <p>Room Category: ${eventRegistration.plan}</p>
        <p>Retreat Dates: 12.03.26 to 15.03.26</p>
        <p><b>Check-in & Departure</b></p>
        <p>Check-in: 12.03.26, 1 PM</p>
        <p>Departure: 15.03.26, 11.30 AM</p>
        <p><b>Venue Address</b></p>
        <p>Panambi Resort & Spa<br>Cheela, Rishikesh, Uttarakhand<br>(A unit of Panambi Vacations Private Limited)</p>
        <p><b>Important Note</b></p>
        <p>Please carry loose pyjama/pants (preferably black or blue) for yoga practice.<br>A Yoga Mat and a Retreat T-Shirt will be provided by us.</p>
        <p>For any assistance related to travel or location, please feel free to contact:<br>
        Mr. Neeraj – 98916 98547<br>Mr. Sanjay- 99717 14091</p>
        <p>You may also write to us at yogsaathi.26@gmail.com</p>
      `;


      await payment_confirmation(eventRegistration.mobileNumber,eventRegistration.fullName,planCosts[eventRegistration.plan])
      await sendEmail("healthy.horizons111@gmail.com",subject,message)
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

