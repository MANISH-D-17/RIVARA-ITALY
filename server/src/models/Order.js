import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
        size: String,
        color: String,
        unitPrice: Number
      }
    ],
    subtotal: Number,
    shipping: Number,
    tax: Number,
    total: Number,
    status: { type: String, enum: ['Processing', 'Shipped', 'Delivered'], default: 'Processing' },
    shippingAddress: {
      fullName: String,
      address: String,
      city: String,
      postalCode: String,
      country: String
    }
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
