
import React, { useState, useEffect } from 'react';
import { Product, Order, Category } from '../types';
import { maisonApi } from '../MaisonService';
import { Plus, Edit, Trash, Package, DollarSign, TrendingUp, Users, Loader2, X, Image as ImageIcon, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminDashboardProps {
  onProductsChange?: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onProductsChange }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'analytics'>('products');
  
  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prods, ords] = await Promise.all([
        maisonApi.getProducts(),
        maisonApi.getAllOrders()
      ]);
      setProducts(prods);
      setOrders(ords);
    } catch (err) {
      console.error("Maison Sync Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Evict this masterpiece from the archive? This action is irreversible.")) {
      try {
        await maisonApi.deleteProduct(id);
        // Update local dashboard state
        setProducts(prev => prev.filter(p => (p.id || p._id) !== id));
        // Signal global update
        if (onProductsChange) onProductsChange();
      } catch (err) {
        alert("Deletion protocol failed.");
      }
    }
  };

  const handleOpenForm = (product: Product | null = null) => {
    setEditingProduct(product ? { ...product } : {
      name: '',
      price: 0,
      category: 'Ladies',
      description: '',
      image: 'https://images.unsplash.com/photo-1539109132314-3477524c859c?auto=format&fit=crop&q=80&w=800',
      stockQuantity: 10
    });
    setIsFormOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    
    setIsSaving(true);
    try {
      if (editingProduct.id || editingProduct._id) {
        // Update existing via service layer
        const id = editingProduct.id || editingProduct._id!;
        await maisonApi.updateProduct(id, editingProduct);
      } else {
        // Create new via service layer
        await maisonApi.createProduct(editingProduct);
      }
      
      // Reload dashboard data to ensure consistency
      await loadData();
      
      // Signal global update to App.tsx
      if (onProductsChange) onProductsChange();
      
      setIsFormOpen(false);
      setEditingProduct(null);
    } catch (err) {
      alert("Archive update failed.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-40">
      <Loader2 className="w-12 h-12 text-[#C6A75E] animate-spin" />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-20 px-8 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <p className="text-[10px] tracking-[0.6em] text-[#C6A75E] uppercase font-black">Sovereign Command</p>
          <h1 className="text-6xl font-serif italic gold-text">Maison Console</h1>
        </div>
        <div className="flex space-x-4 bg-white/5 p-1 border border-white/10 rounded-sm">
          {['products', 'orders', 'analytics'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-8 py-3 text-[9px] tracking-widest uppercase font-black transition-all ${activeTab === tab ? 'bg-[#C6A75E] text-black' : 'text-white/40 hover:text-white'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { label: 'Total Revenue', value: `₹ ${orders.reduce((a, b) => a + b.total, 0).toLocaleString()}`, icon: DollarSign },
            { label: 'Total Orders', value: orders.length, icon: Package },
            { label: 'Active Collection', value: products.length, icon: TrendingUp },
            { label: 'Authenticated Clients', value: '1,240', icon: Users },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/5 border border-white/10 p-10 space-y-4"
            >
              <stat.icon className="w-8 h-8 text-[#C6A75E] opacity-50" />
              <p className="text-[9px] tracking-widest text-white/40 uppercase font-bold">{stat.label}</p>
              <p className="text-3xl font-serif gold-text">{stat.value}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div className="space-y-8">
          <div className="flex justify-end">
            <button 
              onClick={() => handleOpenForm()}
              className="flex items-center space-x-3 bg-white text-black px-8 py-4 text-[10px] tracking-widest font-black uppercase hover:bg-[#C6A75E] transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Curate New Item</span>
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {products.map((p) => (
              <div key={p.id || p._id} className="flex items-center justify-between bg-white/5 border border-white/10 p-6 hover:border-[#C6A75E]/30 transition-all group">
                <div className="flex items-center space-x-8">
                  <div className="w-16 h-20 bg-black overflow-hidden border border-white/5">
                    <img src={p.image} className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
                  </div>
                  <div>
                    <h4 className="text-xl font-serif italic">{p.name}</h4>
                    <p className="text-[9px] tracking-widest text-white/40 uppercase font-bold">{p.category} | ₹ {p.price.toLocaleString()}</p>
                    <p className="text-[8px] tracking-widest text-[#C6A75E] uppercase mt-1 font-bold">Stock: {p.stockQuantity}</p>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <button 
                    onClick={() => handleOpenForm(p)}
                    className="p-4 bg-white/5 hover:bg-[#C6A75E] hover:text-black transition-all"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(p.id || p._id!)} 
                    className="p-4 bg-white/5 hover:bg-red-500 hover:text-white transition-all"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length > 0 ? orders.map((o) => (
            <div key={o.id || o._id} className="bg-white/5 border border-white/10 p-8 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] tracking-widest text-[#C6A75E] uppercase font-black">{o.maisonKey || 'LEGACY_TRANS'}</p>
                  <p className="text-sm text-white/60">{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : 'Historical Archive'}</p>
                </div>
                <span className="text-[10px] tracking-widest bg-white/10 px-4 py-2 uppercase font-black">{o.status}</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-white/5">
                <p className="text-xl font-serif italic">Total: ₹ {o.total.toLocaleString()}</p>
                <button className="text-[9px] tracking-widest uppercase font-black text-[#C6A75E] underline">View Manifest</button>
              </div>
            </div>
          )) : (
            <div className="text-center py-20 opacity-30 italic font-serif text-xl border border-dashed border-white/10">
              No recent acquisitions found in the global registry.
            </div>
          )}
        </div>
      )}

      {/* Product Edit/Create Modal */}
      <AnimatePresence>
        {isFormOpen && editingProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
              onClick={() => setIsFormOpen(false)}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl bg-[#0a0a0a] border border-[#C6A75E]/30 shadow-2xl overflow-hidden"
            >
              <div className="flex h-[80vh]">
                {/* Left: Preview */}
                <div className="hidden lg:block w-1/3 bg-black relative border-r border-white/10">
                  <img 
                    src={editingProduct.image} 
                    className="w-full h-full object-cover grayscale-[20%] opacity-80"
                    alt="Preview"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                  <div className="absolute bottom-8 left-8 right-8">
                    <p className="text-[8px] tracking-[0.4em] text-[#C6A75E] uppercase font-black mb-2">Live Preview</p>
                    <h3 className="text-2xl font-serif italic mb-1">{editingProduct.name || 'Untitled Piece'}</h3>
                    <p className="text-lg gold-text">₹ {Number(editingProduct.price || 0).toLocaleString()}</p>
                  </div>
                </div>

                {/* Right: Form */}
                <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
                  <div className="flex justify-between items-start mb-12">
                    <div>
                      <p className="text-[10px] tracking-[0.6em] text-[#C6A75E] uppercase font-black">Archive Management</p>
                      <h2 className="text-4xl font-serif italic">{editingProduct.id || editingProduct._id ? 'Refine Piece' : 'Curate New Masterpiece'}</h2>
                    </div>
                    <button onClick={() => setIsFormOpen(false)} className="p-2 hover:bg-white/10 transition-all">
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveProduct} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[9px] tracking-widest text-white/40 uppercase font-black">Piece Name</label>
                        <input 
                          type="text" required
                          value={editingProduct.name}
                          onChange={e => setEditingProduct({...editingProduct, name: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 px-6 py-4 text-xs tracking-widest focus:border-[#C6A75E] outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] tracking-widest text-white/40 uppercase font-black">Price (INR)</label>
                        <input 
                          type="number" required
                          value={editingProduct.price}
                          onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})}
                          className="w-full bg-white/5 border border-white/10 px-6 py-4 text-xs tracking-widest focus:border-[#C6A75E] outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[9px] tracking-widest text-white/40 uppercase font-black">Archive Category</label>
                        <select 
                          value={editingProduct.category}
                          onChange={e => setEditingProduct({...editingProduct, category: e.target.value as Category})}
                          className="w-full bg-[#111] border border-white/10 px-6 py-4 text-xs tracking-widest focus:border-[#C6A75E] outline-none transition-all uppercase"
                        >
                          {['Ladies', 'Men', 'Accessories', 'Beauty', 'Home', 'Kids'].map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] tracking-widest text-white/40 uppercase font-black">Available Stock</label>
                        <input 
                          type="number" required
                          value={editingProduct.stockQuantity}
                          onChange={e => setEditingProduct({...editingProduct, stockQuantity: Number(e.target.value)})}
                          className="w-full bg-white/5 border border-white/10 px-6 py-4 text-xs tracking-widest focus:border-[#C6A75E] outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] tracking-widest text-white/40 uppercase font-black">Visual Asset URL</label>
                      <div className="flex space-x-4">
                        <input 
                          type="text" required
                          value={editingProduct.image}
                          onChange={e => setEditingProduct({...editingProduct, image: e.target.value})}
                          className="flex-1 bg-white/5 border border-white/10 px-6 py-4 text-[10px] tracking-widest focus:border-[#C6A75E] outline-none transition-all"
                        />
                        <div className="bg-white/5 border border-white/10 p-4 flex items-center justify-center">
                          <ImageIcon className="w-5 h-5 text-white/20" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] tracking-widest text-white/40 uppercase font-black">Piece Narrative (Description)</label>
                      <textarea 
                        required rows={4}
                        value={editingProduct.description}
                        onChange={e => setEditingProduct({...editingProduct, description: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 px-6 py-4 text-xs tracking-widest focus:border-[#C6A75E] outline-none transition-all resize-none"
                      />
                    </div>

                    <button 
                      type="submit" disabled={isSaving}
                      className="w-full bg-[#C6A75E] text-black py-6 text-[11px] tracking-[0.5em] font-black uppercase hover:bg-white transition-all flex items-center justify-center space-x-4 shadow-[0_20px_40px_rgba(198,167,94,0.15)]"
                    >
                      {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Commit to Archive</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
