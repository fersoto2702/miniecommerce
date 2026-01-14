/* src/models/index.js*/

const { sequelize } = require('../config/db');
const User = require('./User');
const Product = require('./Product');
const Cart = require('./Cart');
const Order = require('./Order');
const OrderItem = require('./OrderItem');

// Relaciones

// Usuario - Carrito
User.hasMany(Cart, { foreignKey: 'userId' });
Cart.belongsTo(User, { foreignKey: 'userId' });

// Producto - Carrito
Product.hasMany(Cart, { foreignKey: 'productId' });
Cart.belongsTo(Product, { foreignKey: 'productId' });

// Usuario - Órdenes
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

// Órdenes - Items
Order.hasMany(OrderItem, { foreignKey: 'orderId' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

// Producto - Items
Product.hasMany(OrderItem, { foreignKey: 'productId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId' });

async function syncModels() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado a MySQL');

    await sequelize.sync({ alter: true });
    console.log('✅ Modelos sincronizados');
  } catch (err) {
    console.error('❌ Error al sincronizar modelos:', err.message);
    process.exit(1);
  }
}

module.exports = {
  sequelize,
  User,
  Product,
  Cart,
  Order,
  OrderItem,
  syncModels
};
