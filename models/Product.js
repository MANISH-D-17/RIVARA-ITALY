
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    required: true, 
    enum: ['Ladies', 'Men', 'Kids', 'Home', 'Beauty', 'Accessories'] 
  },
  sizes: [{ type: String }], // e.g., ['S', 'M', 'L', 'XL']
  stockQuantity: { type: Number, default: 0 },
  price: { type: Number, required: true },
  images: [{ type: String }], // Array of image URLs
  isFeatured: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
