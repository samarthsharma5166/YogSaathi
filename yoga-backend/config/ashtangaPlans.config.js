export const ASHTANGA_PLANS = {
  individual: {
    title: "Single Individual (One to One Class)",
    subtitle: "Personalised 1-on-1 attention with certified Ashtanga Yoga master",
    plans: {
      trial: {
        id: "trial",
        name: "Trial Class per person",
        classesCount: 1,
        duration: 0,
        amount: 14,
        currency: "USD",
        durationLabel: "1 Single Class",
        classDuration: "1 Hour",
        description: "1-on-1 live trial class (1 Hour) before committing to full course"
      },
      "1_month": {
        id: "1_month",
        name: "Monthly Package per person (12 Classes in 1 Month)",
        classesCount: 12,
        duration: 1,
        amount: 275,
        currency: "USD",
        durationLabel: "1 Month (12 Classes)",
        classDuration: "1 Hour",
        description: "12 live 1-on-1 classes per month (1 Hour each) focusing on Ashtanga Primary Series"
      },
      "3_month": {
        id: "3_month",
        name: "Quarterly (3 months) Package per person (36 Classes in 3 Months)",
        classesCount: 36,
        duration: 3,
        amount: 725,
        currency: "USD",
        durationLabel: "3 Months (36 Classes)",
        classDuration: "1 Hour",
        popular: true,
        description: "36 live 1-on-1 classes across 3 months (1 Hour each) with deep alignment and breathwork"
      }
    }
  },
  group: {
    title: "2 or more people (Group Class)",
    subtitle: "Interactive small group practice for family, friends, or focused peers",
    plans: {
      trial: {
        id: "trial",
        name: "Trial Class per person",
        classesCount: 1,
        duration: 0,
        amount: 10,
        currency: "USD",
        durationLabel: "1 Single Class",
        classDuration: "1 Hour",
        description: "Small group live trial class (1 Hour) with instructor"
      },
      "1_month": {
        id: "1_month",
        name: "Monthly Package per person (12 Classes in 1 Month)",
        classesCount: 12,
        duration: 1,
        amount: 200,
        currency: "USD",
        durationLabel: "1 Month (12 Classes)",
        classDuration: "1 Hour",
        description: "12 live group classes per month (1 Hour each, per person) with guided adjustments"
      },
      "3_month": {
        id: "3_month",
        name: "Quarterly (3 months) Package per person (36 Classes in 3 Months)",
        classesCount: 36,
        duration: 3,
        amount: 550,
        currency: "USD",
        durationLabel: "3 Months (36 Classes)",
        classDuration: "1 Hour",
        popular: true,
        description: "36 live group classes across 3 months (1 Hour each, per person) for consistent progress"
      }
    }
  }
};
