import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";


export async function generateInvoice(eventRegistration, amount, participantCount = 1) {
  const totalAmount = amount * participantCount;
  const invoiceDir = path.join(process.cwd(), "invoices");
  fs.mkdirSync(invoiceDir, { recursive: true });

  const safeInvoiceNo = eventRegistration.id.replace(/[\\/]/g, "-");
  const fileName = `invoice-YS-EVENT-${safeInvoiceNo}.pdf`;
  const invoicePath = path.join(invoiceDir, fileName);

  const shortId = eventRegistration.id.slice(-6).toUpperCase();
  const invoiceNumber = `YS/2026/${shortId}`;
  // const invoiceNumber = `YS/2026/${safeInvoiceNo}`;
  const doc = new PDFDocument({ margin: 50 });
  const stream = fs.createWriteStream(invoicePath);
  doc.pipe(stream);

  // ================= HEADER =================
  doc.fontSize(18).text("Healthy Horizons Pvt Ltd", { align: "center" });
  doc.moveDown(0.5);
  doc.fontSize(10).text(
    "Email: healthy.horizons111@gmail.com | Website: www.yogsaathi.com",
    { align: "center" }
  );

  doc.moveDown();
  doc.fontSize(16).text("Invoice", { align: "center" });
  doc.moveDown();

  // ================= INVOICE META =================
  // doc.fontSize(11).text(`Invoice No: YS/2026/01`);
  doc.text(`Invoice No: ${invoiceNumber}`);
  doc.text(`Date of Issue: ${new Date().toLocaleDateString()}`);
  doc.moveDown();

  // ================= CUSTOMER DETAILS =================
  doc.font("Helvetica-Bold").text("Customer Detail");
  doc.font("Helvetica");
  doc.text(`Name: ${eventRegistration.fullName}`);
  doc.text(`Email: ${eventRegistration.email}`);
  doc.moveDown();

  // ================= RETREAT DETAILS =================
  doc.font("Helvetica-Bold").text("Yoga Retreat Details:");
  doc.font("Helvetica");
  doc.text("Start Date: 21.05.26, 1 PM");
  doc.text("End Date: 24.05.26, 11.30 AM");
  doc.text("Venue: Panambi Resort, Rishikesh");
  doc.moveDown();

  // ================= TABLE HEADER =================
  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown(0.5);

  doc.font("Helvetica-Bold");
  doc.text("Description", 50, doc.y, { continued: true });
  doc.text("Amount", { align: "right" });
  doc.moveDown(0.5);

  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown(0.5);

  // ================= TABLE ROW =================
  doc.font("Helvetica");
  doc.text(
    `Yoga Retreat (12.03.26 to 15.03.26, Panambi Resort)\n${eventRegistration.plan}\nParticipants: ${participantCount} @ ${amount} INR/person`,
    50,
    doc.y,
    { continued: true }
  );
  doc.text(`${totalAmount} INR`, { align: "right" });
  doc.moveDown();

  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown(0.5);

  // ================= TOTALS =================
  doc.font("Helvetica-Bold");
  doc.text("Net Payable", 50, doc.y, { continued: true });
  doc.text(`${totalAmount} INR`, { align: "right" });
  doc.moveDown();

  doc.text("Total Amount Paid", 50, doc.y, { continued: true });
  doc.text(`${totalAmount} INR`, { align: "right" });

  doc.moveDown(2);

  // ================= FOOTER =================
  doc.fontSize(12)
    .text(
      "Thank you for opting YogSaathi + Panambi Resort Yoga Retreat",
      { align: "center" }
    );

  doc.end();

  return new Promise((resolve, reject) => {
    stream.on("finish", () => resolve(fileName));
    stream.on("error", reject);
  });
}


// export function generateYogaInvoice({
//   invoiceNo,
//   dateOfIssue,
//   companyEmail,
//   website,
//   customerName,
//   customerEmail,
//   programStart,
//   programEnd,
//   referralDays,
//   finalEndDate,
//   description,
//   amount
// }) {
//   const invoiceDir = path.join(process.cwd(), "invoices");
//   fs.mkdirSync(invoiceDir, { recursive: true });

//   // ✅ Sanitize invoice number for file name
//   const safeInvoiceNo = invoiceNo.replace(/[\/\\]/g, "-");

//   const fileName = `invoice-${safeInvoiceNo}.pdf`;
//   const invoicePath = path.join(invoiceDir, fileName);
//   const doc = new PDFDocument({ margin: 50 });

//   const writeStream = fs.createWriteStream(invoicePath);
//   doc.pipe(writeStream);

//   // Header
//   doc.fontSize(18).text("Healthy Horizons Pvt. Ltd.", { align: "center" });
//   doc.fontSize(10).text(`Email: ${companyEmail} | ${website}`, { align: "center" });
//   doc.moveDown();

//   doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
//   doc.fontSize(16).text("INVOICE", { align: "center" });
//   doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
//   doc.moveDown();

