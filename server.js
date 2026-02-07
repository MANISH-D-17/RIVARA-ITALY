
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const mongoSanitize = require('express-mongo-sanitize');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

// 1. Security Headers
app.use(helmet({
  contentSecurityPolicy: false, 
}));

// 2. CORS configuration for production
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 3. Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: 'Sovereign security protocols triggered: Too many requests.'
});
app.use('/api/', limiter);

// 4. Body Parsers & Sanitization
app.use(express.json({ limit: '10kb' })); // Limit body size
app.use(mongoSanitize()); // Prevent NoSQL Injection

// 5. Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Health Check
app.get('/health', (req, res) => res.status(200).send('Rivara Infrastructure Online'));

// 6. DB Connection & Execution
const MONGO_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5000;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('--- RIVARA ITALY ---');
    console.log('Sovereign Database Authenticated');
    app.listen(PORT, () => console.log(`Atelier Engine running on port ${PORT}`));
  })
  .catch(err => {
    console.error('Database Protocol Failure:', err.message);
    process.exit(1);
  });
