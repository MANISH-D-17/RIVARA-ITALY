import { Link } from 'react-router-dom';
import { Heart, Menu, ShoppingBag } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-luxeBlack/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link className="font-serif text-2xl gold-text" to="/">RIVARA-ITALY</Link>
        <nav className="hidden gap-8 md:flex"><Link to="/shop">Shop</Link><Link to="/admin">Admin</Link></nav>
        <div className="flex items-center gap-3"><Heart size={18} /><ShoppingBag size={18} /><Menu className="md:hidden" size={18} /></div>
      </div>
    </header>
  );
}
