const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 4000, // TiDB usa el 4000 por defecto
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
      ssl: {
        // Esto es lo que permite que la conexión sea segura
        ca: process.env.DB_CA_CERT, 
        rejectUnauthorized: true,
      },
    },
  }
);

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a TiDB Cloud OK');
  } catch (err) {
    console.error('❌ Error conectando a TiDB Cloud:', err);
  }
}

testConnection();

module.exports = { sequelize };