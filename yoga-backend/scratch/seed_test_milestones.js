import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("--- Seeding Test Users for Milestone Certificates ---");

  // Fetch Paid and Free plans
  const paidPlan = await prisma.plan.findFirst({
    where: { isFreeTrial: false, name: "Bumper Saver Package" },
  }) || await prisma.plan.findFirst({ where: { isFreeTrial: false } });

  const freePlan = await prisma.plan.findFirst({
    where: { isFreeTrial: true },
  });

  if (!paidPlan) {
    throw new Error("No paid plan found in database");
  }

  const testUsersData = [
    {
      name: "Priya Sharma",
      phoneNumber: "+919876543210",
      isPaid: true,
      attendanceDays: 520, // Unlocks Bronze, Silver, Gold, Platinum, Diamond!
      startDate: new Date("2023-01-10T06:00:00.000Z"),
    },
    {
      name: "Vikram Patel",
      phoneNumber: "+919876500001",
      isPaid: true,
      attendanceDays: 215, // Unlocks Bronze, Silver, Gold!
      startDate: new Date("2024-01-15T06:00:00.000Z"),
    },
    {
      name: "Ananya Verma",
      phoneNumber: "+919876500002",
      isPaid: true,
      attendanceDays: 65, // Unlocks Bronze (50)!
      startDate: new Date("2024-05-01T06:00:00.000Z"),
    },
    {
      name: "Rahul Gupta",
      phoneNumber: "+919876500003",
      isPaid: true,
      attendanceDays: 20, // Beginner - 0 unlocked (20/50 days)
      startDate: new Date("2024-08-01T06:00:00.000Z"),
    },
    {
      name: "Amit Singh",
      phoneNumber: "+919876500004",
      isPaid: false, // Free trial only
      attendanceDays: 10,
      startDate: new Date("2024-09-01T06:00:00.000Z"),
    },
  ];

  for (const item of testUsersData) {
    console.log(`Setting up user: ${item.name} (${item.phoneNumber})...`);

    // Clean up existing user if present
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { phoneNumber: item.phoneNumber },
          { phoneNumber: item.phoneNumber.replace("+91", "") },
        ],
      },
    });

    if (existing) {
      await prisma.attendance.deleteMany({ where: { userId: existing.id } });
      await prisma.subscription.deleteMany({ where: { userId: existing.id } });
      await prisma.user.delete({ where: { id: existing.id } });
    }

    // Create user
    const referralCode = `${item.name.toLowerCase().replace(/[^a-z]/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`;
    const user = await prisma.user.create({
      data: {
        name: item.name,
        phoneNumber: item.phoneNumber,
        email: `${item.name.toLowerCase().replace(/[^a-z]/g, "")}@example.com`,
        role: "USER",
        referralCode,
      },
    });

    // Create subscription
    const planToUse = item.isPaid ? paidPlan : freePlan;
    const sub = await prisma.subscription.create({
      data: {
        userId: user.id,
        planId: planToUse.id,
        startDate: item.startDate,
        baseDuration: 365,
        expiresAt: new Date(item.startDate.getTime() + 365 * 24 * 60 * 60 * 1000),
        status: "active",
      },
    });

    // Create attendance records
    if (item.attendanceDays > 0) {
      console.log(`  Adding ${item.attendanceDays} attendance days...`);
      for (let i = 0; i < item.attendanceDays; i++) {
        // Skip every 7th day (Sundays off) to create realistic non-continuous dates
        const dayOffset = Math.floor(i * 1.15);
        const classDate = new Date(item.startDate.getTime() + dayOffset * 24 * 60 * 60 * 1000);

        const yogaClass = await prisma.yogaClass.create({
          data: {
            date: classDate,
            title: `Yoga Session ${item.name} - Day ${i + 1}`,
            focusArea: i % 2 === 0 ? "Asana Alignment" : "Pranayama & Flow",
            videoLink: "https://youtube.com/live/demo",
            isActive: true,
          },
        });

        await prisma.attendance.create({
          data: {
            userId: user.id,
            subscriptionId: sub.id,
            yogaClassId: yogaClass.id,
            attended: true,
            attendedAt: classDate,
          },
        });
      }
    }

    console.log(`  ✓ ${item.name} ready!`);
  }

  console.log("\n--- All dummy test users seeded successfully! ---");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
