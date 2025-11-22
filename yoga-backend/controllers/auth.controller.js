import { prisma } from "../db/db.js";
import jwt from "jsonwebtoken";
import { sendRegistrationConfirmation, reffaralInformation, sendRegistrationConfirmationStep2, sendRegistrationConfirmationStep3, your_yogsaathi_otp_for_login } from '../utils/messages.js'
import { format } from 'date-fns'

// export const register = async (req, res) => {
//   try {
//     const { name, email, phoneNumber, referredByCode } = req.body;

//     if(!name || !phoneNumber){
//       return res.status(400).json({ message: "Please fill in all fields" });
//     }

//     if(phoneNumber.length < 10){
//       return res.status(400).json({ message: "Phone number should be 10 digits long" });
//     }

//     const existingUser = await prisma.user.findFirst({
//       where: {
//         phoneNumber
//       }
//     });

//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }


//     // Create referral code from username + random string
//     const generateReferralCode = (name) => {
//       const random = Math.random().toString(36).substring(2, 8);
//       return `${name.split(" ")[0].toLowerCase()}-${random}`;
//     };

//     // Handle referral if provided
//     let referredByUser = null;
//     if (referredByCode) {
//       referredByUser = await prisma.user.findUnique({
//         where: { referralCode: referredByCode }
//       });
//     }

//     const freeCampign = await prisma.freeTrialCampaign.findFirst({
//       where: {
//         isActive: true,
//         endDate: { gte: new Date() }
//       }
//     }) 

//     let user = null;
    
//     const now = new Date();
//     let startDate;
//     if(freeCampign){
//       const campignDate = new Date(freeCampign.startDate);

//       if (campignDate.getTime() > now.getTime()){
//         startDate = new Date(campignDate)
//       }else{
//         const tomorrow = new Date();
//         tomorrow.setDate(tomorrow.getDate() + 1);
//         startDate = tomorrow;
//       }
//       const freeTrialPlan = await prisma.plan.findFirst({
//         where: { isFreeTrial: true }
//       });

//       user = await prisma.user.create({
//         data: {
//           name,
//           email,
//           phoneNumber,
//           referralCode: generateReferralCode(name),
//           referredById: referredByUser?.id || null,
//           subscription: {
//             create: {
//               planId: freeTrialPlan.id,
//               startDate: startDate,
//               baseDuration: freeTrialPlan.duration,
//               expiresAt:freeCampign.endDate,
//               status: "active"
//             }
//           }
//         },
//         include: {
//           subscription: true
//         }
//       });
//       if (referredByUser) {
//         console.log("====",referredByUser);
//         await prisma.user.update({
//           where: { id: referredByUser.id },
//           data: {
//             referralPoints: { increment: 1 }
//           }
//         });
//         reffaralInformation(referredByUser.phoneNumber, referredByUser.name, user.name)
//       }

//       const date = new Date(user.subscription[0].startDate);
//       const formattedDate = format(date, "dd/MM/yyyy");

//       sendRegistrationConfirmation(user.phoneNumber, formattedDate, user.name, user.referralCode,user.referralPoints);

//       await new Promise((resolve) => setTimeout(resolve, 15000)).then(() => {
//         sendRegistrationConfirmationStep2(user.phoneNumber, user.name);
//       });

//       await new Promise((resolve) => setTimeout(resolve, 15000)).then(() => {
//         sendRegistrationConfirmationStep3(user.phoneNumber, user.name, formattedDate, user.referralCode, user.referralPoints);
//       })

//     }else{
//       user = await prisma.user.create({
//         data: {
//           name,
//           email,
//           phoneNumber,
//           referralCode: generateReferralCode(name),
//           referredById: referredByUser?.id || null,
//         }
//       });
//       if (referredByUser) {
//         await prisma.user.update({
//           where: { id: referredByUser.id },
//           data: {
//             referralPoints: { increment: 1 }
//           }
//         });
//         reffaralInformation(referredByUser.phoneNumber, referredByUser.name, user.name)
//       }
//     }
//     res.status(201).json({ success: true, message: "User registered successfully" });
//   } catch (err) {
//     console.error("Registration Error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

