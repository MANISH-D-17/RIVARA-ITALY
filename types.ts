
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  hoverImage: string;
  category: 'Ladies' | 'Men' | 'Kids' | 'Home' | 'Beauty';
  description: string;
  details: string[];
  care: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
  color: string;
}

export enum View {
  HOME = 'home',
  PRODUCT_DETAIL = 'product-detail',
  CART = 'cart',
  CHECKOUT = 'checkout',
  LOGIN = 'login',
  SIGNUP = 'signup'
}
