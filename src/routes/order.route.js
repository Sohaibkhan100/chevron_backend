import express from 'express';
import checkAuth from '../middlewares/check-auth.js';
import { createOrder } from '../controllers/order.controller.js';

const router = express.Router();

router.post('/order', checkAuth, createOrder);

export default router;
