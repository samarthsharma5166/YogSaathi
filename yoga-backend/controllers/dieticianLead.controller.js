import xlsx from "xlsx";
import { prisma } from "../db/db.js";

// ── GET /api/dietician/leads ──
export const getDieticianLeads = async (req, res) => {
  try {
    const search = req.query.search || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { name: { contains: search } },
            { mobile: { contains: search } },
            { willAttend: { contains: search } }
          ]
        }
      : {};

    const [leads, total] = await Promise.all([
      prisma.dieticianLead.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" }
      }),
      prisma.dieticianLead.count({ where })
    ]);

    res.status(200).json({
      success: true,
      leads,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error getting dietician leads:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// ── POST /api/dietician/leads/upload ──
export const uploadDieticianLeads = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Read sheet as an array of arrays (rows) to dynamically find the header row
    const rows = xlsx.utils.sheet_to_json(sheet, { header: 1, defval: "" });

    // Look for the header row index. The header row is the first row containing common keywords like "name", "mobile", etc.
    let headerRowIndex = -1;
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (Array.isArray(row)) {
        const hasHeader = row.some((cell) => {
          if (!cell) return false;
          const val = String(cell).trim().toLowerCase();
          return (
            val === "name" ||
            val === "mobile" ||
            val === "phone" ||
            val === "will attend ?" ||
            val === "will attend" ||
            val === "sr no" ||
            val === "s.no"
          );
        });
        if (hasHeader) {
          headerRowIndex = i;
          break;
        }
      }
    }

    // Default to the first row if no headers were matched
    if (headerRowIndex === -1) {
      headerRowIndex = 0;
    }

    const headers = rows[headerRowIndex].map((h) => String(h || "").trim().toLowerCase());
    const dataRows = rows.slice(headerRowIndex + 1);

    const parsedLeads = dataRows.map((row) => {
      let srNo = null;
      let name = "";
      let mobile = "";
      let willAttend = "";

      for (let colIndex = 0; colIndex < headers.length; colIndex++) {
        const header = headers[colIndex];
        const value = row[colIndex];
        if (value === undefined || value === null || value === "") continue;

        if (
          header === "sr no" ||
          header === "sr. no." ||
          header === "serial number" ||
          header === "srno" ||
          header === "s.no" ||
          header === "sno"
        ) {
          srNo = parseInt(value) || null;
        } else if (header === "name" || header === "full name") {
          name = String(value).trim();
        } else if (
          header === "mobile" ||
          header === "phone" ||
          header === "mobile number" ||
          header === "phone number" ||
          header === "contact"
        ) {
          mobile = String(value).trim();
        } else if (
          header === "will attend ?" ||
          header === "will attend" ||
          header === "status" ||
          header === "will attend?" ||
          header === "rsvp"
        ) {
          willAttend = String(value).trim();
        }
      }

      return { srNo, name, mobile, willAttend };
    }).filter((lead) => lead.name || lead.mobile);

    if (parsedLeads.length === 0) {
      return res.status(400).json({ error: "No valid lead records found in sheet" });
    }

    // Batch insert into db
    await prisma.dieticianLead.createMany({
      data: parsedLeads
    });

    res.status(200).json({
      success: true,
      message: `Successfully uploaded ${parsedLeads.length} leads.`,
      count: parsedLeads.length
    });
  } catch (error) {
    console.error("Error uploading dietician leads:", error);
    res.status(500).json({ error: "Failed to parse and upload leads" });
  }
};

// ── DELETE /api/dietician/leads/clear ──
export const clearDieticianLeads = async (req, res) => {
  try {
    await prisma.dieticianLead.deleteMany({});
    res.status(200).json({ success: true, message: "All dietician leads cleared successfully" });
  } catch (error) {
    console.error("Error clearing dietician leads:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// ── DELETE /api/dietician/leads/:id ──
export const deleteDieticianLead = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.dieticianLead.delete({ where: { id } });
    res.status(200).json({ success: true, message: "Lead deleted successfully" });
  } catch (error) {
    console.error("Error deleting lead:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
