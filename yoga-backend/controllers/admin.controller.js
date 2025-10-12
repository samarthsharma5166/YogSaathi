import { prisma } from "../db/db.js";
import { subMonths, startOfMonth, endOfMonth } from 'date-fns';

// ----------Get All Users----------
export const getAllUsersAdmin = async (req, res) => {
  try {
    const { usertype } = req.query;

    if (usertype === "Freetrial") {
      const users = await prisma.user.findMany({
        where: {
          subscription: {
            some: {
              plan: {
                isFreeTrial: true,
              },
            },
          },
        },
        include: {
          referredBy: true,
          subscription: {
            include: {
              plan: true,
            },
          },
        },
        orderBy:{
          createdAt:"desc"
        }
      });

      return res.status(200).json({ success: true, users });
    }

    if (usertype === "Subscribed") {
      const users = await prisma.user.findMany({
        where: {
          subscription: {
            some: {
              plan: {
                isFreeTrial: false,
              },
            },
          },
        },
        include: {
          referredBy: true,
          subscription: {
            include: {
              plan: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc"
        }
      });

      return res.status(200).json({ success: true, users });
    }

    if (usertype === "All") {
      const users = await prisma.user.findMany({
        include: {
          referredBy: true,
          subscription: {
            include: {
              plan: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc"
        }
      });

      return res.status(200).json({ success: true, users });
    }

    // If no valid usertype provided
    return res.status(400).json({ error: "Invalid usertype" });

  } catch (err) {
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

export const removeUser = async(req,res) =>{
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    })

    

    if(!user){
      return res.status(404).json({ message: "User not found" });
    }

    const subscription = await prisma.subscription.findUnique({
      where: {
        userId
      }
    })

    if (subscription) {
      await prisma.subscription.delete({
        where: {
          userId
        }
      })
    }

    await prisma.user.delete({
      where: {
        id: userId
      }
    })
    return res.status(200).json({success: true, id:user.id, message: "User deleted successfully" });
  } catch (error) {
    console.error("❌ Error in getAllUsers:", error.message);
    res.status(500).json({ message: "Failed to fetch users" });
  }
}