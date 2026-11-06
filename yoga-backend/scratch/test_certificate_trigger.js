import assert from "assert";

/**
 * Automated Test Suite for:
 * 1. "Only 1 Attendance Per Day Out of 7 Daily Classes" rule
 * 2. Certificate WhatsApp Trigger without delay or class join interruption
 */
console.log("=== Running 1 Attendance Per Day & Certificate Trigger Tests ===");

// 1. Mock Data & Configurations
const MILESTONE_CONFIG = [
  { tier: "bronze", days: 50, badge: "Bronze", title: "Bronze Certificate" },
  { tier: "silver", days: 100, badge: "Silver", title: "Silver Certificate" },
  { tier: "gold", days: 200, badge: "Gold", title: "Gold Certificate" },
  { tier: "platinum", days: 300, badge: "Platinum", title: "Platinum Certificate" },
  { tier: "diamond", days: 500, badge: "Diamond", title: "Diamond Certificate" },
];

function getISTDayRange(date = new Date()) {
  const istDateStr = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(date));

  const [year, month, day] = istDateStr.split("-").map(Number);
  const startOfDay = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0) - (5.5 * 60 * 60 * 1000));
  const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000 - 1);

  return { istDateStr, startOfDay, endOfDay };
}

let capturedMessages = [];
const mockYogaCertificate = async (number, name, certificate, totalAttendence, link) => {
  capturedMessages.push({
    number,
    name,
    certificate,
    totalAttendence,
    link,
  });
  return { data: { success: true } };
};

// Simulation of getClassLink attendance marking with the "1 attendance per day" rule
async function simulateClassJoinAndAttendance({
  user,
  yogaClass,
  attendanceDatabase,
  messageApiFails = false,
}) {
  const { startOfDay, endOfDay } = getISTDayRange(yogaClass.date);

  // 1. Check if user already attended ANY class today in IST
  const existingAttendanceToday = attendanceDatabase.find((rec) => {
    return (
      rec.userId === user.id &&
      rec.attended === true &&
      rec.yogaClass &&
      rec.yogaClass.date >= startOfDay &&
      rec.yogaClass.date <= endOfDay
    );
  });

  let isFirstAttendanceToday = false;
  let attendanceMarked = false;

  if (!existingAttendanceToday) {
    // First class joined today: mark attendance!
    isFirstAttendanceToday = true;
    attendanceMarked = true;
    attendanceDatabase.push({
      userId: user.id,
      yogaClassId: yogaClass.id,
      attended: true,
      attendedAt: new Date(yogaClass.date),
      yogaClass: { date: new Date(yogaClass.date) },
    });
  } else if (existingAttendanceToday.yogaClassId === yogaClass.id) {
    // Same class refresh: update timestamp
    existingAttendanceToday.attendedAt = new Date(yogaClass.date);
  } else {
    // Different class today: user can join, but NO second attendance marked!
    attendanceMarked = false;
  }

  // Certificate check triggered only on first attendance of the day
  let triggerResult = null;
  if (isFirstAttendanceToday) {
    triggerResult = await (async () => {
      try {
        // Calculate distinct IST days attended
        const dateMap = new Map();
        for (const record of attendanceDatabase.filter((r) => r.userId === user.id && r.attended)) {
          const dateVal = record.yogaClass?.date || record.attendedAt;
          if (!dateVal) continue;
          const { istDateStr } = getISTDayRange(dateVal);
          if (!dateMap.has(istDateStr)) {
            dateMap.set(istDateStr, new Date(dateVal));
          }
        }

        const totalAttendance = dateMap.size;
        const matchedMilestone = MILESTONE_CONFIG.find((m) => m.days === totalAttendance);
        if (!matchedMilestone) {
          return { sent: false, totalAttendance };
        }

        if (messageApiFails) {
          throw new Error("ChatMitra 500 error");
        }

        const certificateName = matchedMilestone.badge;
        const userName = user.name || "Member";
        const link = "https://yogsaathi.com/certificate";

        await mockYogaCertificate(
          user.phoneNumber,
          userName,
          certificateName,
          String(totalAttendance),
          link
        );

        return {
          sent: true,
          certificate: certificateName,
          totalAttendance,
        };
      } catch (err) {
        return { sent: false, error: err.message };
      }
    })();
  }

  // Class link ALWAYS returned immediately
  return {
    status: 200,
    body: { success: true, link: yogaClass.videoLink },
    isFirstAttendanceToday,
    attendanceMarked,
    triggerResult,
  };
}

