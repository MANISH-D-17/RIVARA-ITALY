
const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
  try {
    const { items, total } = req.body;
    const order = await Order.create({
      user: req.user._id,
      items: items.map(item => ({
        product: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
        size: item.size,
        color: item.color
      })),
      total
    });
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'name email').sort('-createdAt');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
