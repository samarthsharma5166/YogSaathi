import { prisma } from "../db/db.js";
import { subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { Parser } from 'json2csv';

// ----------Get All Users----------
export const getAllUsersAdmin = async (req, res) => {
  try {
    const { usertype = "ALL", startDate, endDate } = req.query;
    const now = new Date();

    const whereClause = {};
    if (startDate && endDate) {
      whereClause.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    // 1. Fetch all users with their subscriptions
    const allUsers = await prisma.user.findMany({
      where: whereClause,
      include: {
        subscription: {
          orderBy: { createdAt: 'desc' },
          include: { plan: true },
        },
      },
    });

    // 2. Fetch Dietician Leads
    const dieticianLeads = await prisma.dieticianLead.findMany({
      where: startDate && endDate ? {
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      } : {}
    });

    // 3. Fetch Paid Dietician Registrations
    const paidDieticianRegistrations = await prisma.dieticianSessionRegistration.findMany({
      where: { status: "PAID" },
      select: { phone: true, email: true },
    });
    const dieticianPhones = new Set(paidDieticianRegistrations.map(r => r.phone).filter(Boolean));
    const cleanDieticianPhones = new Set(paidDieticianRegistrations.map(r => r.phone?.replace(/^\+91/, "")).filter(Boolean));
    const dieticianEmails = new Set(paidDieticianRegistrations.map(r => r.email?.toLowerCase()).filter(Boolean));

    const isDieticianMatch = (user) => {
      const userPhone = user.phoneNumber;
      const cleanPhone = userPhone ? userPhone.replace(/^\+91/, "") : null;
      const userEmail = user.email ? user.email.toLowerCase() : null;

      return (
        (userPhone && (dieticianPhones.has(userPhone) || dieticianPhones.has(`+91${userPhone}`))) ||
        (cleanPhone && cleanDieticianPhones.has(cleanPhone)) ||
        (userEmail && dieticianEmails.has(userEmail))
      );
    };

    // 4. Categorize users and build counts
    const categorized = {
      "ALL": allUsers,
      "ADMIN": [],
      "Active-Free-Trial": [],
      "Inactive-Free-Trial": [],
      "Active-Subscribers": [],
      "Inactive-Subscribers": [],
      "Active-Trial-And-Subscribers": [],
      "Dietician-Registrants": [],
      "Free-Trial-And-Dietician-Registrants": [],
      "Dietician-Leads": dieticianLeads.map(lead => ({
        id: lead.id,
        name: lead.name,
        phoneNumber: lead.mobile,
        email: null,
        role: "USER",
        subscription: []
      })),
    };

    for (const user of allUsers) {
      if (user.role === "ADMIN") {
        categorized["ADMIN"].push(user);
      }

      const activePaidSub = user.subscription?.find(s => !s.plan.isFreeTrial && new Date(s.expiresAt) >= now && new Date(s.startDate) <= now);
      const activeTrialSub = user.subscription?.find(s => s.plan.isFreeTrial && new Date(s.expiresAt) >= now && new Date(s.startDate) <= now);
      const hasTrial = user.subscription?.some(s => s.plan.isFreeTrial);
      const hasPaid = user.subscription?.some(s => !s.plan.isFreeTrial);

      if (activeTrialSub) {
        categorized["Active-Free-Trial"].push(user);
      }
      if (hasTrial && !activeTrialSub && !activePaidSub) {
        categorized["Inactive-Free-Trial"].push(user);
      }
      if (activePaidSub) {
        categorized["Active-Subscribers"].push(user);
      }
      if (hasPaid && !activePaidSub) {
        categorized["Inactive-Subscribers"].push(user);
      }
      if (activeTrialSub || activePaidSub) {
        categorized["Active-Trial-And-Subscribers"].push(user);
      }

      if (isDieticianMatch(user)) {
        categorized["Dietician-Registrants"].push(user);
        if (hasTrial) {
          categorized["Free-Trial-And-Dietician-Registrants"].push(user);
        }
      }
    }

    const counts = {
      "ALL": categorized["ALL"].length,
      "ADMIN": categorized["ADMIN"].length,
      "Active-Free-Trial": categorized["Active-Free-Trial"].length,
      "Inactive-Free-Trial": categorized["Inactive-Free-Trial"].length,
      "Active-Subscribers": categorized["Active-Subscribers"].length,
      "Inactive-Subscribers": categorized["Inactive-Subscribers"].length,
      "Active-Trial-And-Subscribers": categorized["Active-Trial-And-Subscribers"].length,
      "Dietician-Registrants": categorized["Dietician-Registrants"].length,
      "Free-Trial-And-Dietician-Registrants": categorized["Free-Trial-And-Dietician-Registrants"].length,
      "Dietician-Leads": categorized["Dietician-Leads"].length,
    };

    // Normalize usertype for singular/plural
    const normalizedType = usertype === "Inactive-Subscriber" ? "Inactive-Subscribers" : usertype;
    const users = categorized[normalizedType] || categorized["ALL"];

    return res.status(200).json({ success: true, users, counts });
  } catch (err) {
    console.error("Error in getAllUsersAdmin:", err);
    res.status(500).json({
      error: "Failed to fetch users.",
      details: err.message,
    });
  }
};
// ----------Get All Users That Subscribed To A Plan----------
export const getPaidSubscribers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        subscription: {
          plan: {
            isFreeTrial: false,
          },
        },
      },
      include: {
        subscription: {
          include: {
            plan: true,
          },
        },
      },
    });

    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Error fetching paid subscribers:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ----------Get Analytics----------
