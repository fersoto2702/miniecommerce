const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false,
  }
);

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a MySQL OK');
  } catch (err) {
    console.error('❌ Error conectando a MySQL:', err);
  }
}

testConnection();

// 🔥 IMPORTANTE: exportamos un objeto con { sequelize }
module.exports = { sequelize };