export const register = async (req, res) => {
  try {
    const { name, email, phoneNumber, referredByCode } = req.body;

    // --- Basic validation ---
    if (!name || !phoneNumber) {
      return res.status(400).json({ message: "Name and phone number are required." });
    }

    if (phoneNumber.length < 10) {
      return res.status(400).json({ message: "Phone number must be 10 digits long." });
    }

    // --- Find existing user ---
    let user = await prisma.user.findUnique({
      where: { phoneNumber },
      include: {
        subscription: true,
      },
    });

    // --- Helper: Get tomorrow's date ---
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    // --- Get free trial plan ---
    const freeTrialPlan = await prisma.plan.findFirst({
      where: { isFreeTrial: true },
    });

    if (!freeTrialPlan) {
      return res.status(404).json({ message: "No free trial plan found." });
    }

    // --- If new user: create and assign free trial ---
    if (!user) {
      const referralCode = `${name.split(" ")[0].toLowerCase()}-${Math.random()
        .toString(36)
        .substring(2, 8)}`;

      let referredByUser = null;
      if (referredByCode) {
        referredByUser = await prisma.user.findUnique({
          where: { referralCode: referredByCode }
        });
      }
      const expiresAt = new Date(tomorrow);
      expiresAt.setDate(expiresAt.getDate() + freeTrialPlan.duration - 1);
      user = await prisma.user.create({
        data: {
          name,
          email,
          phoneNumber,
          referralCode,
          subscription: {
            create: {
              planId: freeTrialPlan.id,
              startDate: tomorrow,
              baseDuration: freeTrialPlan.duration,
              expiresAt,
              status: "active",
            },
          },
        },
        include: { subscription: true },
      });

      if (referredByUser) {
        await prisma.user.update({
          where: { id: referredByUser.id },
          data: {
            referralPoints: { increment: 1 }
          }
        });
        reffaralInformation(referredByUser.phoneNumber, referredByUser.name, user.name)
      }


      const date = new Date(user.subscription[0].startDate);
      const formattedDate = format(date, "dd/MM/yyyy");

      sendRegistrationConfirmation(user.phoneNumber, formattedDate, user.name, user.referralCode,user.referralPoints);

      await new Promise((resolve) => setTimeout(resolve, 15000)).then(() => {
        sendRegistrationConfirmationStep2(user.phoneNumber, user.name);
      });

      await new Promise((resolve) => setTimeout(resolve, 15000)).then(() => {
        sendRegistrationConfirmationStep3(user.phoneNumber, user.name, formattedDate, user.referralCode, user.referralPoints);
      })
      return res.status(201).json({
        success: true,
        message: "User registered and free trial activated.",
        user,
      });
    }

    // --- Existing user logic ---

    // 1. Count previous free trials
    const freeTrialCount = await prisma.subscription.count({
      where: { 
        userId: user.id,
        plan:{
          isFreeTrial:true
        }
      },
    });

    if (freeTrialCount >= 2) {
      return res.status(400).json({ message: "User has already used 2 free trials." });
    }

    // 2. Check for active paid subscription
    const activePaidSub = await prisma.subscription.findFirst({
      where: {
        userId: user.id,
        status: "active",
        expiresAt: { gte: new Date() },
        plan:{
          isFreeTrial:false
        }
      },
    });

    if (activePaidSub) {
      return res.status(400).json({ message: "Active paid subscription found. Cannot start free trial." });
    }

    const activeFreeTrial = await prisma.subscription.findFirst({
      where: {
        userId: user.id,
        status: "active",
        expiresAt: { gte: new Date() },
        plan: {
          isFreeTrial: true,
        },
      },
    });

    if (activeFreeTrial) {
      return res.status(400).json({ message: "Active free trial found. Cannot start another free trial." });
    }
  

    const expiresAt = new Date(tomorrow);
    expiresAt.setDate(expiresAt.getDate() + freeTrialPlan.duration - 1);
    // 3. Assign new free trial (starting tomorrow)
    const subscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        planId: freeTrialPlan.id,
        // isFreeTrial: true,
        startDate: tomorrow,
        expiresAt,
        baseDuration: freeTrialPlan.duration,
        status: "active",
      },
    });

    const date = new Date(subscription.startDate);
    const formattedDate = format(date, "dd/MM/yyyy");

    sendRegistrationConfirmation(user.phoneNumber, formattedDate, user.name, user.referralCode, user.referralPoints);

    await new Promise((resolve) => setTimeout(resolve, 15000)).then(() => {
      sendRegistrationConfirmationStep2(user.phoneNumber, user.name);
    });

    await new Promise((resolve) => setTimeout(resolve, 15000)).then(() => {
      sendRegistrationConfirmationStep3(user.phoneNumber, user.name, formattedDate, user.referralCode, user.referralPoints);
    })

    return res.status(200).json({
      success: true,
      message: "Free trial activated for existing user.",
    });

  } catch (err) {
    console.error("Error in registerWithFreeTrial:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

// Send OTP to phone
export const sendOTP = async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ message: 'Phone number is required' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { phoneNumber }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // real otp
    // const otp = "123456"; // Hardcoded for now
    await your_yogsaathi_otp_for_login(user.phoneNumber,user.name ,otp);
    await prisma.user.update({
      where: { phoneNumber },
      data: {
        otp: Number(otp),
        otpExpire: new Date(Date.now() + 5 * 60 * 1000)
      }
    })


    // ⏳ TODO: Send `otp` via WhatsApp using Meta API when integrated

    return res.status(200).json({
       success: true,
       message: 'OTP sent successfully (hardcoded)',
       
       }); // ⚠️ Remove `otp` in prod
  } catch (err) {
    console.error("Send OTP error:", err);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

// Verify OTP
export const verifyOTP = async (req, res) => {
  const { phoneNumber, otp } = req.body;

  if (!phoneNumber || !otp) {
    return res.status(400).json({ message: 'Phone number and OTP are required' });
  }

  const validOtp = await prisma.user.findUnique({
    where: { phoneNumber },
    select: { otp: true }
  })


  if (Number(otp) !== validOtp.otp) {
    return res.status(401).json({ message: 'Invalid OTP' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { phoneNumber }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.otpExpire < new Date()) {
      return res.status(401).json({ message: 'OTP has expired' });
    }

    // ✅ Authenticated successfully
    await prisma.user.update({
      where: { phoneNumber },
      data: {
        otp: null,
        otpExpire: null
      }
    })
    // ⏳ TODO: Issue JWT token here if needed

      const token = jwt.sign({ 
      id: user.id,
      name: user.name,
      phoneNumber: user.phoneNumber,
      email: user.email,
      role: user.role
     }, process.env.JWT_SECRET, { expiresIn: '24h' });

    return res.status(200).json({
      message: 'OTP verified successfully',
      user,
      token
    });
  } catch (err) {
    console.error("Verify OTP error:", err);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};
