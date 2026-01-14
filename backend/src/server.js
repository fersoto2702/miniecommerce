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

// 🔧 TEMPORAL: Endpoint de prueba sin DB para verificar conexión
app.get('/test', (req, res) => {
  res.json({
    ok: true,
    message: 'Conexión funcionando - backend reachable ✅',
    timestamp: new Date().toISOString()
  });
});

// 🔧 TEMPORAL: Mock login para probar conexión frontend-backend
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  // Mock validation
  if (email === 'test@test.com' && password === '123456') {
    res.json({
      ok: true,
      token: 'mock_jwt_token_123',
      user: {
        id: 1,
        name: 'Usuario Test',
        email: 'test@test.com',
        role: 'user'
      },
      message: 'Login exitoso (mock)'
    });
  } else {
    res.status(401).json({
      ok: false,
      message: 'Credenciales incorrectas'
    });
  }
});

// Sincronizar modelos (con manejo de errores para producción)
syncModels().then(() => {
  console.log('✅ Modelos sincronizados');
}).catch((err) => {
  console.error('❌ Error al sincronizar modelos:', err.message);
  // En producción, no salir del proceso - permitir que la app siga funcionando
  if (require.main === module) {
    console.error('🔧 Modo desarrollo: saliendo por error de DB');
    process.exit(1);
  } else {
    console.warn('🔧 Modo serverless: continuando sin sincronización de DB');
  }
});

// Exportar la app para Vercel (serverless)
module.exports = app;

// Para desarrollo local
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
  });
}
