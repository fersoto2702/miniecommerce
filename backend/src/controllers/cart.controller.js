/* src/controllers/cart.controller.js - CÓDIGO FINAL CORREGIDO */

const { Cart, Product } = require('../models');

// ==========================================================
// Función de utilidad para manejar la falta de autenticación
// ==========================================================
function checkAuthentication(req, res) {
    if (!req.user || !req.user.id) {
        // Enviar 401 Unauthorized si el usuario no está autenticado o falta el ID
        // Esto previene errores 'undefined' en el controlador
        res.status(401).json({ 
            ok: false, 
            message: 'Acceso denegado: Usuario no autenticado o ID de usuario faltante.' 
        });
        return null; 
    }
    return req.user.id;
}

// ==========================================================
// GET /api/cart
// ==========================================================
async function getCart(req, res) {
    const userId = checkAuthentication(req, res);
    if (!userId) return; 

    try {
        const items = await Cart.findAll({
            where: { userId },
            include: [{ model: Product }]
        });
        return res.json({ ok: true, items });
    } catch (err) {
        console.error('Error al obtener carrito:', err.message);
        return res.status(500).json({ ok: false, message: 'Error al obtener carrito' });
    }
}

// ==========================================================
// POST /api/cart/add
// ==========================================================
async function addToCart(req, res) {
    const userId = checkAuthentication(req, res);
    if (!userId) return; 

    const { productId, quantity } = req.body;
    console.log(`Intentando agregar producto ${productId} (Cantidad: ${quantity}) para userId: ${userId}`);

    if (!productId || typeof quantity === 'undefined' || quantity <= 0) {
        return res.status(400).json({ ok: false, message: 'Faltan datos de producto o cantidad inválida.' });
    }

    try {
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ ok: false, message: 'Producto no encontrado' });
        }

        let item = await Cart.findOne({
            where: { userId, productId }
        });

        if (item) {
            item.quantity += quantity;
            await item.save();
        } else {
            item = await Cart.create({
                userId,
                productId,
                quantity
            });
        }
        
        console.log(`DEBUG: Item de carrito creado/actualizado con ID: ${item.id}`);
        return res.status(201).json({ ok: true, item });
    } catch (err) {
        console.error('ERROR FATAL al agregar al carrito (Sequelize/DB):', err.message);
        return res.status(500).json({ ok: false, message: 'Error al agregar al carrito. Verifica las claves foráneas (userId y productId).' });
    }
}

// ==========================================================
// PUT /api/cart/:id
// ==========================================================
async function updateCartItem(req, res) {
    const userId = checkAuthentication(req, res);
    if (!userId) return;

    const { id } = req.params;
    const { quantity } = req.body;

    try {
        const item = await Cart.findOne({ where: { id, userId } });
        if (!item) {
            return res.status(404).json({ ok: false, message: 'Item no encontrado' });
        }

        item.quantity = quantity;
        await item.save();

        return res.json({ ok: true, item });
    } catch (err) {
        console.error('Error al actualizar carrito:', err.message);
        return res.status(500).json({ ok: false, message: 'Error al actualizar carrito' });
    }
}

// ==========================================================
// DELETE /api/cart/:id
// ==========================================================
async function removeCartItem(req, res) {
    const userId = checkAuthentication(req, res);
    if (!userId) return;

    const { id } = req.params;

    try {
        const item = await Cart.findOne({ where: { id, userId } });
        if (!item) {
            return res.status(404).json({ ok: false, message: 'Item no encontrado' });
        }

        await item.destroy();
        return res.json({ ok: true, message: 'Item eliminado' });
    } catch (err) {
        console.error('Error al eliminar del carrito:', err.message);
        return res.status(500).json({ ok: false, message: 'Error al eliminar del carrito' });
    }
}

// ==========================================================
// DELETE /api/cart (vaciar)
// ==========================================================
async function clearCart(req, res) {
    const userId = checkAuthentication(req, res);
    if (!userId) return;

    try {
        await Cart.destroy({ where: { userId } });
        return res.json({ ok: true, message: 'Carrito vacío' });
    } catch (err) {
        console.error('Error al vaciar carrito:', err.message);
        return res.status(500).json({ ok: false, message: 'Error al vaciar carrito' });
    }
}

// ==========================================================
// Exportación del Módulo
// ==========================================================
module.exports = {
    getCart,
    addToCart,
    updateCartItem, // <--- Ahora definida y disponible para exportar
    removeCartItem, // <--- Ahora definida y disponible para exportar
    clearCart       // <--- Ahora definida y disponible para exportar
};