//   // Invoice Details
//   doc.fontSize(12).text(`Invoice No:  ${invoiceNo}`);
//   doc.text(`Date of Issue: ${dateOfIssue}`);
//   doc.moveDown();

//   // Customer Details
//   doc.text("Billed To:");
//   doc.text(`Name:  ${customerName}`);
//   doc.text(`Email: ${customerEmail}`);
//   doc.moveDown();

//   // Program Dates
//   doc.text(`Program Start Date:  ${programStart} Program End Date: ${programEnd}`);
//   doc.text(`Referral Days: ${referralDays} Days`);
//   doc.text(`After adding referral days, Program End Date: ${finalEndDate}`);
//   doc.moveDown();

//   doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();

//   // Description Table
//   doc.font("Helvetica-Bold").text("Description", 50, doc.y, { continued: true });
//   doc.text("Amount (INR)", { align: "right" });
//   doc.font("Helvetica").moveDown();

//   doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();

//   doc.text(description, 50, doc.y, { continued: true });
//   doc.text(`₹${amount}`, { align: "right" });
//   doc.moveDown();

//   doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();

//   doc.text("Net Payable", 50, doc.y, { continued: true });
//   doc.text(`₹${amount}`, { align: "right" });
//   doc.moveDown();

//   doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();

//   doc.text("Total Amount Payable", 50, doc.y, { continued: true });
//   doc.text(`₹${amount}`, { align: "right" });
//   doc.moveDown();

//   doc.text("Note:");
//   doc.text("Referral Benefits, if any, applied.");
//   doc.moveDown();

//   doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();

//   doc.fontSize(12).text("Thank you for subscribing to Yog Saathi!", { align: "center" });

//   doc.end();

//   return new Promise((resolve, reject) => {
//     writeStream.on("finish", () => resolve({invoicePath,fileName}));
//     writeStream.on("error", reject);
//   });
// }

export function generateYogaInvoice({
  invoiceNo,
  dateOfIssue,
  companyEmail,
  website,
  customerName,
  customerEmail,
  programStart,
  programEnd,
  referralDays,
  finalEndDate,
  description,
  amount,
  amountType
}) {
  const invoiceDir = path.join(process.cwd(), "invoices");
  fs.mkdirSync(invoiceDir, { recursive: true });

  // ✅ Sanitize invoice number for file name
  const safeInvoiceNo = invoiceNo.replace(/[\/\\]/g, "-");
  const fileName = `invoice-${safeInvoiceNo}.pdf`;
  const invoicePath = path.join(invoiceDir, fileName);

  // Add margins
  const doc = new PDFDocument({ margin: 60 });
  const writeStream = fs.createWriteStream(invoicePath);
  doc.pipe(writeStream);

  // ---------------- HEADER ----------------
  doc.fontSize(20).font("Helvetica-Bold").text("Healthy Horizons Pvt. Ltd.", { align: "center" });
  doc.moveDown(0.5);
  doc.fontSize(10).font("Helvetica").text(`Email: ${companyEmail} | Website: ${website}`, { align: "center" });
  doc.moveDown(1);

  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown(0.8);

  doc.fontSize(18).font("Helvetica-Bold").text("INVOICE", { align: "center" });
  doc.moveDown(0.8);

  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown(1.2);

  // ---------------- INVOICE DETAILS ----------------
  doc.fontSize(12).font("Helvetica-Bold").text("Invoice Details", { underline: true });
  doc.moveDown(0.5);
  doc.font("Helvetica").text(`Invoice No:  ${invoiceNo}`);
  doc.text(`Date of Issue: ${dateOfIssue}`);
  doc.moveDown(1.2);

  // ---------------- CUSTOMER DETAILS ----------------
  doc.fontSize(12).font("Helvetica-Bold").text("Customer Details", { underline: true });
  doc.moveDown(0.5);
  doc.font("Helvetica").text(`Name:  ${customerName}`);
  doc.text(`Email: ${customerEmail}`);
  doc.moveDown(1.2);

  // ---------------- PROGRAM DETAILS ----------------
  doc.fontSize(12).font("Helvetica-Bold").text("Program Details", { underline: true });
  doc.moveDown(0.5);
  doc.font("Helvetica").text(`Program Start Date:  ${programStart}`);
  doc.text(`Program End Date:   ${programEnd}`);
  doc.text(`Referral Days: ${referralDays} Days`);
  doc.text(`Final Program End Date (after referral): ${finalEndDate}`);
  doc.moveDown(1.2);

  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown(0.8);

  // ---------------- DESCRIPTION TABLE ----------------
  doc.fontSize(12).font("Helvetica-Bold").text("Description", 50, doc.y, { continued: true });
  doc.text(`Amount (${amountType })`, { align: "right" });
  doc.moveDown(0.3);

  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown(0.6);

  doc.font("Helvetica").text(description, 50, doc.y, { continued: true });
  doc.text(`${amount} ${amountType}`, { align: "right" });
  doc.moveDown(1);

  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown(0.8);

  doc.font("Helvetica-Bold").text("Net Payable", 50, doc.y, { continued: true });
  doc.text(`${amount} ${amountType}`, { align: "right" });
  doc.moveDown(0.8);

  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown(0.8);

  doc.font("Helvetica-Bold").text("Total Amount Paid", 50, doc.y, { continued: true });
  doc.text(`${amount} ${amountType}`, { align: "right" });
  doc.moveDown(1.2);

  // ---------------- NOTES ----------------
  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown(0.8);
  doc.fontSize(11).font("Helvetica-Bold").text("Note:");
  doc.font("Helvetica").text("Referral Benefits, if any, have been applied.");
  doc.moveDown(1);

  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown(1.5);

  // ---------------- FOOTER ----------------
  doc.fontSize(12).font("Helvetica-Bold").text("Thank you for subscribing to Yog Saathi!", { align: "center" });

  doc.end();

  return new Promise((resolve, reject) => {
    writeStream.on("finish", () => resolve({ invoicePath, fileName }));
    writeStream.on("error", reject);
  });
}

