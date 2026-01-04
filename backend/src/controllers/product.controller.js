const { Product } = require('../models');
const { Op } = require('sequelize');

// GET /api/products
async function getAllProducts(req, res) {
  try {
    const { q, category, minPrice, maxPrice } = req.query;

    const where = {};

    // ================================
    // 🔍 Búsqueda por nombre / categoría
    // ================================
    if (q) {
      const term = q.toLowerCase();
      where[Op.or] = [
        { name: { [Op.substring]: term } },
        { category: { [Op.substring]: term } }
      ];
    }

    // ================================
    // 🎯 Filtro por categoría exacta
    // ================================
    if (category) {
      where.category = category;
    }

    // ================================
    // 💰 Filtros por precio
    // ================================
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price[Op.gte] = Number(minPrice);
      if (maxPrice !== undefined) where.price[Op.lte] = Number(maxPrice);
    }

    const products = await Product.findAll({
      where,
      order: [['id', 'ASC']]
    });

    return res.json({ ok: true, products });
  } catch (err) {
    console.error('Error al obtener productos:', err);
    return res.status(500).json({ ok: false, message: 'Error al obtener productos' });
  }
}

// GET /api/products/:id
async function getProductById(req, res) {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ ok: false, message: 'Producto no encontrado' });
    }

    return res.json({ ok: true, product });
  } catch (err) {
    console.error('Error al obtener producto:', err);
    return res.status(500).json({ ok: false, message: 'Error al obtener producto' });
  }
}

// POST /api/products (admin)
async function createProduct(req, res) {
  try {
    const { name, price, stock, image, category, details } = req.body;

    if (!name || price == null) {
      return res.status(400).json({ ok: false, message: 'Nombre y precio son obligatorios' });
    }

    const product = await Product.create({
      name,
      price,
      stock: stock ?? 0,
      image,
      category,
      details: details ?? null
    });

    return res.status(201).json({ ok: true, product });
  } catch (err) {
    console.error('Error al crear producto:', err);
    return res.status(500).json({ ok: false, message: 'Error al crear producto' });
  }
}

// PUT /api/products/:id (admin)
async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ ok: false, message: 'Producto no encontrado' });
    }

    const { name, price, stock, image, category, details } = req.body;

    await product.update({
      name:      name      ?? product.name,
      price:     price     ?? product.price,
      stock:     stock     ?? product.stock,
      image:     image     ?? product.image,
      category:  category  ?? product.category,
      details:   details   ?? product.details
    });

    return res.json({ ok: true, product });
  } catch (err) {
    console.error('Error al actualizar producto:', err);
    return res.status(500).json({ ok: false, message: 'Error al actualizar producto' });
  }
}

// DELETE /api/products/:id (admin)
async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ ok: false, message: 'Producto no encontrado' });
    }

    await product.destroy();
    return res.json({ ok: true, message: 'Producto eliminado' });
  } catch (err) {
    console.error('Error al eliminar producto:', err);
    return res.status(500).json({ ok: false, message: 'Error al eliminar producto' });
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};