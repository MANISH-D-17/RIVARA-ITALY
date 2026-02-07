
import { Product, User, Order, View } from './types';
import { PRODUCTS as INITIAL_PRODUCTS } from './constants';

// Determine API Base based on environment
const API_BASE = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api' 
  : `${window.location.origin}/api`;

class MaisonService {
  private token: string | null = localStorage.getItem('rivara_auth_token');
  private currentUser: User | null = JSON.parse(localStorage.getItem('rivara_db_session') || 'null');
  private localArchive: Product[] = JSON.parse(localStorage.getItem('rivara_local_products') || 'null');

  private async fetcher(endpoint: string, options: RequestInit = {}) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = { message: text.substring(0, 100) || 'Atelier Response Error' };
      }

      if (!response.ok) {
        const error: any = new Error(data.message || `Maison Error: ${response.status}`);
        error.status = response.status;
        throw error;
      }
      return data;
    } catch (err: any) {
      if (err.name === 'TypeError') err.status = 503;
      throw err;
    }
  }

  // AUTH
  async login(email: string, pass: string): Promise<User> {
    const data = await this.fetcher('/auth/login', { method: 'POST', body: JSON.stringify({ email, password: pass }) });
    this.setSession(data.user, data.token);
    return data.user;
  }

  async googleLogin(idToken: string): Promise<User> {
    const data = await this.fetcher('/auth/google', { method: 'POST', body: JSON.stringify({ idToken }) });
    this.setSession(data.user, data.token);
    return data.user;
  }

  async signup(name: string, email: string, pass: string): Promise<User> {
    const data = await this.fetcher('/auth/signup', { method: 'POST', body: JSON.stringify({ name, email, password: pass }) });
    this.setSession(data.user, data.token);
    return data.user;
  }

  private setSession(user: User, token: string) {
    this.currentUser = user;
    this.token = token;
    localStorage.setItem('rivara_auth_token', token);
    localStorage.setItem('rivara_db_session', JSON.stringify(user));
  }

  logout() {
    this.currentUser = null;
    this.token = null;
    localStorage.removeItem('rivara_auth_token');
    localStorage.removeItem('rivara_db_session');
  }

  getCurrentUser() { return this.currentUser; }

  // PRODUCTS
  async getProducts(): Promise<Product[]> {
    try {
      const data = await this.fetcher('/products');
      const products = Array.isArray(data) ? data : (this.localArchive || INITIAL_PRODUCTS);
      
      // Sync local state for demo consistency if the server isn't serving live data yet
      this.localArchive = products;
      localStorage.setItem('rivara_local_products', JSON.stringify(products));
      
      return products;
    } catch (err) {
      return this.localArchive || INITIAL_PRODUCTS;
    }
  }

  async deleteProduct(id: string): Promise<void> {
    try {
      await this.fetcher(`/products/${id}`, { method: 'DELETE' });
    } finally {
      // Always update local for instant UI response
      const current = this.localArchive || INITIAL_PRODUCTS;
      const updated = current.filter(p => (p.id || p._id) !== id);
      this.localArchive = updated;
      localStorage.setItem('rivara_local_products', JSON.stringify(updated));
    }
  }

  async updateProduct(id: string, productData: Partial<Product>): Promise<Product> {
    try {
      const updated = await this.fetcher(`/products/${id}`, { 
        method: 'PUT', 
        body: JSON.stringify(productData) 
      });
      return updated;
    } finally {
      // Ensure UI reflects changes immediately
      const current = this.localArchive || INITIAL_PRODUCTS;
      const updatedList = current.map(p => (p.id || p._id) === id ? { ...p, ...productData } as Product : p);
      this.localArchive = updatedList;
      localStorage.setItem('rivara_local_products', JSON.stringify(updatedList));
      return updatedList.find(p => (p.id || p._id) === id)!;
    }
  }

  async createProduct(productData: Partial<Product>): Promise<Product> {
    try {
      const newProd = await this.fetcher('/products', {
        method: 'POST',
        body: JSON.stringify(productData)
      });
      return newProd;
    } finally {
      // Ensure UI reflects changes immediately
      const newId = Math.random().toString(36).substr(2, 9);
      const newProd = { ...productData, id: newId } as Product;
      const current = this.localArchive || INITIAL_PRODUCTS;
      const updated = [newProd, ...current];
      this.localArchive = updated;
      localStorage.setItem('rivara_local_products', JSON.stringify(updated));
      return newProd;
    }
  }

  // ORDERS
  async getAllOrders(): Promise<Order[]> {
    try {
      const orders = await this.fetcher('/orders/all');
      return Array.isArray(orders) ? orders : [];
    } catch (err) {
      return [];
    }
  }

  async createOrder(items: any[], total: number): Promise<Order> {
    return await this.fetcher('/orders', {
      method: 'POST',
      body: JSON.stringify({ items, total })
    });
  }
}

export const maisonApi = new MaisonService();
