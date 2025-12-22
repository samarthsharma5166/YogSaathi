import express from 'express';
import { createOffer, deleteOffer, getActiveOffer, getAllOffers, updateOffer } from '../controllers/offer.controller.js';
import { isAdmin, isAuthenticated } from '../middleware/auth.js';
const router = express.Router();

// Public route to get active offer
router.get('/active', getActiveOffer);

// Admin routes
router.post('/', isAuthenticated, isAdmin, createOffer);
router.get('/all', isAuthenticated, isAdmin, getAllOffers);
router.put('/:id', isAuthenticated, isAdmin, updateOffer);
router.delete('/:id', isAuthenticated, isAdmin, deleteOffer);

export default router;
