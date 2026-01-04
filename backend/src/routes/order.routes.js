/* src/routes/order.routes.js*/

const express = require('express');
const router = express.Router();
const {
  createOrderFromCart,
  getMyOrders,
  getAllOrders
} = require('../controllers/order.controller');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

router.post('/from-cart', authMiddleware, createOrderFromCart);
router.get('/', authMiddleware, getMyOrders);
router.get('/all', authMiddleware, isAdmin, getAllOrders);

module.exports = router;
