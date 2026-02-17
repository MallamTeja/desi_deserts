const path = require('path');
require('dotenv').config({
  path: process.env.NODE_ENV === 'production' ? null : path.join(__dirname, '../.env')
});
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');

const Dessert = require('./models/Dessert');
const Order = require('./models/Order');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
const mongoUri = process.env.mongodbfromenv || process.env.MONGODB_URI;
mongoose.connect(mongoUri, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

// Middleware
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'", "http://localhost:3000", "https://*.vercel.app", "https://*.render.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  })
);
app.use(express.json());

// API Routes

// Get all desserts
app.get('/api/desserts', async (req, res) => {
  try {
    const desserts = await Dessert.find();
    res.json(desserts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single dessert
app.get('/api/desserts/:id', async (req, res) => {
  try {
    const dessert = await Dessert.findById(req.params.id);
    if (!dessert) return res.status(404).json({ error: 'Dessert not found' });
    res.json(dessert);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new order
app.post('/api/orders', async (req, res) => {
  try {
    // Generate a simple order ID if not provided (or rely on frontend to send one)
    // Here we assume frontend sends order_id or we generate one. 
    // Mongoose schema requires order_id.
    const orderData = req.body;
    if (!orderData.order_id) {
      orderData.order_id = 'ORD-' + Date.now() + Math.floor(Math.random() * 1000);
    }

    const newOrder = new Order(orderData);
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all orders (for Admin)
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ created_at: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update order status (for Admin)
app.patch('/api/orders/:id', async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedOrder);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Mock Login (for Admin)
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  // Simple hardcoded check
  if (email === 'admin@example.com' && password === 'admin123') {
    res.json({ user: { id: 'admin-1', email }, role: 'admin' });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running!' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