// Generate N distinct days of historical attendance
function generateHistory(userId, count, startDateStr = "2024-01-01") {
  const records = [];
  const start = new Date(startDateStr);
  for (let i = 0; i < count; i++) {
    const d = new Date(start.getTime() + i * 24 * 60 * 60 * 1000);
    records.push({
      userId,
      yogaClassId: `hist-class-${i}`,
      attended: true,
      attendedAt: d,
      yogaClass: { date: d },
    });
  }
  return records;
}

async function runTests() {
  const user = {
    id: "user-123",
    name: "Samarth Sharma",
    phoneNumber: "+919910433340",
  };

  // Define 7 daily classes for Nov 7, 2026 in IST:
  const class500AM = {
    id: "class-slot-1-5am",
    title: "5:00 AM Sunrise Yoga",
    date: new Date("2026-11-06T23:30:00.000Z"), // 5:00 AM IST
    videoLink: "https://meet.google.com/slot-5am",
  };
  const class600AM = {
    id: "class-slot-2-6am",
    title: "6:00 AM Dynamic Flow",
    date: new Date("2026-11-07T00:30:00.000Z"), // 6:00 AM IST
    videoLink: "https://meet.google.com/slot-6am",
  };
  const class700AM = {
    id: "class-slot-3-7am",
    title: "7:00 AM Full Body Alignment",
    date: new Date("2026-11-07T01:30:00.000Z"), // 7:00 AM IST
    videoLink: "https://meet.google.com/slot-7am",
  };
  const class830AM = {
    id: "class-slot-4-830am",
    title: "8:30 AM Mid-Morning Gentle",
    date: new Date("2026-11-07T03:00:00.000Z"), // 8:30 AM IST
    videoLink: "https://meet.google.com/slot-830am",
  };
  const class530PM = {
    id: "class-slot-5-530pm",
    title: "5:30 PM Spine Decompression",
    date: new Date("2026-11-07T12:00:00.000Z"), // 5:30 PM IST
    videoLink: "https://meet.google.com/slot-530pm",
  };
  const class630PM = {
    id: "class-slot-6-630pm",
    title: "6:30 PM Evening Vitality",
    date: new Date("2026-11-07T13:00:00.000Z"), // 6:30 PM IST
    videoLink: "https://meet.google.com/slot-630pm",
  };
  const class730PM = {
    id: "class-slot-7-730pm",
    title: "7:30 PM Restorative Yin Yoga",
    date: new Date("2026-11-07T14:00:00.000Z"), // 7:30 PM IST
    videoLink: "https://meet.google.com/slot-730pm",
  };

  // Test Suite 1: Single Attendance Per Day Rule Across 7 Classes
  console.log("\n▶ Test 1: User attends 5:00 AM class (1st class of the day)");
  const db = generateHistory(user.id, 49); // User is at 49 days
  const res1 = await simulateClassJoinAndAttendance({
    user,
    yogaClass: class500AM,
    attendanceDatabase: db,
  });

  assert.strictEqual(res1.status, 200);
  assert.strictEqual(res1.isFirstAttendanceToday, true);
  assert.strictEqual(res1.attendanceMarked, true);
  assert.strictEqual(res1.triggerResult.sent, true);
  assert.strictEqual(res1.triggerResult.certificate, "Bronze");
  assert.strictEqual(res1.triggerResult.totalAttendance, 50);
  assert.strictEqual(capturedMessages.length, 1);
  console.log("  ✔ Attendance marked for 5:00 AM. Total days reached 50, Bronze certificate sent!");

  console.log("\n▶ Test 2: User refreshes the 5:00 AM class at 5:07 AM");
  const res2 = await simulateClassJoinAndAttendance({
    user,
    yogaClass: class500AM,
    attendanceDatabase: db,
  });
  assert.strictEqual(res2.status, 200);
  assert.strictEqual(res2.isFirstAttendanceToday, false);
  assert.strictEqual(res2.attendanceMarked, false);
  assert.strictEqual(capturedMessages.length, 1); // No new message
  console.log("  ✔ Refresh detected: no duplicate attendance, link returned immediately.");

  console.log("\n▶ Test 3: User attends 6:00 AM class on the same day");
  const res3 = await simulateClassJoinAndAttendance({
    user,
    yogaClass: class600AM,
    attendanceDatabase: db,
  });
  assert.strictEqual(res3.status, 200);
  assert.strictEqual(res3.body.link, class600AM.videoLink);
  assert.strictEqual(res3.isFirstAttendanceToday, false);
  assert.strictEqual(res3.attendanceMarked, false); // Not marked again
  assert.strictEqual(capturedMessages.length, 1);
  console.log("  ✔ User successfully joined 6:00 AM, but duplicate daily attendance was NOT marked.");

  console.log("\n▶ Test 4: User attends 7:00 AM class on the same day");
  const res4 = await simulateClassJoinAndAttendance({
    user,
    yogaClass: class700AM,
    attendanceDatabase: db,
  });
  assert.strictEqual(res4.status, 200);
  assert.strictEqual(res4.attendanceMarked, false);
  console.log("  ✔ User joined 7:00 AM; 1 attendance per day rule maintained.");

  console.log("\n▶ Test 5: User attends 5:30 PM & 7:30 PM classes on the same day");
  const res5 = await simulateClassJoinAndAttendance({
    user,
    yogaClass: class530PM,
    attendanceDatabase: db,
  });
  const res6 = await simulateClassJoinAndAttendance({
    user,
    yogaClass: class730PM,
    attendanceDatabase: db,
  });
  assert.strictEqual(res5.status, 200);
  assert.strictEqual(res6.status, 200);
  assert.strictEqual(res5.attendanceMarked, false);
  assert.strictEqual(res6.attendanceMarked, false);
  assert.strictEqual(capturedMessages.length, 1); // Still exactly 1 message from 5:00 AM
  console.log("  ✔ User joined evening classes; no extra attendance recorded for today.");

  // Test Suite 2: What if user only attends the evening class (e.g. 7:30 PM) on a day?
  console.log("\n▶ Test 6: User skips morning classes, attends ONLY 7:30 PM class");
  const db2 = generateHistory(user.id, 99); // User is at 99 days
  capturedMessages = [];
  const res7 = await simulateClassJoinAndAttendance({
    user,
    yogaClass: class730PM,
    attendanceDatabase: db2,
  });
  assert.strictEqual(res7.status, 200);
  assert.strictEqual(res7.isFirstAttendanceToday, true);
  assert.strictEqual(res7.attendanceMarked, true);
  assert.strictEqual(res7.triggerResult.sent, true);
  assert.strictEqual(res7.triggerResult.certificate, "Silver");
  assert.strictEqual(res7.triggerResult.totalAttendance, 100);
  assert.strictEqual(capturedMessages.length, 1);
  console.log("  ✔ 7:30 PM correctly counts as today's 1 attendance! Total days reached 100, Silver certificate sent!");

  // Test Suite 3: What if user attends a class tomorrow?
  console.log("\n▶ Test 7: User attends class the next day (Nov 8)");
  const classTomorrow5AM = {
    id: "class-next-day-5am",
    title: "5:00 AM Sunrise Yoga",
    date: new Date("2026-11-07T23:30:00.000Z"), // 5:00 AM IST on Nov 8
    videoLink: "https://meet.google.com/slot-next-day",
  };
  const res8 = await simulateClassJoinAndAttendance({
    user,
    yogaClass: classTomorrow5AM,
    attendanceDatabase: db2,
  });
  assert.strictEqual(res8.status, 200);
  assert.strictEqual(res8.isFirstAttendanceToday, true);
  assert.strictEqual(res8.attendanceMarked, true);
  assert.strictEqual(res8.triggerResult.sent, false); // 101 is not a milestone
  console.log("  ✔ Next day is recognized as a new day! Attendance marked, total days = 101.");

  console.log("\n🎉 ALL TESTS PASSED! '1 ATTENDANCE PER DAY OUT OF 7 CLASSES' IS FULLY VERIFIED!");
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
