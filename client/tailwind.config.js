export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        luxeBlack: '#0B0B0B',
        luxeGold: '#D4AF37',
        luxeGoldLight: '#FFD700',
        softWhite: '#F5F5F5'
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #FFD700 100%)'
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Montserrat', 'sans-serif']
      }
    }
  },
  plugins: []
};
