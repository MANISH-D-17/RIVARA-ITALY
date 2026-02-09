import { Router } from 'express';
import { addReview, createBanner, createCategory, deleteBanner, deleteCategory, getCart, getWishlist, listBanners, listCategories, listReviews, removeCartItem, toggleWishlist, updateBanner, updateCategory, upsertCartItem } from '../controllers/commonController.js';
import { adminOnly, protect } from '../middleware/auth.js';

const r = Router();
r.get('/categories', listCategories);
r.post('/categories', protect, adminOnly, createCategory);
r.put('/categories/:id', protect, adminOnly, updateCategory);
r.delete('/categories/:id', protect, adminOnly, deleteCategory);

r.get('/banners', listBanners);
r.post('/banners', protect, adminOnly, createBanner);
r.put('/banners/:id', protect, adminOnly, updateBanner);
r.delete('/banners/:id', protect, adminOnly, deleteBanner);

r.get('/wishlist', protect, getWishlist);
r.post('/wishlist/:productId', protect, toggleWishlist);

r.get('/cart', protect, getCart);
r.post('/cart', protect, upsertCartItem);
r.delete('/cart/:productId', protect, removeCartItem);

r.get('/reviews/:productId', listReviews);
r.post('/reviews/:productId', protect, addReview);

export default r;
