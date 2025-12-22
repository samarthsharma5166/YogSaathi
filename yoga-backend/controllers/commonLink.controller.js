import { prisma } from "../db/db.js";

export const createOrUpdateCommonLink = async (req, res) => {
  try {
    const { ref, startDate, expiryDate } = req.body;
    const link = `https://yogsaathi.com/class/join?ref=${ref}`;

    let commonLink = await prisma.commonLink.findFirst();

    if (commonLink) {
      commonLink = await prisma.commonLink.update({
        where: { id: commonLink.id },
        data: {
          link,
          ref,
          startDate: new Date(startDate),
          expiryDate: new Date(expiryDate),
        },
      });
    } else {
      commonLink = await prisma.commonLink.create({
        data: {
          link,
          ref,
          startDate: new Date(startDate),
          expiryDate: new Date(expiryDate),
        },
      });
    }

    res.status(200).json({
      message: "Common link created/updated successfully",
      data: commonLink,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCommonLink = async (req, res) => {
  try {
    const commonLink = await prisma.commonLink.findFirst();
    res.status(200).json({ data: commonLink });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyCommonLink = async (req, res) => {
  try {
    const { ref } = req.query;

    if (!ref) {
      return res.status(400).json({ message: "Invalid link" });
    }

    const commonLink = await prisma.commonLink.findFirst({
      where: { ref },
    });

    if (!commonLink) {
      return res.status(400).json({ message: "Invalid link" });
    }

    const now = new Date();
    if (now < commonLink.startDate || now > commonLink.expiryDate) {
      return res.status(400).json({ message: "Link expired" });
    }

    res.status(200).json({ message: "Link verified" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
