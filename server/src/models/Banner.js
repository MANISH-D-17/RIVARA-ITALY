import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema(
  {
    title: String,
    subtitle: String,
    image: String,
    ctaText: String,
    ctaLink: String,
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model('Banner', bannerSchema);
