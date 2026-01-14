const { Cart, Order, OrderItem, Product, User } = require('../models');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

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

// =======================================================
// Función auxiliar para generar PDF
// =======================================================
async function generateOrderPDF(order, orderItems, user) {
  return new Promise((resolve, reject) => {
    try {
      // Crear directorio de PDFs si no existe
      const pdfsDir = path.join(__dirname, '../pdfs');
      if (!fs.existsSync(pdfsDir)) {
        fs.mkdirSync(pdfsDir, { recursive: true });
      }

      const filename = `order_${order.id}_${Date.now()}.pdf`;
      const filepath = path.join(pdfsDir, filename);

      const doc = new PDFDocument();

      // Pipe to file
      const stream = fs.createWriteStream(filepath);
      doc.pipe(stream);

      // Encabezado
      doc.fontSize(20).text('Recibo de Compra', { align: 'center' });
      doc.moveDown();

      // Información de la orden
      doc.fontSize(12);
      doc.text(`Número de Orden: ${order.id}`);
      doc.text(`Fecha: ${new Date(order.createdAt).toLocaleDateString()}`);
      doc.text(`Cliente: ${user.name} (${user.email})`);
      doc.moveDown();

      // Detalles de productos
      doc.fontSize(14).text('Productos:', { underline: true });
      doc.moveDown(0.5);

      orderItems.forEach(item => {
        doc.fontSize(10);
        doc.text(`${item.quantity}x ${item.Product.name}`);
        doc.text(`Precio unitario: $${item.price}`);
        doc.text(`Subtotal: $${item.subtotal}`);
        doc.moveDown(0.5);
      });

      // Total
      doc.moveDown();
      doc.fontSize(14).text(`Total: $${order.total}`, { align: 'right' });

      // Método de pago
      doc.moveDown();
      doc.fontSize(12).text('Estado del pago: Pagado');

      // Pie de página
      doc.moveDown(2);
      doc.fontSize(8).text('Gracias por su compra!', { align: 'center' });

      doc.end();

      stream.on('finish', () => {
        resolve(filepath);
      });

      stream.on('error', (err) => {
        reject(err);
      });

    } catch (error) {
      reject(error);
    }
  });
}

// =======================================================
//  POST /api/orders/process-payment
//  Procesar pago exitoso y generar PDF
// =======================================================
async function processPayment(req, res) {
  try {
    const { orderId, paymentMethod } = req.body;
    const userId = req.user.id;

    // Obtener la orden
    const order = await Order.findOne({
      where: { id: orderId, userId },
      include: [
        { model: OrderItem, include: [Product] },
        { model: User, as: 'User' }
      ]
    });

    if (!order) {
      return res.status(404).json({ ok: false, message: 'Orden no encontrada' });
    }

    if (order.status === 'paid') {
      return res.status(400).json({ ok: false, message: 'La orden ya está pagada' });
    }

    // Generar PDF
    const pdfPath = await generateOrderPDF(order, order.OrderItems, order.User);

    // Actualizar orden con status 'paid' y pdfPath
    await order.update({
      status: 'paid',
      pdfPath: pdfPath
    });

    return res.json({
      ok: true,
      message: 'Pago procesado exitosamente',
      pdfPath: pdfPath
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: 'Error al procesar el pago' });
  }
}

module.exports = {
  createOrderFromCart,
  getMyOrders,
  getAllOrders,
  processPayment
};
