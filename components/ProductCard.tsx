
import React, { useState } from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
  onAddToBag: (e: React.MouseEvent, product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, onAddToBag }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="group cursor-pointer relative bg-[#0a0a0a] overflow-hidden border border-white/5 hover:border-[#C6A75E]/30 transition-all duration-700 p-2"
      onClick={() => onClick(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[3/4.5] overflow-hidden bg-black">
        <img
          src={isHovered ? product.hoverImage : product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105 opacity-80 group-hover:opacity-100 grayscale-[20%] group-hover:grayscale-0"
        />
        
        {/* Wishlist Icon */}
        <button className="absolute top-4 right-4 p-2 bg-black/40 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-[#C6A75E]">
          <Heart className="w-4 h-4 text-white hover:fill-black" />
        </button>

        {/* Add to Bag Button Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-all duration-500">
          <button
            onClick={(e) => onAddToBag(e, product)}
            className="w-full bg-[#C6A75E] text-black text-[10px] tracking-[0.3em] py-4 flex items-center justify-center space-x-2 font-black shadow-2xl hover:bg-white transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>ACQUIRE ITEM</span>
          </button>
        </div>
      </div>

      <div className="mt-8 mb-4 text-center space-y-3 px-2">
        <p className="text-[9px] tracking-[0.4em] text-[#C6A75E] uppercase font-bold">RIVARA ATELIER</p>
        <h3 className="text-sm font-serif italic text-white/90 group-hover:text-white transition-colors">{product.name}</h3>
        <p className="text-lg font-light gold-text">₹ {product.price.toLocaleString('en-IN')}</p>
      </div>
    </div>
  );
};

export default ProductCard;
