import { Router } from 'express';
import { createProduct, deleteProduct, getProduct, listProducts, updateProduct } from '../controllers/productController.js';
import { adminOnly, protect } from '../middleware/auth.js';

const r = Router();
r.get('/', listProducts);
r.get('/:id', getProduct);
r.post('/', protect, adminOnly, createProduct);
r.put('/:id', protect, adminOnly, updateProduct);
r.delete('/:id', protect, adminOnly, deleteProduct);
export default r;
