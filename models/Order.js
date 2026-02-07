
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    size: String,
    color: String
  }],
  total: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['Identity Verification', 'Atelier Crafting', 'Quality Assurance', 'Global Logistics', 'Delivered'],
    default: 'Identity Verification'
  },
  maisonKey: { type: String, unique: true },
  hash: { type: String },
}, { timestamps: true });

// Generate a unique Maison Key before saving
orderSchema.pre('save', function(next) {
  if (!this.maisonKey) {
    this.maisonKey = `RVR-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    this.hash = require('crypto').createHash('sha256').update(this.maisonKey + Date.now()).digest('hex');
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
