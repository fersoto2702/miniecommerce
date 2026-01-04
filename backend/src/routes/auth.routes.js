const express = require('express');
const router = express.Router();

const { 
  register,
  login,
  resetPassword,
  me,
  getAllUsers
} = require('../controllers/auth.controller');

const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

// ===============================
// Registro
// ===============================
router.post('/register', register);

// ===============================
// Login
// ===============================
router.post('/login', login);

// ===============================
// Obtener datos del usuario logueado
// ===============================
router.get('/me', authMiddleware, me);

// ===============================
// Reset password
// ===============================
router.post('/reset-password', resetPassword);

// ===============================
// Obtener TODOS los usuarios (solo admin)
// ===============================
router.get('/users', authMiddleware, isAdmin, getAllUsers);

module.exports = router;