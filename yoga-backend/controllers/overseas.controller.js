import { prisma } from "../db/db.js";
import sendEmail from "../utils/sendMail.js";

// Create a new overseas inquiry
export const createOverseasInquiry = async (req, res) => {
  try {
    const { name, country, timings, whatsapp, email, joiningDate, healthGoal } = req.body;

    // Basic validation
    if (!name || !country || !timings || !whatsapp || !email || !joiningDate) {
      return res.status(400).json({ message: "All required fields must be filled." });
    }

    // Save to database
    const inquiry = await prisma.overseasInquiry.create({
      data: {
        name,
        country,
        timings,
        whatsapp,
        email,
        joiningDate: new Date(joiningDate),
        healthGoal: healthGoal || null,
      },
    });

    // Send email notification to Admin
    const emailSubject = `New Overseas Yoga Program Inquiry from ${name}`;
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px;">
        <h2 style="color: #059669; border-bottom: 2px solid #059669; padding-bottom: 10px;">New Overseas Inquiry Received</h2>
        <p>A new interest registration has been submitted for the Overseas Yoga Program on YogSaathi.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr style="background-color: #f8fafc;">
            <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold; width: 40%;">Participant Name</td>
            <td style="padding: 10px; border: 1px solid #cbd5e1;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold;">Country of Residence</td>
            <td style="padding: 10px; border: 1px solid #cbd5e1;">${country}</td>
          </tr>
          <tr style="background-color: #f8fafc;">
            <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold;">Preferred Timing (IST)</td>
            <td style="padding: 10px; border: 1px solid #cbd5e1;">${timings}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold;">WhatsApp Number</td>
            <td style="padding: 10px; border: 1px solid #cbd5e1;">${whatsapp}</td>
          </tr>
          <tr style="background-color: #f8fafc;">
            <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold;">E-Mail Address</td>
            <td style="padding: 10px; border: 1px solid #cbd5e1;"><a href="mailto:${email}">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold;">Planned Joining Date</td>
            <td style="padding: 10px; border: 1px solid #cbd5e1;">${new Date(joiningDate).toLocaleDateString("en-IN")}</td>
          </tr>
          <tr style="background-color: #f8fafc;">
            <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold;">Health / Wellness Goal</td>
            <td style="padding: 10px; border: 1px solid #cbd5e1;">${healthGoal ? healthGoal.replace(/\n/g, "<br/>") : "None specified"}</td>
          </tr>
        </table>
        
        <p style="margin-top: 30px; font-size: 12px; color: #64748b; text-align: center; border-top: 1px solid #cbd5e1; padding-top: 15px;">
          This inquiry was sent automatically from YogSaathi.
        </p>
      </div>
    `;

    // Dispatch email to admin address
    try {
      await sendEmail("healthy.horizons111@gmail.com", emailSubject, emailContent);
    } catch (emailErr) {
      // Log error but don't fail the response, as the database record is saved successfully
      console.error("Failed to send admin email alert:", emailErr.message);
    }

    return res.status(201).json({
      success: true,
      message: "Inquiry submitted successfully! We will contact you soon.",
      inquiry,
    });
  } catch (error) {
    console.error("Create Overseas Inquiry Error:", error);
    return res.status(500).json({ message: "Server error occurred while creating inquiry." });
  }
};

// Fetch all overseas inquiries (Admin only)
export const getOverseasInquiries = async (req, res) => {
  try {
    const inquiries = await prisma.overseasInquiry.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      inquiries,
    });
  } catch (error) {
    console.error("Get Overseas Inquiries Error:", error);
    return res.status(500).json({ message: "Server error occurred while fetching inquiries." });
  }
};
