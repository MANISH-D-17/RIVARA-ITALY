
import React from 'react';
import { User as UserIcon, ShoppingBag, Heart, LayoutDashboard, LogOut } from 'lucide-react';
import { View, User, Category } from '../types';

interface NavbarProps {
  onNavigate: (view: View, category?: Category | 'All') => void;
  onLogout: () => void;
  cartCount: number;
  wishlistCount: number;
  user: User | null;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, onLogout, cartCount, wishlistCount, user }) => {
  const categories: (Category | 'ARCHIVE')[] = ['Ladies', 'Men', 'Accessories', 'ARCHIVE'];

  return (
    <nav className="sticky top-0 z-50 bg-[#050505]/95 backdrop-blur-2xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex justify-between items-center h-28">
          {/* Atelier Navigation */}
          <div className="hidden lg:flex items-center space-x-12">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => {
                  if (item === 'ARCHIVE') {
                    onNavigate(View.HOME, 'All');
                  } else {
                    onNavigate(View.HOME, item as Category);
                  }
                  // Scroll to catalog section if already on home
                  document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-[10px] tracking-[0.5em] font-black text-white/50 hover:text-[#C6A75E] transition-all relative group uppercase"
              >
                {item}
                <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-[#C6A75E] transition-all duration-500 group-hover:w-full"></span>
              </button>
            ))}
          </div>

          {/* Maison Identity */}
          <div className="flex-1 flex justify-center">
            <button 
              onClick={() => onNavigate(View.HOME, 'All')}
              className="flex flex-col items-center group"
            >
              <span className="text-4xl font-serif tracking-[0.4em] font-black gold-text italic group-hover:scale-105 transition-transform duration-700">
                RIVARA
              </span>
              <span className="text-[10px] tracking-[1.2em] text-[#C6A75E] font-bold -mt-1 ml-2">
                ITALY
              </span>
            </button>
          </div>

          {/* Utility Command Bar */}
          <div className="flex items-center space-x-10">
            {user?.role === 'admin' && (
              <button 
                onClick={() => onNavigate(View.ADMIN_DASHBOARD)}
                className="flex flex-col items-center opacity-40 hover:opacity-100 transition-all group"
              >
                <LayoutDashboard className="w-5 h-5 text-[#C6A75E]" />
                <span className="text-[7px] tracking-[0.4em] font-black uppercase mt-1.5">Console</span>
              </button>
            )}

            <button 
              onClick={() => onNavigate(View.WISHLIST)}
              className="relative p-2 opacity-60 hover:opacity-100 transition-all group"
            >
              <Heart className={`w-5 h-5 transition-colors ${wishlistCount > 0 ? 'text-[#C6A75E] fill-[#C6A75E]' : 'group-hover:text-[#C6A75E]'}`} />
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 bg-white text-black text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-black">
                  {wishlistCount}
                </span>
              )}
            </button>
            
            <div className="flex items-center space-x-6">
              {user ? (
                <div className="flex items-center space-x-4 group cursor-pointer" onClick={() => onNavigate(View.ACCOUNT)}>
                  <div className="text-right hidden sm:block">
                    <p className="text-[9px] tracking-widest text-white font-black uppercase">{user.name}</p>
                    <p className="text-[8px] tracking-widest text-[#C6A75E] font-bold uppercase">{user.tier}</p>
                  </div>
                  <UserIcon className="w-5 h-5 text-[#C6A75E]" />
                </div>
              ) : (
                <UserIcon 
                  onClick={() => onNavigate(View.LOGIN)}
                  className="w-5 h-5 cursor-pointer hover:text-[#C6A75E] transition-all text-white/70" 
                />
              )}
            </div>

            <button 
              onClick={() => onNavigate(View.CART)}
              className="relative p-2 hover:scale-110 transition-transform"
            >
              <ShoppingBag className="w-5 h-5 text-white/70 hover:text-[#C6A75E] transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C6A75E] text-black text-[9px] w-5 h-5 rounded-full flex items-center justify-center font-black shadow-[0_0_15px_rgba(198,167,94,0.4)]">
                  {cartCount}
                </span>
              )}
            </button>
            
            {user && (
              <button onClick={onLogout} className="opacity-40 hover:opacity-100 hover:text-red-500 transition-all">
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
