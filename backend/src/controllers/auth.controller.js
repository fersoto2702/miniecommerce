const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

// ======================================================
// POST /api/auth/register
// ======================================================
async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ ok: false, message: 'Faltan campos' });
    }

    const exists = await User.findOne({ where: { email } });
    if (exists) {
      return res.status(400).json({ ok: false, message: 'El correo ya está registrado' });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ ok: false, message: 'La contraseña debe tener al menos 6 caracteres' });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role: 'user'
    });

    const token = generateToken(user);

    return res.status(201).json({
      ok: true,
      message: 'Usuario registrado',
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token
    });

  } catch (err) {
    console.error('Error en register:', err);
    return res.status(500).json({ ok: false, message: 'Error en el servidor' });
  }
}

// ======================================================
// POST /api/auth/login
// ======================================================
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ ok: false, message: 'Faltan credenciales' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ ok: false, message: 'Credenciales incorrectas' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ ok: false, message: 'Credenciales incorrectas' });
    }

    const token = generateToken(user);

    return res.json({
      ok: true,
      message: 'Login exitoso',
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token
    });

  } catch (err) {
    console.error('Error en login:', err);
    return res.status(500).json({ ok: false, message: 'Error en el servidor' });
  }
}

// ======================================================
// GET /api/auth/me
// ======================================================
async function me(req, res) {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'role', 'createdAt']
    });

    if (!user) {
      return res.status(404).json({ ok: false, message: 'Usuario no encontrado' });
    }

    return res.json(user);

  } catch (err) {
    console.error('Error en me:', err);
    return res.status(500).json({ ok: false, message: 'Error en el servidor' });
  }
}

// ======================================================
// Admin — GET /api/auth/users
// ======================================================
async function getAllUsers(req, res) {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'createdAt']
    });

    return res.json({ ok: true, users });

  } catch (err) {
    console.error('Error obteniendo usuarios:', err);
    return res.status(500).json({ ok: false, message: 'Error en el servidor' });
  }
}

// ======================================================
// POST /api/auth/reset-password
// ======================================================
async function resetPassword(req, res) {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ ok: false, message: 'Faltan datos' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ ok: false, message: 'El correo no está registrado' });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ ok: false, message: 'La contraseña debe tener al menos 6 caracteres' });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    return res.json({ ok: true, message: 'Contraseña actualizada' });

  } catch (err) {
    console.error('Error en resetPassword:', err);
    return res.status(500).json({ ok: false, message: 'Error en el servidor' });
  }
}

module.exports = { register, login, me, getAllUsers, resetPassword };