const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Obtener todos los equipos de un torneo
router.get('/:id_torneo', (req, res) => {
    const { id_torneo } = req.params;
    db.query(
        'SELECT * FROM equipos WHERE torneo_id = ?',
        [id_torneo],
        (err, results) => {
            if (err) {
                console.error('Error obteniendo equipos:', err);
                return res.status(500).json({ error: err.message });
            }
            res.status(200).json(results);
        }
    );
});

// Crear un nuevo equipo en un torneo
router.post('/', (req, res) => {
    const { nombre, torneo_id } = req.body;
    db.query(
        'INSERT INTO equipos (nombre, torneo_id) VALUES (?, ?)',
        [nombre, torneo_id],
        (err, results) => {
            if (err) {
                console.error('Error creando equipo:', err);
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ id: results.insertId, nombre, torneo_id });
        }
    );
});

module.exports = router;