export const getAnalytics = async (req, res) => {
  try {
    const numberOfMonths = 6; // Last 6 months
    const now = new Date();

    const months = Array.from({ length: numberOfMonths }, (_, i) => {
      const date = subMonths(now, i);
      return {
        label: date.toLocaleString('default', { month: 'short', year: 'numeric' }),
        start: startOfMonth(date),
        end: endOfMonth(date),
      };
    }).reverse(); // To make it chronological

    const userGrowth = [];
    const subscriptionGrowth = [];

    for (const month of months) {
      const usersCount = await prisma.user.count({
        where: {
          createdAt: {
            gte: month.start,
            lte: month.end,
          },
        },
      });

      const subscriptions = await prisma.subscription.findMany({
        where: {
          createdAt: {
            gte: month.start,
            lte: month.end,
          },
        },
        include: {
          plan: true,
        },
      });

      const freeTrialCount = subscriptions.filter(sub => sub.plan.isFreeTrial).length;
      const paidCount = subscriptions.filter(sub => !sub.plan.isFreeTrial).length;

      userGrowth.push({
        month: month.label,
        usersRegistered: usersCount,
      });

      subscriptionGrowth.push({
        month: month.label,
        totalSubscriptions: subscriptions.length,
        freeTrial: freeTrialCount,
        paid: paidCount,
      });
    }

    return res.json({
      userGrowth,
      subscriptionGrowth,
    });
  } catch (error) {
    console.error('Analytics fetch error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getUserDetails = async (req, res) => {
  try {

    const { userId } = req.params;
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      },
      include: {
        referredBy: true,
        subscription: {
          include: {
            plan: true,
          },
        },
        referrals: true,
      }
      
    })

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    console.error("❌ Error in getAllUsers:", error.message);
    res.status(500).json({ message: "Failed to fetch users" });
  }
}

export const removeUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Safety check: Prevent admin from deleting their own account
    if (req.user?.id === userId) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own logged-in admin account.",
      });
    }

    await prisma.$transaction(async (tx) => {
      // 1. Delete all attendance records associated with this user
      await tx.attendance.deleteMany({
        where: { userId },
      });

      // 2. Delete all payments associated with this user
      await tx.payment.deleteMany({
        where: { userId },
      });

      // 3. Delete all subscriptions associated with this user
      await tx.subscription.deleteMany({
        where: { userId },
      });

      // 4. Delete blogs authored by this user
      await tx.blog.deleteMany({
        where: { authorId: userId },
      });

      // 5. Unlink referred users (users who were referred by this user)
      await tx.user.updateMany({
        where: { referredById: userId },
        data: { referredById: null },
      });

      // 6. Delete the user
      await tx.user.delete({
        where: { id: userId },
      });
    });

    return res.status(200).json({
      success: true,
      id: user.id,
      message: `User ${user.name} deleted successfully`,
    });
  } catch (error) {
    console.error("❌ Error in removeUser:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
      details: error.message,
    });
  }
};


export const downloadAttendance = async (req, res) => {
  try {
    const { usertype, startDate, endDate } = req.query;
    const now = new Date();

    let users = [];
    const whereClause = {};

    if (startDate && endDate) {
      whereClause.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    if (usertype === "ALL") {
      users = await prisma.user.findMany({
        include: {
          subscription: {
            orderBy: {
              createdAt: 'desc',
            },
            include: {
              plan: true,
            },
          },
        },
      });
    } else if (usertype === "ADMIN") {

      users = await prisma.user.findMany({
        where: {
          role: "ADMIN"
        },
      });
    } else {
      const allUsers = await prisma.user.findMany({
        include: {
          subscription: {
            orderBy: {
              createdAt: 'desc',
            },
            include: {
              plan: true,
            },
          },
        },
      });

      users = allUsers.filter(user => {
        if (user.subscription.length === 0) {
          if (usertype === "New-Users") {
            return true;
          }
          return false;
        }
        const latestSubscription = user.subscription[0];
        const isActive = latestSubscription.expiresAt >= now;
        const isFreeTrial = latestSubscription.plan.isFreeTrial;

        switch (usertype) {
          case "Active-Free-Trial":
            return isFreeTrial && isActive;
          case "Inactive-Free-Trial":
            return isFreeTrial && !isActive;
          case "Active-Subscribers":
            return !isFreeTrial && isActive;
          case "Inactive-Subscriber":
            return !isFreeTrial && !isActive;
          default:
            return false;
        }
      });
    }

    const userIDs = users.map(user => user.id);

    const attendanceRecords = await prisma.attendance.findMany({
      where: {
        userId: { in: userIDs },
        yogaClass: {
          date: {
            gte: new Date(startDate),
            lte: new Date(endDate)
          }
        }
      },
      include: {
        user: true,
        yogaClass: true,
      },
    });

    if (attendanceRecords.length === 0) {
      throw new Error("No attendance records found for the selected criteria.");
      return
    }

    
    const attendanceData = users.map(user => {
      const userAttendance = attendanceRecords.filter(
        record => record.userId === user.id
      );

      const attendance = userAttendance.reduce((acc, record) => {
        const classDate = record.yogaClass.date.toISOString().split("T")[0];
        acc[classDate] = record.attended ? "Present" : "Absent";
        return acc;
      }, {});

      return {
        Name: user.name,
        Email: user.email,
        Phone: user.phoneNumber,
        ...attendance,
      };
    });

    const fields = ['Name', 'Email', 'Phone', ...getUniqueDates(attendanceRecords)];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(attendanceData);

    res.header('Content-Type', 'text/csv');
    res.attachment('attendance.csv');
    res.send(csv);

  } catch (err) {
    console.log(err)
    res.status(500).json({
      error: "Failed to fetch users.",
      details: err.message,
    });
  }
};

function getUniqueDates(records) {
  const dates = new Set();
  records.forEach(r => {
    dates.add(r.yogaClass.date.toISOString().split("T")[0]);
  });
  return Array.from(dates).sort();
}
