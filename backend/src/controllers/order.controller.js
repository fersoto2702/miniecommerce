const { Cart, Order, OrderItem, Product } = require('../models');

// =======================================================
//  POST /api/orders/from-cart
//  Crear pedido a partir del carrito actual
// =======================================================
async function createOrderFromCart(req, res) {
  const t = await Order.sequelize.transaction();

  try {
    const userId = req.user.id;

    const cartItems = await Cart.findAll({
      where: { userId },
      include: [{ model: Product }],
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (!cartItems.length) {
      await t.rollback();
      return res.status(400).json({ ok: false, message: 'Carrito vacío' });
    }

    let total = 0;

    for (const item of cartItems) {
      if (item.quantity > item.Product.stock) {
        await t.rollback();
        return res.status(400).json({
          ok: false,
          message: `Stock insuficiente para ${item.Product.name}`
        });
      }

      total += item.quantity * Number(item.Product.price);
    }

    const order = await Order.create(
      { userId, total, status: 'pending' },
      { transaction: t }
    );

    for (const item of cartItems) {
      const subtotal = item.quantity * Number(item.Product.price);

      await OrderItem.create(
        {
          orderId: order.id,
          productId: item.Product.id,
          quantity: item.quantity,
          price: item.Product.price,
          subtotal
        },
        { transaction: t }
      );

      // descontar stock
      item.Product.stock -= item.quantity;
      await item.Product.save({ transaction: t });
    }

    // limpiar carrito
    await Cart.destroy({ where: { userId }, transaction: t });

    await t.commit();
    return res.status(201).json({ ok: true, orderId: order.id, total });

  } catch (err) {
    await t.rollback();
    console.error(err);
    return res.status(500).json({ ok: false, message: 'Error al crear pedido' });
  }
}

// =======================================================
//  GET /api/orders
//  Obtener pedidos del usuario actual
// =======================================================
async function getMyOrders(req, res) {
  try {
    const userId = req.user.id;

    const orders = await Order.findAll({
      where: { userId },
      include: [{ model: OrderItem, include: [Product] }],
      order: [['createdAt', 'DESC']]
    });

    return res.json({ ok: true, orders });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: 'Error al obtener pedidos' });
  }
}

// =======================================================
//  GET /api/orders/all  (Solo admin)
//  Obtener todos los pedidos del sistema
// =======================================================
async function getAllOrders(req, res) {
  try {
    const orders = await Order.findAll({
      include: [{ model: OrderItem, include: [Product] }],
      order: [['createdAt', 'DESC']]
    });

    return res.json({ ok: true, orders });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: 'Error al obtener todos los pedidos' });
  }
}

module.exports = {
  createOrderFromCart,
  getMyOrders,
  getAllOrders
};