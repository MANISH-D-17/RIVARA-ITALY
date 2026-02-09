import { motion } from 'framer-motion';

export default function ProductCard({ product }) {
  const finalPrice = product.price * (1 - (product.discountPercent || 0) / 100);
  return (
    <motion.article whileHover={{ y: -4 }} className="glass rounded-xl border border-white/10 p-4">
      <img className="h-56 w-full rounded-lg object-cover" src={product.images?.[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900'} alt={product.name} />
      <h3 className="mt-3 font-serif text-xl">{product.name}</h3>
      <p className="text-sm text-white/70">{product.description?.slice(0, 90)}</p>
      <p className="mt-2"><span className="gold-text font-semibold">€{finalPrice.toFixed(2)}</span> {product.discountPercent ? <span className="ml-2 text-xs line-through">€{product.price}</span> : null}</p>
      <button className="mt-3 w-full rounded-lg bg-gold-gradient px-3 py-2 text-black">Add to Cart</button>
    </motion.article>
  );
}
