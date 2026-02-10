import Order from '../models/Order.js';
import Cart from '../models/Cart.js';

export const createOrder = async (req, res) => {
  const order = await Order.create({ ...req.body, user: req.user._id });
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
  res.status(201).json(order);
};

export const myOrders = async (req, res) => res.json(await Order.find({ user: req.user._id }).populate('items.product'));
export const allOrders = async (_, res) => res.json(await Order.find().populate('user', 'name email').sort({ createdAt: -1 }));
export const updateOrderStatus = async (req, res) => res.json(await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true }));

export const dashboard = async (_, res) => {
  const orders = await Order.find();
  const totalOrders = orders.length;
  const revenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  res.json({ totalOrders, revenue, customerCount: 0, topSellingProducts: [] });
};
