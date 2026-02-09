import { Router } from 'express';
import { allOrders, createOrder, dashboard, myOrders, updateOrderStatus } from '../controllers/orderController.js';
import { adminOnly, protect } from '../middleware/auth.js';

const r = Router();
r.post('/', protect, createOrder);
r.get('/mine', protect, myOrders);
r.get('/', protect, adminOnly, allOrders);
r.put('/:id/status', protect, adminOnly, updateOrderStatus);
r.get('/admin/dashboard', protect, adminOnly, dashboard);
export default r;
