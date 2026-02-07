
export type Category = 'Ladies' | 'Men' | 'Kids' | 'Home' | 'Beauty' | 'Accessories';
export type OrderStatus = 'Identity Verification' | 'Atelier Crafting' | 'Quality Assurance' | 'Global Logistics' | 'Delivered';
export type ClientTier = 'Aspirant' | 'Aristocrat' | 'Sovereign';

export interface Product {
  id: string;
  _id?: string; // MongoDB ID
  name: string;
  price: number;
  image: string;
  hoverImage?: string;
  category: Category;
  description: string;
  details?: string[];
  care?: string[];
  stockQuantity: number;
  isFeatured?: boolean;
}

export interface User {
  id: string;
  _id?: string;
  email: string;
  role: 'user' | 'admin';
  name: string;
  tier: ClientTier;
  acquisitionsCount: number;
}

export interface Order {
  id: string;
  _id?: string;
  user: any;
  items: any[];
  total: number;
  status: OrderStatus;
  maisonKey?: string;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
  color: string;
}

export enum View {
  HOME = 'home',
  CATALOG = 'catalog',
  PRODUCT_DETAIL = 'product-detail',
  CART = 'cart',
  WISHLIST = 'wishlist',
  ADMIN_DASHBOARD = 'admin-dashboard',
  LOGIN = 'login',
  PROVENANCE = 'provenance',
  ACCOUNT = 'account'
}
