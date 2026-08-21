export const YOGA_CARE_PLANS = {
  india: {
    individual: {
      trial: { amount: 199, currency: "INR", duration: 0, label: "Trial Class" },
      "1_month": { amount: 6000, originalAmount: 12000, discount: "50% Off", currency: "INR", duration: 1, label: "1 Month" },
      "3_month": { amount: 16500, originalAmount: 36000, discount: "54% Off", currency: "INR", duration: 3, label: "3 Months" },
      "6_month": { amount: 30000, originalAmount: 72000, discount: "58% Off", currency: "INR", duration: 6, label: "6 Months" }
    },
    group_2_5: {
      trial: { amount: 199, currency: "INR", duration: 0, label: "Trial Class" },
      "1_month": { amount: 3000, originalAmount: 6000, discount: "50% Off", currency: "INR", duration: 1, label: "1 Month" },
      "3_month": { amount: 7500, originalAmount: 18000, discount: "58% Off", currency: "INR", duration: 3, label: "3 Months" },
      "6_month": { amount: 12500, originalAmount: 36000, discount: "65% Off", currency: "INR", duration: 6, label: "6 Months" }
    }
  },
  international: {
    individual: {
      trial: { amount: 10, currency: "USD", duration: 0, label: "Trial Class" },
      "1_month": { amount: 200, currency: "USD", duration: 1, label: "1 Month" },
      "3_month": { amount: 525, currency: "USD", duration: 3, label: "3 Months" },
      "6_month": { amount: 950, currency: "USD", duration: 6, label: "6 Months" }
    },
    group_2_5: {
      trial: { amount: 10, currency: "USD", duration: 0, label: "Trial Class" },
      "1_month": { amount: 150, currency: "USD", duration: 1, label: "1 Month" },
      "3_month": { amount: 400, currency: "USD", duration: 3, label: "3 Months" },
      "6_month": { amount: 700, currency: "USD", duration: 6, label: "6 Months" }
    }
  }
};

export const YOGA_CARE_PROGRAMS = [
  { id: "general-fitness", name: "YogaCare – Personalised General Fitness", emoji: "1️⃣" },
  { id: "weight-management", name: "YogaCare – Weight Management", emoji: "2️⃣" },
  { id: "diabetes-support", name: "YogaCare – Diabetes Support", emoji: "3️⃣" },
  { id: "bp-heart-health", name: "YogaCare – BP & Heart Health", emoji: "4️⃣" },
  { id: "joint-knee-care", name: "YogaCare – Joint & Knee Care", emoji: "5️⃣" },
  { id: "back-cervical-care", name: "YogaCare – Back & Cervical Care", emoji: "6️⃣" },
  { id: "pcod-pcos-womens-wellness", name: "YogaCare – PCOD/PCOS & Women’s Wellness", emoji: "7️⃣" },
  { id: "stress-sleep", name: "YogaCare – Stress & Sleep", emoji: "8️⃣" },
  { id: "senior-citizens-wellness", name: "YogaCare – Senior Citizens’ Wellness", emoji: "9️⃣" },
  { id: "posture-mobility", name: "YogaCare – Posture & Mobility", emoji: "🔟" }
];
