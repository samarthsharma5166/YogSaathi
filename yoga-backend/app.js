// ✅ packages
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv';
import path from 'path'

// ✅ Routes
import authRoutes from './routes/auth.route.js';
import referralRoutes from './routes/refferal.route.js';
import planRoutes from './routes/plan.route.js';
import adminRoutes from './routes/admin.route.js';
import userRoutes from './routes/user.route.js';
import blogRoutes from './routes/blog.route.js';
import campignRoutes from './routes/freeTrialCampaignRoutes.js';
import { hourlyJob } from './Schedular/hourly.schedular.js';
import yogaClassRoute from './routes/yogaClass.routes.js';
import bodyParser from "body-parser";
import { invoice_subscription_plan, share_wellness_14_days_of_free_yoga } from './utils/messages.js';
import { orientationJob } from './Schedular/Admin.Schedular.js';
import paymentRoutes  from './routes/payment.route.js'
import { generateYogaInvoice } from './utils/generateInvoice.js';

const app = express();

dotenv.config();

// ✅ Enable CORS 
app.use(cors("*"));

// ✅ Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());



// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/invoices", express.static(path.join(process.cwd(), "invoices")));
app.use("/api/invoices", express.static(path.join(process.cwd(), "invoices")));
app.use("/api/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/assets",express.static(path.join(process.cwd(), "assets")));
app.use("/api/blogs", blogRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/referrals", referralRoutes); 
app.use("/api", planRoutes)
app.use("/api/yogaClasses",yogaClassRoute);
app.use("/api/campaigns", campignRoutes)
app.use("/api/payment",paymentRoutes);

app.post("/generateInvoice",async(req,res)=>{
  const { invoiceNo, planName,name, email, startDate, expiresAt, referralDays, finalEndDate ,isIndian, price} = req.body;
   const invoicePath = await generateYogaInvoice({
        invoiceNo: invoiceNo,
        dateOfIssue: new Date().toLocaleDateString(),
        companyEmail: "healthy.horizons111@gmail.com",
        website: "www.yogsaathi.com",
        customerName: name,
        customerEmail: email,
     programStart: new Date(startDate).toLocaleDateString(),
     programEnd: new Date(expiresAt).toLocaleDateString(),
        referralDays,
     finalEndDate: new Date(finalEndDate).toLocaleDateString(),
        description: `${planName} – Online Yoga`,
        amount: price ,
        amountType: isIndian ? "INR" : "USD"
      });

  return res.download(invoicePath);
})

// ✅ Health check route
app.use("/api/user",userRoutes);
app.get('/', (req, res) => {
  res.send('Yoga Backend Running...');
});

orientationJob.start();
hourlyJob.start();

// ✅ Start server

export default app
