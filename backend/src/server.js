/* src/server.js */
require('dotenv').config();

const express = require('express');
const cors = require('cors');

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

// Test y Endpoints Temporales
app.get('/', (req, res) => {
  res.json({ ok: true, message: 'API MiniEcommerce funcionando ✅' });
});

app.get('/test', (req, res) => {
  res.json({
    ok: true,
    message: 'Conexión funcionando - backend reachable ✅',
    timestamp: new Date().toISOString()
  });
});

// Exportar para Vercel
module.exports = app;

// Desarrollo local
if (require.main === module) {
  // Sincronizar modelos SOLO en desarrollo local
  syncModels().then(() => {
    console.log('✅ Modelos sincronizados');
  }).catch((err) => {
    console.error('❌ Error al sincronizar modelos:', err.message);
    process.exit(1);
  });

  app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
  });
}
