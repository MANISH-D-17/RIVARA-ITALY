
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-[#F5F5F0] py-32 px-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20">
          <div className="space-y-10">
            <div className="space-y-4 opacity-80 hover:opacity-100 transition-opacity">
              <img 
                src="components/RIVARA_LOGO-removebg-preview.png" 
                alt="RIVARA ITALY" 
                className="h-12 w-auto object-contain brightness-0 invert opacity-80"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const span = target.nextElementSibling as HTMLElement;
                  if (span) span.style.display = 'block';
                }}
              />
              <span className="logo-fallback hidden text-2xl font-serif tracking-widest font-black gold-text">
                RIVARA ITALY
              </span>
              <p className="text-[10px] tracking-[0.3em] text-[#C6A75E]/60 uppercase font-bold italic text-center">Milanese High Artistry</p>
            </div>
            <ul className="space-y-6 text-[11px] tracking-[0.3em] font-bold text-white/40 uppercase">
              <li className="hover:text-[#C6A75E] cursor-pointer transition-all duration-500">The Atelier</li>
              <li className="hover:text-[#C6A75E] cursor-pointer transition-all duration-500">Maison Careers</li>
            </ul>
          </div>

          <div className="space-y-10">
            <h3 className="text-[12px] tracking-[0.4em] font-black uppercase text-white/80 italic">Customer Liaison</h3>
            <ul className="space-y-6 text-[11px] tracking-[0.3em] font-bold text-white/40 uppercase">
              <li className="hover:text-[#C6A75E] cursor-pointer transition-all duration-500">Contact the Atelier</li>
              <li className="hover:text-[#C6A75E] cursor-pointer transition-all duration-500">Global Logistics</li>
              <li className="hover:text-[#C6A75E] cursor-pointer transition-all duration-500">The Vault (FAQs)</li>
            </ul>
          </div>

          <div className="space-y-10">
            <h3 className="text-[12px] tracking-[0.4em] font-black uppercase text-white/80 italic">Governance</h3>
            <ul className="space-y-6 text-[11px] tracking-[0.3em] font-bold text-white/40 uppercase">
              <li className="hover:text-[#C6A75E] cursor-pointer transition-all duration-500">Data Sovereignty</li>
              <li className="hover:text-[#C6A75E] cursor-pointer transition-all duration-500">Trade Protocols</li>
            </ul>
          </div>

          <div className="space-y-10">
            <h3 className="text-[12px] tracking-[0.4em] font-black uppercase text-white/80 italic">The Archive</h3>
            <div className="flex space-x-10 text-[11px] tracking-[0.3em] font-bold text-white/40 uppercase">
              <span className="hover:text-[#C6A75E] cursor-pointer transition-all duration-500 border-b border-white/10 pb-2">Instagram</span>
              <span className="hover:text-[#C6A75E] cursor-pointer transition-all duration-500 border-b border-white/10 pb-2">Vogue</span>
            </div>
          </div>
        </div>

        <div className="mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0 text-[10px] tracking-[0.4em] text-white/20 uppercase font-black">
          <span>© 2026 RIVARA ITALY GROUP. ALL ACQUISITIONS PROTECTED.</span>
          <div className="flex space-x-12 italic">
            <span>Milano</span>
            <span>Paris</span>
            <span>London</span>
            <span>Tokyo</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
