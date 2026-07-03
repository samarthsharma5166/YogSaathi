import { prisma } from "./db/db.js";
import "./index.js";
import xlsx from "xlsx";
import axios from "axios";
import FormData from "form-data";

// Mock prisma createMany to see what parsed records would be saved to DB
prisma.dieticianLead.createMany = async (args) => {
  console.log("Mock prisma.dieticianLead.createMany called with data:", args.data);
  return { count: args.data.length };
};

const PORT = process.env.PORT || 8000;

const runTest = async () => {
  console.log("Waiting 2 seconds for server to start...");
  await new Promise((resolve) => setTimeout(resolve, 2000));

  try {
    // 1. Generate a mock Excel file with a title banner at the top (exactly like the screenshot)
    console.log("Generating in-memory mock Excel spreadsheet with title banner...");
    const wb = xlsx.utils.book_new();
    const sheetData = [
      ["Response to Google Form - Dietician Ist Session -July,26", "", "", ""],
      ["", "", "", ""],
      ["Sr No", "Name", "Mobile", "Will Attend ?"],
      [1, "Self", "", ""],
      [2, "Ajay Gupta", "8874555548", "Yes"],
      [3, "Basu Dev kapil", "8887502725", "Yes"]
    ];

    const ws = xlsx.utils.aoa_to_sheet(sheetData);
    xlsx.utils.book_append_sheet(wb, ws, "Dietician Session Response");
    const fileBuffer = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });

    // 2. Prepare Multipart Form Data
    const form = new FormData();
    form.append("file", fileBuffer, {
      filename: "Dietician_Session_Leads_Mock.xlsx",
      contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });

    // 3. Fire POST request to Excel uploader route
    console.log(`Sending POST request with mock Excel file to http://localhost:${PORT}/api/dietician/leads/upload...`);
    const response = await axios.post(
      `http://localhost:${PORT}/api/dietician/leads/upload`,
      form,
      {
        headers: {
          ...form.getHeaders()
        }
      }
    );

    console.log("Response status:", response.status);
    console.log("Response data:", response.data);

    if (response.status === 200 && response.data.success && response.data.count === 3) {
      console.log("✅ Excel uploader and parser verified successfully with title banner!");
      process.exit(0);
    } else {
      console.log("❌ Test failed: Unexpected response structure or count", response.data);
      process.exit(1);
    }

  } catch (err) {
    console.error("❌ Test error:", err.response ? err.response.data : err.message);
    process.exit(1);
  }
};

runTest();
