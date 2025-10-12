import { eachQuarterOfInterval } from 'date-fns';
import { prisma } from '../db/db.js'

// Create a new Plan
export const createPlan = async (req, res) => {
  try {
    console.log(req.body);
    const {
      name,
      description,
      inrPrice,
      usdPrice,
      orignalPriceInInr,
      discount,
      duration,
      durationType,
      isFreeTrial,
    } = req.body;

    const plan = await prisma.plan.create({
      data: {
        name,
        description,
        inrPrice,
        usdPrice,
        orignalPriceInInr: orignalPriceInInr,
        discount,
        duration,
        durationType,
        isFreeTrial: isFreeTrial ?? false,
      },
    });

    res.status(201).json(plan);
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Failed to create plan.', details: err.message });
  }
};

// Get all Plans
export const getAllPlans = async (req, res) => {
  try {
    const plans = await prisma.plan.findMany({
      orderBy: {
        inrPrice: 'desc',
      },
      where: {
        isFreeTrial: false,
      },
    });
    if (!plans) return res.status(404).json({ error: 'Plans not found.'});
    res.status(200).json({
      success: true,
      plans,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch plans.', details: err.message });
  }
};

// Get a single Plan by ID
export const getPlanById = async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await prisma.plan.findUnique({ where: { id } });

    if (!plan) return res.status(404).json({ error: 'Plan not found.' });

    res.status(200).json(plan);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch plan.', details: err.message });
  }
};

// Update a Plan
export const updatePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      inrPrice,
      usdPrice,
      orignalPriceInInr,
      discount,
      duration,
      durationType,
      isFreeTrial,
    } = req.body;

    console.log(req.body);

    const existingPlan = await prisma.plan.findUnique({ where: { id } });
    if (!existingPlan) return res.status(404).json({ error: 'Plan not found.' });

    const updatedPlan = await prisma.plan.update({
      where: { id },
      data: {
        name,
      description,
      inrPrice,
      usdPrice,
      orignalPriceInInr,
      discount,
      duration,
      durationType,
      isFreeTrial,
      },
    });

    res.status(200).json(updatedPlan);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update plan.', details: err.message });
  }
};

// Delete a Plan
export const deletePlan = async (req, res) => {
  try {
    const { id } = req.params;

    const existingPlan = await prisma.plan.findUnique({ where: { id } });
    if (!existingPlan) return res.status(404).json({ error: 'Plan not found.' });

    await prisma.plan.delete({ where: { id } });

    res.status(200).json({ message: 'Plan deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete plan.', details: err.message });
  }
};


export const getAllAdminPlans = async (req, res) => {
  try {
    const plans = await prisma.plan.findMany({
      orderBy: {
        inrPrice: 'desc',
      },
    });
    if (!plans) return res.status(404).json({ error: 'Plans not found.' });
    res.status(200).json({
      success: true,
      plans,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch plans.', details: err.message });
  }
};