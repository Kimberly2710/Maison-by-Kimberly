const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');
const homepageRoutes = require('./routes/homepage');
app.use('/api/products', productRoutes);
app.use('/api/homepage', homepageRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({ message: '✦ Maison by Kimberly API running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✦ Server running on http://localhost:${PORT}`);
});