import Category from '../models/Category.js';
import Banner from '../models/Banner.js';
import Cart from '../models/Cart.js';
import Wishlist from '../models/Wishlist.js';
import Review from '../models/Review.js';
import Product from '../models/Product.js';

export const listCategories = async (_, res) => res.json(await Category.find().sort({ name: 1 }));
export const createCategory = async (req, res) => res.status(201).json(await Category.create(req.body));
export const updateCategory = async (req, res) => res.json(await Category.findByIdAndUpdate(req.params.id, req.body, { new: true }));
export const deleteCategory = async (req, res) => { await Category.findByIdAndDelete(req.params.id); res.json({ message: 'Category removed' }); };

export const listBanners = async (_, res) => res.json(await Banner.find({ active: true }).sort({ createdAt: -1 }));
export const createBanner = async (req, res) => res.status(201).json(await Banner.create(req.body));
export const updateBanner = async (req, res) => res.json(await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true }));
export const deleteBanner = async (req, res) => { await Banner.findByIdAndDelete(req.params.id); res.json({ message: 'Banner removed' }); };

export const getWishlist = async (req, res) => res.json(await Wishlist.findOne({ user: req.user._id }).populate('products'));
export const toggleWishlist = async (req, res) => {
  let wl = await Wishlist.findOne({ user: req.user._id });
  if (!wl) wl = await Wishlist.create({ user: req.user._id, products: [] });
  const i = wl.products.findIndex((p) => p.toString() === req.params.productId);
  if (i >= 0) wl.products.splice(i, 1); else wl.products.push(req.params.productId);
  await wl.save();
  res.json(wl);
};

export const getCart = async (req, res) => res.json(await Cart.findOne({ user: req.user._id }).populate('items.product'));
export const upsertCartItem = async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
  const idx = cart.items.findIndex((item) => item.product.toString() === req.body.product);
  if (idx >= 0) cart.items[idx] = { ...cart.items[idx].toObject(), ...req.body };
  else cart.items.push(req.body);
  await cart.save();
  res.json(await cart.populate('items.product'));
};
export const removeCartItem = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.json({ items: [] });
  cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
  await cart.save();
  res.json(await cart.populate('items.product'));
};

export const listReviews = async (req, res) => res.json(await Review.find({ product: req.params.productId }).populate('user', 'name'));
export const addReview = async (req, res) => {
  const review = await Review.findOneAndUpdate(
    { user: req.user._id, product: req.params.productId },
    { ...req.body, user: req.user._id, product: req.params.productId },
    { upsert: true, new: true }
  );
  const reviews = await Review.find({ product: req.params.productId });
  const avg = reviews.reduce((a, b) => a + b.rating, 0) / (reviews.length || 1);
  await Product.findByIdAndUpdate(req.params.productId, { rating: avg, reviewCount: reviews.length });
  res.status(201).json(review);
};
