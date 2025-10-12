import express from 'express'
import { isAdmin, isAuthenticated } from '../middleware/auth.js'
import {
  getAllPlans,
  getPlanById,
  createPlan,
  updatePlan,
  deletePlan,
  getAllAdminPlans,
} from '../controllers/plans.contoller.js'
import { createOrder, downloadInvoice, verifyPayment } from '../controllers/order.controller.js'

const router = express.Router()

// Public Routes
router.get('/plans', getAllPlans)
router.get('/plans/:id', getPlanById)

// AdminRoute
router.get('/admin/plans', getAllAdminPlans)

// Protected Routes (admin only)
router.post('/plans', isAuthenticated, isAdmin, createPlan)
router.put('/plans/:id', isAuthenticated, isAdmin, updatePlan)
router.delete('/plans/:id', isAuthenticated, isAdmin, deletePlan)

// payment Routes
router.post("/create-order", createOrder);
router.post("/verify-payment", verifyPayment);

// Invoice Routes
router.get("/download-invoice/:fileName", downloadInvoice);

export default router
