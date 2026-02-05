
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { View, Product, CartItem } from './types';
import { PRODUCTS, CATEGORIES } from './constants';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProductCard from './components/ProductCard';
import { ChevronRight, ArrowLeft, Trash2, CheckCircle, Loader2, Plus, Minus, CreditCard, Apple, Wallet, Sparkles } from 'lucide-react';

declare var THREE: any;

const ThreeDScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isHovering = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(400, 400);
    containerRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.OctahedronGeometry(1.2, 2);
    const material = new THREE.MeshStandardMaterial({
      color: 0xC6A75E,
      wireframe: true,
      metalness: 1,
      roughness: 0.1,
      emissive: 0x443311,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const mainLight = new THREE.PointLight(0xffffff, 2);
    mainLight.position.set(5, 5, 5);
    scene.add(mainLight);
    
    const fillLight = new THREE.PointLight(0xC6A75E, 1);
    fillLight.position.set(-5, -5, 2);
    scene.add(fillLight);
    
    scene.add(new THREE.AmbientLight(0x404040, 0.5));

    camera.position.z = 2.8;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const onMouseMove = (event: MouseEvent) => {
      if (!isHovering.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      targetX = (x / rect.width) * 2 - 1;
      targetY = -(y / rect.height) * 2 + 1;
    };

    const container = containerRef.current;
    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mouseenter', () => { isHovering.current = true; });
    container.addEventListener('mouseleave', () => { isHovering.current = false; });

    const animate = () => {
      requestAnimationFrame(animate);
      
      // Constant baseline slow rotation (Always in motion)
      mesh.rotation.y += 0.003;
      mesh.rotation.x += 0.0015;

      if (isHovering.current) {
        // Smoothly approach the cursor-influenced targets
        currentX += (targetX - currentX) * 0.02;
        currentY += (targetY - currentY) * 0.02;
      } else {
        // Smoothly return to baseline when not hovering
        currentX *= 0.98;
        currentY *= 0.98;
      }

      mesh.rotation.y += (currentX * 0.03);
      mesh.rotation.x += (-currentY * 0.03);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      container.removeEventListener('mousemove', onMouseMove);
      renderer.dispose();
      if (containerRef.current) containerRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="relative group">
      <div ref={containerRef} className="w-[400px] h-[400px] cursor-default z-10 relative" />
      <div className="absolute inset-0 border border-[#C6A75E]/10 rounded-full scale-90 group-hover:scale-100 transition-transform duration-1000 pointer-events-none"></div>
    </div>
  );
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setScrollProgress((winScroll / height) * 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredProducts = useMemo(() => {
    if (!activeCategory) return PRODUCTS;
    return PRODUCTS.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase());
  }, [activeCategory]);

  const navigateToView = (view: View) => {
    setOrderComplete(false);
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    navigateToView(View.PRODUCT_DETAIL);
  };

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    setCurrentView(View.HOME);
    const element = document.getElementById('new-arrivals');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const addToBag = (product: Product, size = 'M', color = 'Imperial Gold') => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id && item.size === size);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id && item.size === size 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
        );
      }
      return [...prev, { product, quantity: 1, size, color }];
    });
    
    const toast = document.createElement('div');
    toast.className = 'fixed top-28 right-8 bg-[#C6A75E] text-black px-8 py-4 text-[11px] tracking-[0.3em] font-black animate-in fade-in slide-in-from-right-12 duration-500 z-[100] shadow-[0_0_30px_rgba(198,167,94,0.4)]';
    toast.innerText = 'ADJOINED TO COLLECTION';
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-x-12');
      setTimeout(() => toast.remove(), 500);
    }, 3000);
  };

  const updateQuantity = (id: string, size: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === id && item.size === size) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string, size: string) => {
    setCart(prev => prev.filter(item => !(item.product.id === id && item.size === size)));
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setOrderComplete(true);
      setCart([]);
    }, 3000);
  };

  const renderHome = () => (
    <div className="animate-in fade-in duration-1000">
      <section className="relative h-[95vh] overflow-hidden bg-black flex flex-col items-center justify-center">
        <div className="absolute inset-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&q=80&w=2000" 
            alt="Hero Background"
            className="w-full h-full object-cover grayscale brightness-50"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-center max-w-7xl mx-auto px-8 w-full">
          <div className="flex-1 space-y-10 text-center md:text-left animate-in slide-in-from-left-12 duration-1000">
            <div className="flex items-center space-x-4 mb-4">
              <span className="w-16 h-[2px] bg-[#C6A75E]"></span>
              <p className="text-[12px] tracking-[0.6em] text-[#C6A75E] uppercase font-black animate-pulse">Est. 1926 Milano</p>
            </div>
            <h1 className="text-7xl md:text-[120px] font-serif leading-[0.85] tracking-tighter italic text-white">
              Supreme <br/> <span className="gold-text not-italic">Artistry.</span>
            </h1>
            <p className="text-sm md:text-xl font-light tracking-[0.4em] text-white/60 max-w-lg uppercase">
              The Winter Obsidian Collection — <br/> Craftsmanship beyond borders.
            </p>
            <div className="flex flex-col sm:flex-row space-y-6 sm:space-y-0 sm:space-x-10 pt-10">
              <button 
                onClick={() => handleCategoryClick('Ladies')}
                className="px-20 py-7 bg-[#C6A75E] text-black text-[11px] tracking-[0.4em] font-black hover:bg-white transition-all duration-700 shadow-[0_0_40px_rgba(198,167,94,0.3)] group"
              >
                DISCOVER HERS <ChevronRight className="inline w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
              </button>
              <button 
                onClick={() => handleCategoryClick('Men')}
                className="px-20 py-7 border border-[#C6A75E] text-[#C6A75E] text-[11px] tracking-[0.4em] font-black hover:bg-[#C6A75E] hover:text-black transition-all duration-700 backdrop-blur-md"
              >
                DISCOVER HIS
              </button>
            </div>
          </div>
          <div className="flex-1 hidden md:flex items-center justify-center animate-in zoom-in-50 duration-1000">
            <ThreeDScene />
          </div>
        </div>
      </section>

      <section className="py-40 bg-[#050505]">
        <div className="max-w-[1600px] mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <div 
              onClick={() => handleCategoryClick('Ladies')}
              className="relative aspect-[4/5] overflow-hidden group cursor-pointer border border-white/5"
            >
              <img src="https://images.unsplash.com/photo-1539109132314-3477524c859c?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 grayscale group-hover:grayscale-0" alt="" />
              <div className="absolute inset-0 flex flex-col justify-end p-12 bg-gradient-to-t from-black via-transparent to-transparent">
                <p className="text-[#C6A75E] text-[10px] tracking-[0.5em] uppercase font-bold mb-4">The Muse</p>
                <h3 className="text-4xl font-serif text-white italic">Ladies Collection</h3>
              </div>
            </div>
            <div 
              onClick={() => handleCategoryClick('Men')}
              className="relative aspect-[4/5] overflow-hidden group cursor-pointer border border-white/5 md:mt-24"
            >
              <img src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 grayscale group-hover:grayscale-0" alt="" />
              <div className="absolute inset-0 flex flex-col justify-end p-12 bg-gradient-to-t from-black via-transparent to-transparent">
                <p className="text-[#C6A75E] text-[10px] tracking-[0.5em] uppercase font-bold mb-4">The Gentleman</p>
                <h3 className="text-4xl font-serif text-white italic">Men's Atelier</h3>
              </div>
            </div>
            <div 
              onClick={() => handleCategoryClick('Beauty')}
              className="relative aspect-[4/5] overflow-hidden group cursor-pointer border border-white/5"
            >
              <img src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 grayscale group-hover:grayscale-0" alt="" />
              <div className="absolute inset-0 flex flex-col justify-end p-12 bg-gradient-to-t from-black via-transparent to-transparent">
                <p className="text-[#C6A75E] text-[10px] tracking-[0.5em] uppercase font-bold mb-4">The Aura</p>
                <h3 className="text-4xl font-serif text-white italic">Beauty & Scents</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="py-20 bg-black overflow-hidden whitespace-nowrap border-y border-[#C6A75E]/20">
        <div className="animate-shine flex space-x-20 items-center">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="flex items-center space-x-12">
              <Sparkles className="w-8 h-8 text-[#C6A75E]" />
              <span className="text-[12px] tracking-[0.8em] font-black gold-text uppercase">Worldwide Priority Express Selection</span>
              <span className="text-white/20">•</span>
              <span className="text-[12px] tracking-[0.8em] font-black gold-text uppercase">Milanese Heritage Since 1926</span>
              <span className="text-white/20">•</span>
              <span className="text-[12px] tracking-[0.8em] font-black gold-text uppercase">Certified Hand-Tailored Luxury</span>
            </div>
          ))}
        </div>
      </div>

      <section id="new-arrivals" className="py-40 px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-32 space-y-12 md:space-y-0">
          <div className="space-y-8">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-[1px] bg-[#C6A75E]"></div>
              <p className="text-[14px] tracking-[0.6em] text-[#C6A75E] uppercase font-black italic">Curated Collections</p>
            </div>
            <h2 className="text-7xl font-serif tracking-tighter italic text-white leading-none">
              {activeCategory ? activeCategory : 'The Selection'}
            </h2>
          </div>
          <div className="flex flex-wrap gap-6">
            {['All', 'Ladies', 'Men', 'Beauty'].map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat === 'All' ? null : cat)}
                className={`px-12 py-4 text-[11px] tracking-[0.4em] font-black uppercase transition-all border-2 ${activeCategory === (cat === 'All' ? null : cat) ? 'bg-[#C6A75E] text-black border-[#C6A75E] shadow-[0_0_20px_rgba(198,167,94,0.3)]' : 'border-white/10 text-white/40 hover:text-[#C6A75E] hover:border-[#C6A75E]'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {filteredProducts.map((product, idx) => (
            <div key={product.id} className="animate-in fade-in slide-in-from-bottom-12 duration-700" style={{ transitionDelay: `${idx * 100}ms` }}>
              <ProductCard 
                product={product} 
                onClick={handleProductClick} 
                onAddToBag={(e, p) => {
                  e.stopPropagation();
                  addToBag(p);
                }}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const renderProductDetail = () => {
    if (!selectedProduct) return null;
    return (
      <div className="min-h-screen py-24 bg-[#050505] animate-in fade-in duration-1000">
        <div className="max-w-7xl mx-auto px-8">
          <button 
            onClick={() => navigateToView(View.HOME)}
            className="flex items-center text-[11px] tracking-[0.5em] font-black text-[#C6A75E] mb-24 hover:text-white transition-all group"
          >
            <ArrowLeft className="w-4 h-4 mr-6 transition-transform group-hover:-translate-x-3" /> RETURN TO GALLERY
          </button>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
            <div className="lg:col-span-7 space-y-12">
              <div className="aspect-[3/4] overflow-hidden bg-[#0a0a0a] shadow-2xl border border-white/5">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="lg:col-span-5 space-y-16 h-fit sticky top-40">
              <div className="space-y-8">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-[1px] bg-[#C6A75E]"></div>
                  <p className="text-[14px] tracking-[0.6em] text-[#C6A75E] uppercase font-black">RIVARA ATELIER</p>
                </div>
                <h1 className="text-7xl font-serif italic tracking-tighter text-white leading-tight">{selectedProduct.name}</h1>
                <p className="text-5xl font-light gold-text">₹ {selectedProduct.price.toLocaleString('en-IN')}</p>
              </div>
              <div className="space-y-6 pt-10">
                <button 
                  onClick={() => addToBag(selectedProduct)}
                  className="w-full bg-[#C6A75E] text-black py-10 text-[14px] tracking-[0.6em] font-black hover:bg-white transition-all shadow-2xl active:scale-[0.98]"
                >
                  ADJOIN TO COLLECTION
                </button>
              </div>
              <div className="space-y-12 pt-16">
                <div className="space-y-6">
                  <h4 className="text-[12px] tracking-[0.4em] font-black text-[#C6A75E] uppercase italic">The Narrative</h4>
                  <p className="text-xl text-white/60 leading-relaxed font-serif italic">{selectedProduct.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCart = () => {
    const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    return (
      <div className="min-h-screen py-40 px-8 max-w-7xl mx-auto bg-[#050505] animate-in fade-in duration-1000">
        <h1 className="text-8xl font-serif mb-32 text-center tracking-tighter italic gold-text">Selection Archive</h1>
        {cart.length === 0 ? (
          <div className="text-center py-60 space-y-12 border-y border-white/5">
            <p className="text-white/20 font-serif italic text-4xl">Your repository of luxury is currently vacant.</p>
            <button 
              onClick={() => navigateToView(View.HOME)}
              className="px-20 py-8 bg-[#C6A75E] text-black text-[14px] tracking-[0.5em] font-black hover:bg-white transition-all shadow-2xl"
            >
              RESUME DISCOVERY
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-32">
            <div className="lg:col-span-8 space-y-20">
              {cart.map((item, idx) => (
                <div key={`${item.product.id}-${idx}`} className="flex items-start space-x-16 pb-20 border-b border-white/5 group">
                  <div className="flex-1 space-y-10 py-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-6">
                        <p className="text-[12px] tracking-[0.5em] text-[#C6A75E] uppercase font-black">RIVARA ATELIER</p>
                        <h3 className="text-5xl font-serif italic text-white group-hover:gold-text transition-all duration-500 cursor-pointer">
                          {item.product.name}
                        </h3>
                      </div>
                      <p className="text-4xl font-light gold-text">₹ {(item.product.price * item.quantity).toLocaleString('en-IN')}</p>
                    </div>
                    <div className="flex justify-between items-center pt-12">
                      <div className="flex items-center border border-white/10 px-8 py-4 space-x-12 bg-[#0a0a0a] shadow-2xl">
                        <button onClick={() => updateQuantity(item.product.id, item.size, -1)} className="text-2xl text-[#C6A75E] hover:text-white transition-all"><Minus className="w-6 h-6" /></button>
                        <span className="text-xl font-black text-white w-8 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, item.size, 1)} className="text-2xl text-[#C6A75E] hover:text-white transition-all"><Plus className="w-6 h-6" /></button>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.product.id, item.size)}
                        className="text-white/20 hover:text-[#C6A75E] transition-all flex items-center space-x-4 text-[12px] tracking-[0.4em] font-black uppercase"
                      >
                        <Trash2 className="w-5 h-5" />
                        <span>Rescind Item</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="lg:col-span-4 h-fit sticky top-40 bg-[#0a0a0a] p-16 border border-white/5 shadow-2xl space-y-16">
              <h2 className="text-[16px] tracking-[0.6em] font-black uppercase pb-8 border-b border-white/5 gold-text italic font-serif text-center">Summary of Value</h2>
              <div className="pt-16 border-t border-white/10 flex justify-between text-4xl font-serif italic font-black text-white leading-none">
                <span className="tracking-tighter gold-text">₹ {subtotal.toLocaleString('en-IN')}</span>
              </div>
              <button 
                onClick={() => navigateToView(View.CHECKOUT)}
                className="w-full bg-[#C6A75E] text-black py-10 text-[14px] tracking-[0.6em] font-black hover:bg-white transition-all shadow-2xl"
              >
                PROCEED TO ACQUISITION
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderCheckout = () => {
    const total = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    if (orderComplete) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-black px-8 animate-in zoom-in-95 duration-1000">
          <div className="text-center space-y-16 max-w-2xl p-20 border border-[#C6A75E]/20 bg-[#0a0a0a] shadow-[0_0_100px_rgba(198,167,94,0.1)]">
            <CheckCircle className="w-32 h-32 text-[#C6A75E] mx-auto stroke-[0.5px] animate-pulse" />
            <h1 className="text-8xl font-serif italic gold-text leading-tight">Grazie.</h1>
            <button 
              onClick={() => navigateToView(View.HOME)}
              className="px-24 py-8 bg-[#C6A75E] text-black text-[14px] tracking-[0.6em] font-black hover:bg-white transition-all shadow-2xl"
            >
              RESUME DISCOVERY
            </button>
          </div>
        </div>
      );
    }
    return (
      <div className="min-h-screen py-40 bg-[#050505] px-8 max-w-7xl mx-auto animate-in fade-in duration-1000">
        <h1 className="text-8xl font-serif mb-32 text-center tracking-tighter italic gold-text">Final Acquisition</h1>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-32">
          <div className="lg:col-span-8 space-y-32">
            <form onSubmit={handlePayment} className="space-y-32">
              <button 
                disabled={isProcessing}
                className="w-full bg-[#C6A75E] text-black py-12 text-[18px] tracking-[0.8em] font-black hover:bg-white transition-all flex items-center justify-center space-x-8 shadow-[0_0_50px_rgba(198,167,94,0.3)] active:scale-[0.99] disabled:opacity-50"
              >
                {isProcessing ? <Loader2 className="w-8 h-8 animate-spin" /> : <span>CONFIRM TRANSACTION — ₹ {total.toLocaleString('en-IN')}</span>}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const renderAuth = (type: 'login' | 'signup') => (
    <div className="min-h-screen flex items-center justify-center px-8 bg-[#050505] animate-in fade-in duration-1000">
      <div className="max-w-xl w-full p-20 border border-white/5 bg-[#0a0a0a] shadow-2xl space-y-16 text-center">
        <h1 className="text-6xl font-serif italic text-white">
          {type === 'login' ? 'Welcome Back' : 'Join the Atelier'}
        </h1>
        <button 
          onClick={() => { setIsProcessing(true); setTimeout(() => { setIsLoggedIn(true); setIsProcessing(false); navigateToView(View.HOME); }, 1500); }}
          className="w-full bg-white text-black py-6 flex items-center justify-center space-x-6 hover:bg-[#C6A75E] transition-all font-black text-[12px] tracking-[0.4em] uppercase"
        >
          {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Sign In with Google Identity</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#050505]">
      <Navbar onNavigate={navigateToView} cartCount={cart.reduce((a, b) => a + b.quantity, 0)} isLoggedIn={isLoggedIn} />
      <main className="flex-grow">
        {currentView === View.HOME && renderHome()}
        {currentView === View.PRODUCT_DETAIL && renderProductDetail()}
        {currentView === View.CART && renderCart()}
        {currentView === View.CHECKOUT && renderCheckout()}
        {currentView === View.LOGIN && renderAuth('login')}
        {currentView === View.SIGNUP && renderAuth('signup')}
      </main>
      <Footer />
      <div 
        className="fixed top-24 left-0 h-[2px] bg-[#C6A75E] z-[60] transition-all duration-700 shadow-[0_0_20px_#C6A75E]"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
};

export default App;
