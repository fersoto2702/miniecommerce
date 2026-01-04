/* src/routes/cart.routes.js*/

const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart
} = require('../controllers/cart.controller');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, getCart);
router.post('/add', authMiddleware, addToCart);
router.put('/:id', authMiddleware, updateCartItem);
router.delete('/:id', authMiddleware, removeCartItem);
router.delete('/', authMiddleware, clearCart);

module.exports = router;
