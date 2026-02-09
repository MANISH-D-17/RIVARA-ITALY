import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    price: { type: Number, required: true },
    discountPercent: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    colors: [{ type: String }],
    sizes: [{ type: String }],
    images: [{ type: String }],
    featured: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);
