import express  from 'express';
import { getUserSubscription } from '../controllers/user.controller.js';
const router = express.Router();

router.get("/subscription/:userId",getUserSubscription);


export default router