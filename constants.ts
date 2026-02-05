
import { Product } from './types';

export const COLORS = {
  primary: '#050505',
  secondary: '#F5F5F0',
  accent: '#C6A75E',
  text: '#F5F5F0'
};

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Atelier Midnight Blazer',
    price: 24990,
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800',
    hoverImage: 'https://images.unsplash.com/photo-1544022613-e87ce7526ed1?auto=format&fit=crop&q=80&w=800',
    category: 'Ladies',
    description: 'A masterpiece in midnight velvet and silk lining. Hand-tailored in our Milan atelier.',
    details: ['Premium Italian Velvet', 'Silk Lapels', 'Gold-dipped buttons', 'Bespoke fit'],
    care: ['Dry clean only', 'Store in a climate-controlled wardrobe']
  },
  {
    id: '2',
    name: 'Rivara Noir Evening Gown',
    price: 48490,
    image: 'https://images.unsplash.com/photo-1568252542512-9fe8fe9c87bb?auto=format&fit=crop&q=80&w=800',
    hoverImage: 'https://images.unsplash.com/photo-1539109132314-3477524c859c?auto=format&fit=crop&q=80&w=800',
    category: 'Ladies',
    description: 'Floor-length silk crepe de chine. Elegance redefined for the modern aristocrat.',
    details: ['100% Mulberry Silk', 'Hand-stitched hems', 'Hidden zip closure'],
    care: ['Delicate dry clean', 'Hand wash cold']
  },
  {
    id: '3',
    name: 'Vittorio Gold Clutch',
    price: 18750,
    image: 'https://images.unsplash.com/photo-1566150905458-1bf1fd113f0d?auto=format&fit=crop&q=80&w=800',
    hoverImage: 'https://images.unsplash.com/photo-1584917033904-493bb3c399b3?auto=format&fit=crop&q=80&w=800',
    category: 'Ladies',
    description: 'Gold-leaf embossed calf leather. A statement of pure opulence.',
    details: ['24k Gold leaf accents', 'Genuine Calf Leather', 'Suede lining'],
    care: ['Clean with professional leather kit', 'Store in dust bag']
  },
  {
    id: '4',
    name: 'Imperial Chronograph',
    price: 112990,
    image: 'https://images.unsplash.com/photo-1547996160-81dfa63595dd?auto=format&fit=crop&q=80&w=800',
    hoverImage: 'https://images.unsplash.com/photo-1509048191080-d2984bad6ad5?auto=format&fit=crop&q=80&w=800',
    category: 'Beauty',
    description: 'Automatic movement with 18k solid gold casing. The ultimate timepiece.',
    details: ['Swiss Movement', 'Solid Gold Case', 'Alligator strap'],
    care: ['Service every 3 years', 'Water resistant to 50m']
  },
  {
    id: '5',
    name: 'Milano Cashmere Coat',
    price: 38250,
    image: 'https://images.unsplash.com/photo-1539533377285-3c121455111d?auto=format&fit=crop&q=80&w=800',
    hoverImage: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=800',
    category: 'Men',
    description: 'Pure vicuña-style cashmere. Softness beyond imagination.',
    details: ['100% Premium Cashmere', 'Hand-finished seams', 'Breathable knit'],
    care: ['Hand wash cold', 'Lay flat to dry']
  },
  {
    id: '6',
    name: 'Royal Silk Shirt',
    price: 14490,
    image: 'https://images.unsplash.com/photo-1610384024040-06013b379667?auto=format&fit=crop&q=80&w=800',
    hoverImage: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&q=80&w=800',
    category: 'Men',
    description: 'Italian silk weave with mother-of-pearl buttons. The summit of formal wear.',
    details: ['100% Italian Silk', 'Bespoke tailoring', 'Mother-of-pearl buttons'],
    care: ['Delicate wash', 'Low heat iron']
  },
  {
    id: '7',
    name: 'Tuscany Leather Jacket',
    price: 45990,
    image: 'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d50d?auto=format&fit=crop&q=80&w=800',
    hoverImage: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?auto=format&fit=crop&q=80&w=800',
    category: 'Men',
    description: 'Full-grain lambskin with gold hardware. For those who lead.',
    details: ['Top-grain Lambskin', 'Gold-plated zippers', 'Quilted lining'],
    care: ['Leather specialist only', 'Avoid moisture']
  },
  {
    id: '8',
    name: 'Elite Chelsea Boots',
    price: 26999,
    image: 'https://images.unsplash.com/photo-1638247025967-b4e38f6a1176?auto=format&fit=crop&q=80&w=800',
    hoverImage: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&q=80&w=800',
    category: 'Men',
    description: 'Polished calfskin with a hand-painted finish. Masterful craftsmanship.',
    details: ['Blake-stitched sole', 'Hand-polished leather', 'Elasticated side panels'],
    care: ['Polish with luxury wax', 'Store with shoe trees']
  }
];

export const CATEGORIES = [
  { name: 'Ladies', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800' },
  { name: 'Men', image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=800' },
  { name: 'Kids', image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&q=80&w=800' },
  { name: 'Home', image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800' },
  { name: 'Beauty', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800' }
];
