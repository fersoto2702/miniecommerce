/* src/server.js*/
require('dotenv').config();

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { syncModels } = require('./models');
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const cartRoutes = require('./routes/cart.routes');
const orderRoutes = require('./routes/order.routes');

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Test
app.get('/', (req, res) => {
  res.json({ ok: true, message: 'API MiniEcommerce funcionando ✅' });
});

// Sincronizar modelos y levantar servidor
syncModels().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
  });
});