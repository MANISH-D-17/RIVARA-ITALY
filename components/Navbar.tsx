
import React from 'react';
import { Search, User, Heart, ShoppingBag } from 'lucide-react';
import { View } from '../types.ts';

interface NavbarProps {
  onNavigate: (view: View) => void;
  cartCount: number;
  isLoggedIn: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, cartCount, isLoggedIn }) => {
  return (
    <nav className="sticky top-0 z-50 bg-[#050505]/95 backdrop-blur-xl border-b border-white/5 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Menu Links */}
          <div className="hidden lg:flex items-center space-x-12">
            {['LADIES', 'MEN', 'KIDS', 'HOME', 'BEAUTY'].map((item) => (
              <button
                key={item}
                onClick={() => onNavigate(View.HOME)}
                className="text-[10px] tracking-[0.5em] font-black hover:text-[#C6A75E] transition-all relative group uppercase text-white/70"
              >
                {item}
                <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-[#C6A75E] transition-all duration-500 group-hover:w-full"></span>
              </button>
            ))}
          </div>

          {/* Brand Identity */}
          <div className="flex-1 flex justify-center">
            <button 
              onClick={() => onNavigate(View.HOME)}
              className="group relative flex flex-col items-center py-2 transition-transform duration-500 hover:scale-105"
            >
              <img 
                src="components/RIVARA_LOGO-removebg-preview.png" 
                alt="RIVARA ITALY" 
                className="h-16 md:h-20 w-auto object-contain brightness-0 invert opacity-90 group-hover:opacity-100 transition-opacity"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const span = target.nextElementSibling as HTMLElement;
                  if (span) span.style.display = 'block';
                }}
              />
              <span className="logo-fallback hidden text-3xl md:text-4xl font-serif tracking-[0.6em] font-black gold-text">
                RIVARA ITALY
              </span>
            </button>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-10">
            <Search className="w-5 h-5 cursor-pointer hover:text-[#C6A75E] transition-colors stroke-[1.5px] text-white/80" />
            <User 
              onClick={() => onNavigate(isLoggedIn ? View.HOME : View.LOGIN)}
              className={`w-5 h-5 cursor-pointer hover:text-[#C6A75E] transition-all stroke-[1.5px] ${isLoggedIn ? 'text-[#C6A75E] scale-110' : 'text-white/80'}`} 
            />
            <button 
              onClick={() => onNavigate(View.CART)}
              className="relative group p-1 transition-transform active:scale-90"
            >
              <ShoppingBag className="w-5 h-5 cursor-pointer group-hover:text-[#C6A75E] transition-all stroke-[1.5px] text-white/80" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C6A75E] text-black text-[8px] w-5 h-5 rounded-full flex items-center justify-center font-black shadow-[0_0_10px_rgba(198,167,94,0.5)]">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
