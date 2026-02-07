
import React, { useState, useEffect, useCallback } from 'react';
import { View, Product, CartItem, User, Category } from './types';
import { maisonApi } from './MaisonService';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProductCard from './components/ProductCard';
import Hero3D from './components/Hero3D';
import AdminDashboard from './components/AdminDashboard';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, Loader2, Fingerprint, Lock, ShoppingBag, Heart, Trash2, User as UserIcon, LogOut, Package
} from 'lucide-react';

declare global {
  interface Window {
    google: any;
  }
}

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.HOME);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [user, setUser] = useState<User | null>(maisonApi.getCurrentUser());
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Auth States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');

  const loadProducts = useCallback(async () => {
    try {
      const prods = await maisonApi.getProducts();
      setProducts(prods || []);
    } catch (err) {
      console.warn("Maison Inventory Sync: Operating in local archive mode.");
    } finally {
      setIsAppLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
    // Initialize Google Auth
    const initGoogle = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: "520520671038-a9iijhl6qo3ok2nqavgea6m973nta5br.apps.googleusercontent.com",
          callback: handleGoogleResponse
        });
        if (view === View.LOGIN) {
          window.google.accounts.id.renderButton(
            document.getElementById("google-login-btn"),
            { theme: "outline", size: "large", width: "100%", text: "continue_with" }
          );
        }
      }
    };
    initGoogle();
  }, [loadProducts, view]);

  const handleGoogleResponse = async (response: any) => {
    setIsActionLoading(true);
    try {
      const loggedUser = await maisonApi.googleLogin(response.credential);
      setUser(loggedUser);
      setView(View.HOME);
    } catch (err: any) {
      alert("Google Identity Verification Failed.");
    } finally {
      setIsActionLoading(false);
    }
  };

  useEffect(() => {
    if (activeCategory === 'All') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => p.category === activeCategory));
    }
  }, [activeCategory, products]);

  const handleNavigate = (newView: View, category?: Category | 'All') => {
    if (category) {
      setActiveCategory(category);
    }
    setView(newView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsActionLoading(true);

    // Hardcoded Admin Access for the specific review user
    if (email === 'manishishaa17@gmail.com' && password === 'admin123') {
      const mockAdmin: User = {
        id: 'sovereign_1',
        name: 'Manish Ishaa',
        email: 'manishishaa17@gmail.com',
        role: 'admin',
        tier: 'Sovereign',
        acquisitionsCount: 0
      };
      localStorage.setItem('rivara_db_session', JSON.stringify(mockAdmin));
      setUser(mockAdmin);
      setView(View.HOME);
      setIsActionLoading(false);
      return;
    }

    try {
      let loggedUser;
      if (isSignup) {
        loggedUser = await maisonApi.signup(name, email, password);
      } else {
        loggedUser = await maisonApi.login(email, password);
      }
      setUser(loggedUser);
      setView(View.HOME);
    } catch (err: any) {
      alert(err.message || "Identity verification failed.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleLogout = () => {
    maisonApi.logout();
    setUser(null);
    setView(View.HOME);
  };

  const addToBag = (product: Product) => {
    if (product.stockQuantity <= 0) return;
    setCart(prev => {
      const existing = prev.find(item => (item.product.id || item.product._id) === (product.id || product._id));
      if (existing) return prev.map(item => (item.product.id || item.product._id) === (product.id || product._id) ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { product, quantity: 1, size: 'M', color: 'Midnight Noir' }];
    });
  };

  const toggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.find(p => (p.id || p._id) === (product.id || product._id));
      if (exists) return prev.filter(p => (p.id || p._id) !== (product.id || product._id));
      return [...prev, product];
    });
  };

  if (isAppLoading) {
    return (
      <div className="h-screen w-full bg-black flex flex-col items-center justify-center space-y-8">
        <Fingerprint className="w-16 h-16 text-[#C6A75E] animate-pulse" />
        <p className="text-[10px] tracking-[0.8em] text-[#C6A75E] uppercase font-black">Syncing Atelier Infrastructure...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#050505] text-[#F5F5F0]">
      <Navbar onNavigate={handleNavigate} onLogout={handleLogout} cartCount={cart.length} wishlistCount={wishlist.length} user={user} />
      
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {view === View.LOGIN && (
            <motion.div 
              key="login"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="min-h-[85vh] flex items-center justify-center p-8"
            >
              <div className="max-w-md w-full bg-[#0a0a0a] border border-[#C6A75E]/20 p-12 space-y-8 shadow-2xl relative overflow-hidden">
                <div className="text-center space-y-4">
                  <Lock className="w-10 h-10 text-[#C6A75E] mx-auto opacity-80" />
                  <h2 className="text-3xl font-serif italic tracking-tighter">{isSignup ? 'Establish Identity' : 'Identity Portal'}</h2>
                  <p className="text-[9px] tracking-[0.4em] text-[#C6A75E] uppercase font-black">Maison Sovereignty Access</p>
                </div>

                <form onSubmit={handleAuth} className="space-y-6">
                  {isSignup && (
                     <input 
                      type="text" placeholder="FULL NAME" 
                      className="w-full bg-white/5 border border-white/10 px-6 py-4 text-[10px] tracking-widest focus:border-[#C6A75E] outline-none transition-all uppercase"
                      value={name} onChange={e => setName(e.target.value)} required
                    />
                  )}
                  <input 
                    type="email" placeholder="CLIENT EMAIL" 
                    className="w-full bg-white/5 border border-white/10 px-6 py-4 text-[10px] tracking-widest focus:border-[#C6A75E] outline-none transition-all uppercase"
                    value={email} onChange={e => setEmail(e.target.value)} required
                  />
                  <input 
                    type="password" placeholder="SOVEREIGN KEY" 
                    className="w-full bg-white/5 border border-white/10 px-6 py-4 text-[10px] tracking-widest focus:border-[#C6A75E] outline-none transition-all uppercase"
                    value={password} onChange={e => setPassword(e.target.value)} required
                  />
                  <button 
                    type="submit" disabled={isActionLoading}
                    className="w-full bg-[#C6A75E] text-black py-5 text-[11px] tracking-[0.5em] font-black uppercase hover:bg-white transition-all flex items-center justify-center space-x-4"
                  >
                    {isActionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>{isSignup ? 'Establish' : 'Authorize'} Entry</span>}
                  </button>
                </form>

                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5"></span></div>
                  <div className="relative flex justify-center text-[8px] uppercase tracking-widest text-white/20"><span className="bg-[#0a0a0a] px-4">Secure Gateway</span></div>
                </div>

                <div id="google-login-btn" className="w-full flex justify-center grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all"></div>

                <div className="text-center pt-4 border-t border-white/5 pt-8">
                  <button onClick={() => setIsSignup(!isSignup)} className="text-[9px] tracking-widest text-[#C6A75E] font-bold uppercase hover:text-white transition-colors">
                    {isSignup ? 'Already Authenticated? Login' : 'New Identity? Request Signup'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {view === View.HOME && (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <section className="relative h-screen flex items-center justify-center bg-black overflow-hidden">
                 <div className="absolute inset-0 z-0">
                    <Hero3D />
                 </div>
                 <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black"></div>
                 <div className="relative z-10 text-center space-y-12 max-w-4xl px-8">
                    <motion.div 
                      initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}
                      className="flex items-center justify-center space-x-4"
                    >
                      <span className="w-12 h-[1px] bg-[#C6A75E]"></span>
                      <p className="text-[10px] tracking-[0.8em] text-[#C6A75E] uppercase font-black">Milanese High Artistry</p>
                      <span className="w-12 h-[1px] bg-[#C6A75E]"></span>
                    </motion.div>
                    <motion.h1 
                      initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.7 }}
                      className="text-8xl md:text-[140px] font-serif italic tracking-tighter leading-none"
                    >
                      Rivara <br/> <span className="gold-text not-italic">Sovereign.</span>
                    </motion.h1>
                    <motion.div
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
                    >
                      <button 
                        onClick={() => document.getElementById('catalog')?.scrollIntoView({behavior: 'smooth'})}
                        className="group relative px-20 py-8 bg-[#C6A75E] text-black text-[11px] tracking-[0.6em] font-black uppercase overflow-hidden"
                      >
                        <span className="relative z-10">Explore the Archive</span>
                        <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                      </button>
                    </motion.div>
                 </div>
              </section>

              <section id="catalog" className="py-40 px-8 max-w-7xl mx-auto space-y-20">
                <div className="flex flex-col md:flex-row justify-between items-center gap-10">
                  <h2 className="text-4xl font-serif italic">The Season's Archive - {activeCategory}</h2>
                  <div className="flex flex-wrap justify-center gap-8">
                    {['All', 'Ladies', 'Men', 'Accessories'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat as any)}
                        className={`text-[9px] tracking-[0.4em] uppercase font-black transition-all ${activeCategory === cat ? 'text-[#C6A75E]' : 'text-white/30 hover:text-white'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                  {filteredProducts.map(p => (
                    <ProductCard 
                      key={p.id || p._id} product={p} 
                      onClick={p => { setSelectedProduct(p); setView(View.PRODUCT_DETAIL); }}
                      onAddToBag={(e, p) => { e.stopPropagation(); addToBag(p); }}
                    />
                  ))}
                </div>
              </section>
            </motion.div>
          )}

          {view === View.WISHLIST && (
            <motion.div key="wishlist" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-40 px-8 max-w-7xl mx-auto">
               <h1 className="text-6xl font-serif italic text-center gold-text mb-20">The Curated Archive</h1>
               {wishlist.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {wishlist.map(p => (
                      <div key={p.id || p._id} className="relative group">
                         <ProductCard 
                            product={p} 
                            onClick={p => { setSelectedProduct(p); setView(View.PRODUCT_DETAIL); }}
                            onAddToBag={(e, p) => { e.stopPropagation(); addToBag(p); }}
                          />
                          <button 
                            onClick={() => toggleWishlist(p)}
                            className="absolute top-4 right-4 bg-red-500/80 p-3 rounded-full hover:bg-red-600 transition-colors z-20"
                          >
                            <Trash2 className="w-4 h-4 text-white" />
                          </button>
                      </div>
                    ))}
                 </div>
               ) : (
                 <div className="text-center py-40 flex flex-col items-center space-y-10">
                    <Heart className="w-16 h-16 text-white/10" />
                    <p className="italic font-serif text-2xl opacity-30">Your curated archive is currently empty.</p>
                    <button onClick={() => setView(View.HOME)} className="text-[10px] tracking-[0.5em] text-[#C6A75E] uppercase font-black border-b border-[#C6A75E] pb-2 hover:text-white hover:border-white transition-all">Return to Catalog</button>
                 </div>
               )}
            </motion.div>
          )}

          {view === View.ACCOUNT && user && (
            <motion.div key="account" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-40 px-8 max-w-4xl mx-auto">
               <div className="bg-white/5 border border-white/10 p-20 space-y-12 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-10 opacity-5">
                    <UserIcon className="w-64 h-64" />
                  </div>
                  <div className="space-y-4">
                    <p className="text-[10px] tracking-[0.8em] text-[#C6A75E] uppercase font-black">Client Profile</p>
                    <h1 className="text-6xl font-serif italic">{user.name}</h1>
                    <p className="text-[11px] tracking-[0.4em] text-white/40 uppercase font-black">{user.email}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-12 border-t border-white/5 pt-12">
                    <div className="space-y-2">
                       <p className="text-[9px] tracking-[0.3em] text-white/20 uppercase font-black">Status Tier</p>
                       <p className="text-2xl font-serif italic text-[#C6A75E]">{user.tier}</p>
                    </div>
                    <div className="space-y-2">
                       <p className="text-[9px] tracking-[0.3em] text-white/20 uppercase font-black">Total Acquisitions</p>
                       <p className="text-2xl font-serif italic">{user.acquisitionsCount}</p>
                    </div>
                  </div>
                  <div className="pt-12 flex justify-between">
                     <button onClick={handleLogout} className="flex items-center space-x-3 text-red-500 text-[10px] tracking-widest uppercase font-black hover:text-white transition-colors">
                        <LogOut className="w-4 h-4" />
                        <span>Terminate Session</span>
                     </button>
                     <button className="flex items-center space-x-3 text-white text-[10px] tracking-widest uppercase font-black hover:text-[#C6A75E] transition-colors">
                        <Package className="w-4 h-4" />
                        <span>Acquisition History</span>
                     </button>
                  </div>
               </div>
            </motion.div>
          )}

          {view === View.ADMIN_DASHBOARD && (
             <motion.div key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <AdminDashboard onProductsChange={loadProducts} />
             </motion.div>
          )}

          {view === View.CART && (
            <motion.div key="cart" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-40 px-8 max-w-5xl mx-auto">
               <h1 className="text-6xl font-serif italic text-center gold-text mb-20">The Selection Bag</h1>
               {cart.length > 0 ? (
                 <div className="space-y-12">
                   {cart.map((item, idx) => (
                     <div key={idx} className="flex flex-col md:flex-row items-center gap-12 border-b border-white/5 pb-12 group">
                       <img src={item.product.image} className="w-32 h-44 object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                       <div className="flex-grow space-y-2">
                         <p className="text-[10px] tracking-widest text-[#C6A75E] uppercase font-black">{item.product.category}</p>
                         <h3 className="text-3xl font-serif italic">{item.product.name}</h3>
                         <div className="flex space-x-8 text-[9px] tracking-widest uppercase text-white/40 font-bold pt-4">
                           <span>Size: {item.size}</span>
                           <span>Quantity: {item.quantity}</span>
                         </div>
                       </div>
                       <div className="text-right">
                         <p className="text-3xl font-light">₹ {(item.product.price * item.quantity).toLocaleString()}</p>
                         <button onClick={() => setCart(c => c.filter((_, i) => i !== idx))} className="text-[9px] tracking-widest text-red-500 uppercase mt-4 hover:underline">Remove Item</button>
                       </div>
                     </div>
                   ))}
                   <div className="pt-20 flex flex-col items-end space-y-10">
                      <div className="flex space-x-20 text-4xl font-serif italic">
                        <span className="text-xs uppercase tracking-[0.4em] font-black text-white/20 not-italic">Total Acquisition</span>
                        <span className="gold-text">₹ {cart.reduce((a, b) => a + (b.product.price * b.quantity), 0).toLocaleString()}</span>
                      </div>
                      <button className="w-full md:w-auto px-20 py-10 bg-[#C6A75E] text-black text-[13px] tracking-[0.6em] font-black uppercase hover:bg-white transition-all shadow-2xl">
                        Initiate Secure Checkout
                      </button>
                   </div>
                 </div>
               ) : (
                 <div className="text-center py-40 flex flex-col items-center space-y-10">
                    <ShoppingBag className="w-16 h-16 text-white/10" />
                    <p className="italic font-serif text-2xl opacity-30">The collection is awaiting your curation.</p>
                    <button onClick={() => setView(View.HOME)} className="text-[10px] tracking-[0.5em] text-[#C6A75E] uppercase font-black border-b border-[#C6A75E] pb-2 hover:text-white hover:border-white transition-all">Return to Catalog</button>
                 </div>
               )}
            </motion.div>
          )}

          {view === View.PRODUCT_DETAIL && selectedProduct && (
            <motion.div key="detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-40 px-8 max-w-7xl mx-auto">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
                  <div className="aspect-[3/4] bg-[#0a0a0a] overflow-hidden group border border-white/5">
                    <img src={selectedProduct.image} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-1000 scale-105" />
                  </div>
                  <div className="flex flex-col justify-center space-y-16">
                    <div className="space-y-6">
                      <p className="text-[10px] tracking-[0.8em] text-[#C6A75E] uppercase font-black">Limited Archive Release</p>
                      <h1 className="text-8xl font-serif italic tracking-tighter">{selectedProduct.name}</h1>
                      <p className="text-5xl font-light gold-text">₹ {selectedProduct.price.toLocaleString()}</p>
                    </div>
                    <p className="text-xl text-white/50 font-serif italic leading-relaxed">{selectedProduct.description}</p>
                    <div className="grid grid-cols-2 gap-4">
                       <button onClick={() => addToBag(selectedProduct)} className="bg-[#C6A75E] text-black py-8 text-[11px] tracking-[0.5em] font-black uppercase hover:bg-white transition-all">Acquire Piece</button>
                       <button onClick={() => toggleWishlist(selectedProduct)} className="border border-[#C6A75E] text-[#C6A75E] py-8 text-[11px] tracking-[0.5em] font-black uppercase hover:bg-[#C6A75E] hover:text-black transition-all">
                        {wishlist.find(p => (p.id || p._id) === (selectedProduct.id || selectedProduct._id)) ? 'In Wishlist' : 'Add to Wishlist'}
                       </button>
                    </div>
                    <div className="pt-12 border-t border-white/5 space-y-4">
                      <div className="flex items-center space-x-4 text-[9px] tracking-widest text-white/40 uppercase font-black">
                        <ShieldCheck className="w-4 h-4 text-[#C6A75E]" />
                        <span>Authenticated Digital Provenance Included</span>
                      </div>
                    </div>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
};

export default App;
