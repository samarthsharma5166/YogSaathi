import { instance as razorpay } from "../index.js";
import crypto from "crypto";
import { prisma } from '../db/db.js'
import { isIndianNumber } from "../utils/PhoneChecker.js";
import path from 'path'
import fs from 'fs'
import { generateYogaInvoice } from "../utils/generateInvoice.js";
import { invoice_subscription_plan } from "../utils/messages.js";

// 1. Create Razorpay Order
export const createOrder = async (req, res) => {
  try {
    const { planId, phoneNumber, startDate, name } = req.body;

    const plan = await prisma.plan.findUnique({ where: { id: planId } });
    if (!plan) return res.status(404).json({ success: false, message: "Plan not found" });

    // check user is from indian or not
    if (!phoneNumber) {
      return res.status(400).json({ success: false, message: "Phone number is required" });
    }

    let user = await prisma.user.findUnique({ where: { phoneNumber: phoneNumber } });
    if (!user){
      if (!name || !phoneNumber) {
        return res.status(400).json({success:false, message: "Please fill in all fields" });
      }

      if (phoneNumber.length < 10) {
        return res.status(400).json({ success: false, message: "Phone number should be 10 digits long" });
      }

      const generateReferralCode = (name) => {
        const random = Math.random().toString(36).substring(2, 8);
        return `${name.split(" ")[0].toLowerCase()}-${random}`;
      };
        user = await prisma.user.create({
          data: {
            name,
            phoneNumber,
            referralCode: generateReferralCode(name),
          }
        });

    }

    // check if have alredy subscription
    const existingSubscription = await prisma.subscription.findMany({
      where: {
        userId:user.id,
        expiresAt:{
          gte:new Date()
        },
        plan: {
          isFreeTrial: false,
        },
      },
    });

    if (existingSubscription && existingSubscription.length > 0) {
      return res.status(400).json({ success: false, message: "User already has a subscription" });
    }

    // check user is from indian or not
    const isIndian = isIndianNumber(phoneNumber);


    const amount = isIndian
      ? (plan.inrPrice ? plan.inrPrice * 100 : 0)
      : (plan.usdPrice ? plan.usdPrice * 100 : 0);

    if (amount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid plan pricing" });
    }
    const currency = isIndian ? "INR" : "USD";
    const options = {
      amount,
      currency,
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
  

    const payment = await prisma.payment.create({
      data: {
        razorpay_order_id: order.id,
        userId: user.id,
        planId: planId,
        amount: amount * 100,
        currency,
        status: "PENDING",
        startDate
      },
    });

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.KEY_ID,
      plan,
      userId:user.id,
      paymentId: payment.id
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to create order" });
  }
};

// 2. Verify and store subscription
// export const verifyPayment = async (req, res) => {
//   try {
//     const {
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature,
//       planId,
//       userId,
//       startDate
//     } = req.body;

//     // ✅ Step 1: Verify Razorpay Signature
//     const generatedSignature = crypto
//       .createHmac("sha256", process.env.KEY_SECRET)
//       .update(razorpay_order_id + "|" + razorpay_payment_id)
//       .digest("hex");

//     if (generatedSignature !== razorpay_signature) {
//       return res.status(400).json({ message: "Payment verification failed" });
//     }

//     // ✅ Step 2: Get Plan Details
//     const plan = await prisma.plan.findUnique({ where: { id: planId } });
//     if (!plan) {
//       return res.status(404).json({ message: "Plan not found" });
//     }

//     // const startDate = new Date();
//     const subsStartDate = new Date(startDate);
//     const baseDuration = plan.duration; // assumed to be in days
//     let expiresAt;
//     if(plan.durationType === "MONTH"){
//       expiresAt = new Date(subsStartDate.getTime() + baseDuration * 30 * 24 * 60 * 60 * 1000);
//     }else{
//        expiresAt = new Date(subsStartDate.getTime() + baseDuration * 24 * 60 * 60 * 1000);
//     }

//     // ✅ Step 3: Check if user already has a subscription
//     const existingSubscription = await prisma.subscription.findUnique({
//       where: { userId },
//     });

//     let subscription;

//     if (existingSubscription) {
//       // 🛠️ Update existing subscription
//       subscription = await prisma.subscription.update({
//         where: { userId },
//         data: {
//           planId,
//           startDate: subsStartDate,
//           baseDuration,
//           expiresAt,
//           status: "active", // optionally reset status
//         },
//       });
//     } else {
//       // 🆕 Create new subscription
//       subscription = await prisma.subscription.create({
//         data: {
//           userId,
//           planId,
//           startDate: subsStartDate,
//           baseDuration,
//           expiresAt,
//         },
//       });
//     }

//     return res.json({ success: true, subscription });

//   } catch (error) {
//     console.error("Verification failed:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };


export const verifyPayment = async (req, res) => {
  try {
    console.log(req.body)
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planId,
      phoneNumber,
      userId,
      startDate
    } = req.body;


    const payment = await prisma.payment.update({
      where: { razorpay_order_id },
      data: {
        razorpay_payment_id,
        razorpay_signature
      }
    })
    // Step 1: Verify Razorpay Signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

      console.log("here1",generatedSignature)
    if (generatedSignature !== payment.razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    // Step 2: Get Plan & User Details
    const plan = await prisma.plan.findUnique({ where: { id: planId } });
    const user = phoneNumber ? await prisma.user.findUnique({ where: { phoneNumber: phoneNumber } }) : await prisma.user.findUnique({ where: { id: userId } });

    if (!plan || !user) {
      return res.status(404).json({ message: "Plan or User not found" });
    }
    console.log("here")

    const subsStartDate = new Date(startDate);
    const baseDuration = plan.duration;
    let expiresAt;

    const refferalDays = (user.referralPoints * 10) * 24 * 60 * 60 * 1000;

    if (plan.durationType === "MONTH") {
      expiresAt = new Date(subsStartDate);
      expiresAt.setMonth(expiresAt.getMonth() + baseDuration); // add months correctly
      expiresAt = new Date(expiresAt.getTime() + refferalDays); // add referral bonus
    } else {
      expiresAt = new Date(
        subsStartDate.getTime() + baseDuration * 24 * 60 * 60 * 1000 + refferalDays
      );
    }

    // Step 3: Update/Create Subscription
       const existingSubscription = await prisma.subscription.findFirst({
        where: { userId: user.id },
        select: {
          id: true,
          plan: {
            select: {
              isFreeTrial: true
            }
          }
        }
      });

    let subscription;

    if (existingSubscription && existingSubscription.plan.isFreeTrial === true) {
      subscription = await prisma.subscription.update({
        where: { id: existingSubscription.id },
        data: {
          planId,
          startDate: subsStartDate,
          baseDuration,
          extraDays: (user.referralPoints * 10),
          expiresAt,
          status: "active",
        },
      });
    } else {
      subscription = await prisma.subscription.create({
        data: {
          userId:user.id,
          planId,
          startDate: subsStartDate,
          baseDuration,
          extraDays: (user.referralPoints * 10),
          expiresAt,
        },
      });
    }

    // Step 4: Calculate Referral End Date
    const referralDays = user.referralPoints * 10; // static, can be dynamic
    const finalEndDate = new Date(expiresAt.getTime());


    const isIndian = isIndianNumber(user.phoneNumber);

    const shortId = subscription.id.split("-")[0]; // take first segment of UUID
    const year = new Date().getFullYear().toString().slice(-2); // "25"
    const invoiceNo = `YS${year}${shortId.toUpperCase()}`
    // Step 5: Generate Invoice
    const invoicePath = await generateYogaInvoice({
      invoiceNo: invoiceNo,
      dateOfIssue: new Date().toLocaleDateString(),
      companyEmail: "healthy.horizons111@gmail.com",
      website: "www.yogsaathi.com",
      customerName: user.name,
      customerEmail: user.email,
      programStart: subsStartDate.toLocaleDateString(),
      programEnd: expiresAt.toLocaleDateString(),
      referralDays,
      finalEndDate: finalEndDate.toLocaleDateString(),
      description: `${plan.name} – Online Yoga`,
      amount: isIndian ? plan.inrPrice : plan.usdPrice,
      amountType: isIndian ? "INR" : "USD"
    });

    await prisma.user.update({
      where: { id: user.id },
      data: {
        referralPoints: 0
      },
    })

    invoice_subscription_plan(user.phoneNumber,user.name,invoicePath.fileName);

    const updatedSubscription = await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        invoice: invoicePath.fileName,
      },
    });

    await prisma.payment.update({
      where: { razorpay_order_id },
      data: {
        razorpay_payment_id,
        razorpay_signature,
        status: "COMPLETED",
        verified: true,
      },
    });

    // Step 6: Return response
    return res.json({
      success: true,
      subscription: updatedSubscription,
      invoicePath
    });

  } catch (error) {
    console.error("Verification failed:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const downloadInvoice = async (req, res) => {
  try {
    const fileName = req.params.fileName;
    const filePath = path.join(process.cwd(), "invoices", fileName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error("Error sending file:", err);
        res.status(500).json({ message: "Error downloading invoice" });
      }
    });
  } catch (error) {
    console.error("Download failed:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};