const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { body, validationResult } = require('express-validator');

// Ruta para registrar un usuario
router.post('/', [
    body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    body('email').isEmail().withMessage('El correo no es válido'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('rol').notEmpty().withMessage('El rol es obligatorio')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { nombre, email, password, rol } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        db.query(
            'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)',
            [nombre, email, hashedPassword, rol],
            (err, results) => {
                if (err) {
                    console.error('Error creando usuario:', err);
                    return res.status(500).json({ error: err.message });
                }
                res.status(201).json({ id_usuario: results.insertId, nombre, email, rol });
            }
        );
    } catch (error) {
        console.error('Error al procesar la contraseña:', error);
        res.status(500).json({ error: 'Error al procesar la contraseña' });
    }
});

// Ruta de login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM usuarios WHERE email = ?', [email], async (err, results) => {
        if (err) {
            console.error('Error en la consulta de login:', err);
            return res.status(500).json({ error: err.message });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        const token = jwt.sign({ id: user.id_usuario, nombre: user.nombre, rol: user.rol }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login exitoso', token });
    });
});

// Ruta para obtener los datos del usuario logueado
router.get('/me', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        db.query('SELECT id_usuario, nombre, email, rol FROM usuarios WHERE id_usuario = ?', [decoded.id], (err, results) => {
            if (err) {
                console.error('Error al obtener los datos del usuario:', err);
                return res.status(500).json({ error: 'Error al obtener los datos del usuario' });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            const user = results[0];
            res.status(200).json({
                id_usuario: user.id_usuario,
                nombre: user.nombre,
                email: user.email,
                rol: user.rol
            });
        });
    } catch (error) {
        console.error('Error al verificar el token:', error);
        res.status(401).json({ error: 'Token inválido o expirado' });
    }
});

module.exports = router;
