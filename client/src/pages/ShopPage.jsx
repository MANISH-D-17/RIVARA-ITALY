import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import api from '../services/api';

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  useEffect(() => { api.get('/products').then((r) => setProducts(r.data)); }, []);
  return <div className="px-4 py-8 md:px-8"><h1 className="mb-6 font-serif text-4xl">All Products</h1><div className="grid gap-4 md:grid-cols-3">{products.map((p) => <ProductCard key={p._id} product={p} />)}</div></div>;
}
