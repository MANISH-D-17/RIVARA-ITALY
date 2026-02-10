import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Hero3D from '../components/Hero3D';
import ProductCard from '../components/ProductCard';
import api from '../services/api';

const categories = ['Men', 'Women', 'Kids', 'Beauty', 'Accessories'];

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    api.get('/products?featured=true').then((r) => setProducts(r.data)).catch(() => setProducts([]));
    api.get('/banners').then((r) => setBanners(r.data)).catch(() => setBanners([]));
  }, []);

  return (
    <div className="space-y-14 px-4 py-8 md:px-8">
      <section className="grid items-center gap-8 md:grid-cols-2">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-white/70">Luxury Fashion House</p>
          <h1 className="mt-4 font-serif text-5xl leading-tight md:text-6xl">Wear <span className="gold-text">Power</span>, Styled in Italy.</h1>
          <p className="mt-4 max-w-xl text-white/75">Editorial minimal fashion curated for bold personalities. Crafted silhouettes, premium cuts, and iconic details.</p>
          <button className="mt-6 rounded-full bg-gold-gradient px-8 py-3 text-black">Explore Collection</button>
        </div>
        <Hero3D />
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        {(banners.length ? banners : [{ title: 'Golden Winter Edit', subtitle: 'Up to 35% on selected couture.' }]).map((b, i) => (
          <motion.div key={i} whileHover={{ scale: 1.01 }} className="glass rounded-2xl border border-white/10 p-5">
            <h3 className="font-serif text-2xl">{b.title}</h3>
            <p className="text-white/70">{b.subtitle}</p>
          </motion.div>
        ))}
      </section>

      <section>
        <h2 className="mb-4 font-serif text-3xl">Categories</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">{categories.map((c) => <div key={c} className="glass rounded-xl p-5 text-center">{c}</div>)}</div>
      </section>

      <section>
        <h2 className="mb-4 font-serif text-3xl">Luxury Picks</h2>
        <div className="grid gap-4 md:grid-cols-3">{products.slice(0, 6).map((p) => <ProductCard key={p._id} product={p} />)}</div>
      </section>

      <section className="glass rounded-2xl border border-white/10 p-8 text-center">
        <h2 className="font-serif text-3xl">Join the RIVARA Circle</h2>
        <div className="mx-auto mt-4 flex max-w-xl gap-2"><input className="w-full rounded-lg bg-black/40 p-3" placeholder="Enter your email" /><button className="rounded-lg bg-gold-gradient px-5 text-black">Subscribe</button></div>
      </section>
    </div>
  );
}