export function generateYogaCareInvoice({
  invoiceNo,
  dateOfIssue,
  companyEmail,
  website,
  customerName,
  customerEmail,
  programStart,
  programEnd,
  duration,
  description,
  amount,
  amountType
}) {
  const invoiceDir = path.join(process.cwd(), "invoices");
  fs.mkdirSync(invoiceDir, { recursive: true });

  const safeInvoiceNo = invoiceNo.replace(/[\/\\]/g, "-");
  const fileName = `invoice-${safeInvoiceNo}.pdf`;
  const invoicePath = path.join(invoiceDir, fileName);

  const doc = new PDFDocument({ margin: 60 });
  const writeStream = fs.createWriteStream(invoicePath);
  doc.pipe(writeStream);

  // ---------------- HEADER ----------------
  doc.fontSize(20).font("Helvetica-Bold").text("Healthy Horizons Pvt. Ltd.", { align: "center" });
  doc.moveDown(0.5);
  doc.fontSize(10).font("Helvetica").text(`Email: ${companyEmail} | Website: ${website}`, { align: "center" });
  doc.moveDown(1);

  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown(0.8);

  doc.fontSize(18).font("Helvetica-Bold").text("INVOICE", { align: "center" });
  doc.moveDown(0.8);

  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown(1.2);

  // ---------------- INVOICE DETAILS ----------------
  doc.fontSize(12).font("Helvetica-Bold").text("Invoice Details", { underline: true });
  doc.moveDown(0.5);
  doc.font("Helvetica").text(`Invoice No:  ${invoiceNo}`);
  doc.text(`Date of Issue: ${dateOfIssue}`);
  doc.moveDown(1.2);

  // ---------------- CUSTOMER DETAILS ----------------
  doc.fontSize(12).font("Helvetica-Bold").text("Customer Details", { underline: true });
  doc.moveDown(0.5);
  doc.font("Helvetica").text(`Name:  ${customerName}`);
  doc.text(`Email: ${customerEmail}`);
  doc.moveDown(1.2);

  // ---------------- PROGRAM DETAILS ----------------
  doc.fontSize(12).font("Helvetica-Bold").text("Program Details", { underline: true });
  doc.moveDown(0.5);
  doc.font("Helvetica").text(`Program Start Date:  ${programStart}`);
  doc.text(`Program End Date:   ${programEnd}`);
  doc.text(`Program Duration:   ${duration === 0 ? "Trial Class" : `${duration} Month${duration > 1 ? "s" : ""}`}`);
  doc.moveDown(1.2);

  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown(0.8);

  // ---------------- DESCRIPTION TABLE ----------------
  doc.fontSize(12).font("Helvetica-Bold").text("Description", 50, doc.y, { continued: true });
  doc.text(`Amount (${amountType })`, { align: "right" });
  doc.moveDown(0.3);

  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown(0.6);

  doc.font("Helvetica").text(description, 50, doc.y, { continued: true });
  doc.text(`${amount} ${amountType}`, { align: "right" });
  doc.moveDown(1);

  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown(0.8);

  doc.font("Helvetica-Bold").text("Net Payable", 50, doc.y, { continued: true });
  doc.text(`${amount} ${amountType}`, { align: "right" });
  doc.moveDown(0.8);

  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown(0.8);

  doc.font("Helvetica-Bold").text("Total Amount Paid", 50, doc.y, { continued: true });
  doc.text(`${amount} ${amountType}`, { align: "right" });
  doc.moveDown(1.2);

  // ---------------- NOTES ----------------
  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown(0.8);
  doc.fontSize(11).font("Helvetica-Bold").text("Note:");
  doc.font("Helvetica").text("This is a computer generated invoice and does not require signature.");
  doc.moveDown(1);

  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown(1.5);

  // ---------------- FOOTER ----------------
  doc.fontSize(12).font("Helvetica-Bold").text("Thank you for choosing Yog Saathi!", { align: "center" });

  doc.end();

  return new Promise((resolve, reject) => {
    writeStream.on("finish", () => resolve({ invoicePath, fileName }));
    writeStream.on("error", reject);
  });
}